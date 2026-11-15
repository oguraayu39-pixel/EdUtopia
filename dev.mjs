import http from 'node:http';
import worker from './dist/server/index.js';
const server=http.createServer(async(req,res)=>{try{const body=[];for await(const chunk of req)body.push(chunk);const init={method:req.method,headers:req.headers};if(!['GET','HEAD'].includes(req.method))init.body=Buffer.concat(body);const response=await worker.fetch(new Request('http://localhost:4173'+req.url,init),process.env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){res.writeHead(500);res.end('Preview error');console.error(e)}});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));
