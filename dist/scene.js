// Optional, isolated viewer. The illustrated adventure works without this module or a GLB.
export async function mountScene(host){
 const path='/assets/addis-scene.glb';
 try{
  const probe=await fetch(path,{method:'HEAD'});
  if(!probe.ok)return false;
  await import('https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js');
  const viewer=document.createElement('model-viewer');
  viewer.setAttribute('src',path);viewer.setAttribute('camera-controls','');
  viewer.setAttribute('shadow-intensity','1');viewer.setAttribute('exposure','1');
  viewer.setAttribute('alt','Optional licensed Addis Ababa environment');
  viewer.style.cssText='width:100%;height:350px;background:#e0dfc4;border-radius:5px';
  viewer.addEventListener('error',()=>{host.textContent='The optional scene could not load. The illustrated map is still available.'});
  host.replaceChildren(viewer);return true;
 }catch{return false}
}
