// Atlas retrieves Keenable sources through the server for each question.
const dialogues = {
  planner:['Let’s be waste detectives. Imagine buying a banana at the market. What happens to its peel?','Keep that peel in mind. We’ll follow it from a vendor’s stall to the person who collects it.'],
  market:['Look inside a vendor’s basket. Which thing could the shopper use again tomorrow?','Imagine the vendor skips one wrapper for every sale. What could you count to find out how many wrappers that saves?'],
  sorting:['Follow one bag after the truck arrives. Where does it go next?','Suppose two bins are emptied into the same truck compartment. Where did the system break down?'],
  assessment:['Pick one of your answers. What did you see at a stop that helped you decide?','What would you change about your answer if the collector stopped accepting that material?'],
  lab:['Tell me one small change you would try first.','Who would have to help for that idea to work for a whole week?']
};
const reflectionLabels = {market:'What did you notice at the market?',sorting:'Where could the collection route break down?',assessment:'What evidence helped you choose an answer?'};
let atlasPending=false;
let dialoguePage={};
function portrait() {
  return '<img class="atlas-portrait" src="/assets/atlas-owl.webp" alt="Atlas, a teal owl with round glasses and a rolled map">';
}
function guidePanel(place) {
  const lines=dialogues[place];
  if (!lines) return '';
  const index=dialoguePage[place]||0;
  const note=reflectionLabels[place];
  return `<section class="guide-panel" aria-label="Field conversation with Atlas">
    ${portrait()}<div class="guide-content"><strong>Atlas asks</strong>
    <p class="guide-line" aria-live="polite">${lines[index]}</p>
    <div class="guide-actions"><button type="button" data-talk>Ask Atlas a question</button>
    <button type="button" data-dialogue>${index?'First clue':'Another clue'} →</button></div>
    ${note?`<form class="reflection-form"><label for="student-note">${note}</label>
    <textarea id="student-note" maxlength="1200" rows="2" placeholder="Write your thinking here…">${esc(state.reflections[place]||'')}</textarea>
    <button type="submit">Share my thinking with Atlas ↗</button></form>`:''}</div></section>`;
}
function chatPanel() {
  const last=chat.at(-1);
  return `<div class="atlas-row">${portrait()}<div><h2>Talk to Atlas</h2><small>Ask a question, share a theory, or tell me which part you’d like to unpack.</small></div></div>
    <div class="chat-log" role="log" aria-live="polite">${chat.map(item=>`<div class="chat-message ${item.role}"><small>${item.role==='user'?'YOU':esc(item.label||'ATLAS · LESSON GUIDE')}</small>${esc(item.text)}${item.notice?`<p>${esc(item.notice)}</p>`:''}${researchSources(item)}${item.url?` <a href="${esc(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer">Read source ↗</a>`:''}</div>`).join('')||`<div class="chat-message">${dialogues[screen]?.[0]||'Hi, explorer! What are you wondering about?'}</div>`}${atlasPending?'<p role="status">Atlas is reading up on your question…</p>':''}</div>
    ${last?.retryQuestion&&!atlasPending?'<button class="secondary" data-retry>Try again ↗</button>':''}
    <form id="chat-form" class="chat-form"><input id="chat-input" aria-label="Question for Atlas" placeholder="What are you curious about?" maxlength="500" ${atlasPending?'disabled':''} required><button class="primary" ${atlasPending?'disabled':''}>Send ↗</button></form>`;
}
function refreshChat() {
  if(modal!=='atlas') return;
  render();
  const log=$('.chat-log');
  log.scrollTop=log.scrollHeight;
  $('#chat-input').focus();
}
async function askTutor(question, reflection=false, retry=false) {
  if (atlasPending || !question.trim()) return;
  if (!retry) chat.push({role:'user', text:question});
  atlasPending=true;
  modal='atlas';
  refreshChat();
  let reply;
  try {
    const response=await fetch('/api/tutor', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({place:screen, reflection, messages:chat.slice(-9).map(({role,text,sources})=>({role,text,source:sources?.[0]}))}),
      signal:AbortSignal.timeout(50000)
    });
    const data=await response.json();
    if (!response.ok) throw new Error(data.error || 'Research could not be reached.');
    reply={role:'atlas', text:data.answer, sources:data.sources || [], label:'Atlas'};
    state.sources=[...new Map([...state.sources,...reply.sources.map(({title,url})=>({title,url}))].map(source=>[source.url,source])).values()].slice(-40);
    save();
  } catch(error) {
    reply={role:'atlas', label:'Atlas · Search unavailable', text:error.message.includes('JSON')?
      'Research could not be reached. Please try again.':error.name==='TimeoutError'?
      'The research search took too long. Please try again.':error.message, retryQuestion:question};
  }
  chat.push(reply);
  atlasPending=false;
  refreshChat();
}
function researchSources(item) {
  if (!item.sources?.length) return '';
  return `<details class="atlas-sources"><summary>Where I learned this</summary>${item.sources.map((source,index)=>`<article>
    <a href="${esc(safeUrl(source.url))}" target="_blank" rel="noopener noreferrer">[${index+1}] ${esc(source.title)} ↗</a>
    ${source.publishedAt?`<small>Published ${esc(source.publishedAt)}</small>`:''}
  </article>`).join('')}</details>`;
}

