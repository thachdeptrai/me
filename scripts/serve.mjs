import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const argIndex=process.argv.indexOf('--port');
const port=Number(process.env.PORT || (argIndex<0?4173:process.argv[argIndex+1]));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
const server=createServer(async(req,res)=>{
 try{const u=new URL(req.url,'http://localhost');if(u.pathname==='/me'){res.writeHead(308,{Location:'/me/'+u.search});res.end();return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 const p=decodeURIComponent(u.pathname);if(!p.startsWith('/me/')){res.writeHead(404);res.end();return;}
 const relative=p.slice(4)||'index.html';const file=resolve(root,relative);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
 if(relative.split('/').some(x=>x.startsWith('.')||x==='node_modules')||!Object.hasOwn(mime,extname(file))){res.writeHead(404);res.end();return;}
 const st=await stat(file);if(!st.isFile())throw Error('not file');const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)],'Content-Length':body.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')res.end();else res.end(body);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`THACH.OS REBORN local: http://127.0.0.1:${port}/me/`));
