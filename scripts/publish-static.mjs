/** Publish only the reproducible Vite artifact to the existing Pages root. */
import {readFile,writeFile,readdir,mkdir,copyFile,unlink,access} from 'node:fs/promises';
import {resolve,relative,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=resolve(root,'web/dist');
const manifest=resolve(root,'.site-build.json');
await access(resolve(source,'index.html'));
async function list(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name);if(entry.isDirectory())result.push(...await list(path));else if(entry.isFile())result.push(relative(source,path).split(sep).join('/'));}return result;}
const safe=name=>typeof name==='string'&&(name==='index.html'||name==='.nojekyll'||(/^assets\/[a-zA-Z0-9._-]+$/.test(name)));
const files=(await list(source)).sort();
if(!files.every(safe))throw new Error('Unexpected build output; refusing to overwrite repository files.');
let old=[];try{old=JSON.parse(await readFile(manifest,'utf8')).files}catch(error){if(error.code!=='ENOENT')throw error;}
if(!Array.isArray(old)||!old.every(safe))throw new Error('Invalid build manifest');
for(const name of files){const dest=resolve(root,name);await mkdir(dirname(dest),{recursive:true});await copyFile(resolve(source,name),dest);}
for(const name of old.filter(name=>!files.includes(name))){try{await unlink(resolve(root,name))}catch(error){if(error.code!=='ENOENT')throw error;}}
await writeFile(manifest,JSON.stringify({version:1,files},null,2)+'\n');
console.log(`Published ${files.length} build files to the Pages root. Legacy files were not modified.`);
