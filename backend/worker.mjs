// Approved-answer API. No model-generated facts and no API key required.
import faq from './approved-faq.json' with {type:'json'};
const normalize=q=>q.toLowerCase().replace(/[?.!,]/g,'').replace(/[’']/g,'').replace(/\s+/g,' ').trim();
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'',allowed=(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim());
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
 const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(!allowed.includes(origin))return reply({error:'Origin not allowed.'},403);
 headers['Access-Control-Allow-Origin']=origin;
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 if(request.method!=='POST'||new URL(request.url).pathname!=='/chat')return reply({error:'Not found.'},404);
 let body;try{const raw=await request.text();if(raw.length>5000)return reply({error:'Message too long.'},413);body=JSON.parse(raw)}catch{return reply({error:'Invalid request.'},400)}
 if(typeof body.question!=='string'||!body.question.trim()||body.question.length>1200)return reply({error:'Provide a question.'},400);
 const n=normalize(body.question);const item=faq.items.find(x=>[x.question,...x.aliases].some(q=>normalize(q)===n));
 return reply({answer:item?.answer||faq.fallback,approved_id:item?.id||null,contact: item?null:'vsaik0801@gmail.com'});
}};
