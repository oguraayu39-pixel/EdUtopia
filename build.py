"""Dependency-free packager: embeds static assets in a deployable Worker ES module."""
import base64,json,pathlib
root=pathlib.Path(__file__).parent
manifest=json.loads((root/'.openai/hosting.json').read_text());manifest.pop('static',None)
(root/'.openai/hosting.json').write_text(json.dumps(manifest,indent=2)+'\n')
assets={}
for f in (root/'dist').rglob('*'):
 if f.is_file() and 'server' not in f.parts and '.openai' not in f.parts:
  ext=f.suffix;mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.webp':'image/webp','.glb':'model/gltf-binary'}.get(ext,'application/octet-stream')
  assets['/'+str(f.relative_to(root/'dist'))]={'type':mime,'data':base64.b64encode(f.read_bytes()).decode()}
for f in (root/'public/assets').glob('*.glb'):
 assets['/assets/'+f.name]={'type':'model/gltf-binary','data':base64.b64encode(f.read_bytes()).decode()}
api=(root/'worker/api.js').read_text().replace('export async function api','async function api')
script=api+'\nconst assets='+json.dumps(assets)+';\nconst curriculum='+ (root/'data/curriculum.json').read_text()+''';
export default {async fetch(request,env={}) {
 const path=new URL(request.url).pathname;
 if(path.startsWith('/api/'))return api(request,env,curriculum);
 const asset=assets[path==='/'?'/index.html':path];
 if(!asset)return new Response('Not found',{status:404});
 const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':path.startsWith('/assets/')?'public, max-age=86400':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}});
}};
'''
(root/'dist/server').mkdir(exist_ok=True)
(root/'dist/server/index.js').write_text(script)
print('Worker built:',len(assets),'assets;',len(script),'bytes')
