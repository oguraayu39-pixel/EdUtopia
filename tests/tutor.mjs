import assert from 'node:assert/strict';
import {api} from '../worker/api.js';

const page = {title:'Seasons', url:'https://example.org/seasons'};
const question = {role:'user', text:'Why does Earth have seasons?'};
const answer = 'Earth’s tilt changes the angle of sunlight during its trip around the Sun.';
const prior = {role:'atlas', text:answer, source:page};
const originalFetch = globalThis.fetch;
const calls = [];
let readResult = {content:answer, ...page};
let searchResults = [page];
let readStatus = 200;
let searchStatus = 200;
globalThis.fetch = async (input, init) => {
  const url = new URL(input);
  calls.push({url, init});
  return url.pathname.includes('/search')
    ? Response.json({results:searchResults}, {status:searchStatus})
    : Response.json(readResult, {status:readStatus});
};
async function ask(messages, env={}) {
  calls.length = 0;
  const response = await api(new Request('https://example.test/api/tutor', {
    method:'POST', body:JSON.stringify({messages})
  }), env, {});
  return {status:response.status, ...await response.json()};
}
try {
  const first = await ask([question]);
  assert.equal(first.answer,answer);
  assert.equal(first.sources[0].url,page.url);
  assert.deepEqual(calls.map(c=>c.url.pathname),['/v1/search/public','/v1/fetch/public']);
  assert.match(calls[1].url.searchParams.get('prompt'), /Why does Earth have seasons/);
  await ask([question,prior,{role:'user',text:'Why?'}]);
  assert.equal(calls.length,1);
  assert.equal(calls[0].url.searchParams.get('url'),page.url);
  assert.ok(calls[0].url.searchParams.get('prompt').includes(prior.text));
  await ask([question,prior,{role:'user',text:'Which planets have rings?'}],{KEENABLE_API_KEY:'test'});
  assert.equal(JSON.parse(calls[0].init.body).query,'Which planets have rings?');
  assert.equal(calls[1].url.pathname,'/v1/fetch');
  assert.equal(calls[1].init.headers['X-API-Key'],'test');
  readResult = {content:'NO_EVIDENCE'};
  searchResults = [page,{url:'https://example.org/other',title:'Another source'}];
  assert.equal((await ask([question,prior,{role:'user',text:'Give me an example.'}])).mode,'research-empty');
  assert.deepEqual(calls.map(c=>c.url.pathname),['/v1/fetch/public','/v1/search/public','/v1/fetch/public']);
  readStatus=503;
  assert.equal((await ask([question])).status,503);
  searchStatus=429;
  assert.equal((await ask([question])).status,503);
  assert.equal((await ask([{role:'user',text:'Thank you!'}])).mode,'welcome');
  assert.equal(calls.length,0);
} finally { globalThis.fetch=originalFetch; }
console.log('Tutor checks passed for grounded answers, follow-ups, new topics, public and keyed fetch, missing evidence and outages.');
