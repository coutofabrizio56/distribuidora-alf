import crypto from "node:crypto";
import { json } from "./_utils.mjs";
export async function handler(event){
 if(event.httpMethod!=="POST")return json({error:"Método no permitido"},405);
 if(!process.env.ALF_ADMIN_PASSWORD||!process.env.ALF_SESSION_SECRET)return json({error:"Falta configurar el acceso en Netlify"},500);
 const {password}=JSON.parse(event.body||"{}");
 const a=Buffer.from(String(password||"")),b=Buffer.from(process.env.ALF_ADMIN_PASSWORD);
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return json({error:"Acceso denegado"},401);
 const expires=String(Date.now()+8*60*60*1000);
 const sig=crypto.createHmac("sha256",process.env.ALF_SESSION_SECRET).update(expires).digest("hex");
 return json({ok:true},200,{"Set-Cookie":`alf_session=${expires}.${sig}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`});
}