function bindGuide() {
  $('[data-talk]')?.addEventListener('click',()=>openModal('atlas'));
  $('[data-retry]')?.addEventListener('click',()=>{
    const question=chat.at(-1).retryQuestion;
    chat.pop();
    askTutor(question,false,true);
  });
  $('[data-dialogue]')?.addEventListener('click',event=>{
    dialoguePage[screen]=1-(dialoguePage[screen]||0);
    $('.guide-line').textContent=dialogues[screen][dialoguePage[screen]];
    event.currentTarget.textContent=dialoguePage[screen]?'First clue →':'Another clue →';
  });
  $('#student-note')?.addEventListener('input',event=>{
    state.reflections[screen]=event.target.value;
    save();
  });
  $('.reflection-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const field=$('#student-note');
    if(!field.value.trim()){field.focus();return;}
    askTutor(field.value.trim(),true);
  });
  $('#chat-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    askTutor($('#chat-input').value.trim());
  });
}

function fieldSticker(index) {
  const drawings = [
    '<path fill="#ffdf67" d="M57 22q7 24 35 28-20 12-38-8 0 24-22 34 5-17 6-31-14 15-32 8 23-7 31-30l12-7z"/><path d="M46 25q-1 12-8 20m17-17q9 13 23 18m-28-8q0 17-10 27" fill="none" stroke="#d79b34"/><path fill="#82613b" d="m43 23 2-13 9 1-2 12z"/>',
    '<path fill="#bd8253" d="M18 34 53 19l32 13-35 17z"/><path fill="#efbd7b" d="m18 34 32 15v31L18 63z"/><path fill="#d89a61" d="m50 49 35-17v31L50 80z"/><path fill="#fae7b4" d="m31 29 34 14 8-4-34-14z"/><path fill="#fae7b4" d="m65 43 8-4v12l-8 4z"/>',
    '<path fill="none" stroke-width="7" d="M32 45q5-50 35-10l3 10"/><path fill="#f7c471" d="m13 39 75 2-10 35H25z"/><path fill="#cc8853" d="M12 37h78v9H12z"/><path fill="none" stroke="#ad7847" d="m29 49 4 21m10-21 1 22m12-22-1 21m13-21-3 20M23 56l58 1m-55 8 52 1"/>'
  ];
  const colors=['#dcead1','#f4d9bb','#cfe6e7'];
  return `<svg class="field-sticker" aria-hidden="true" viewBox="0 0 100 92"><path fill="${colors[index]}" d="M10 40q1-29 28-31 36-8 50 16 19 28-4 50-32 24-62 4Q4 69 10 40Z"/><g stroke="#514b37" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round">${drawings[index]}</g><path fill="#fff9db" d="m78 10 2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>`;
}
