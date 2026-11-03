import { json } from "./_utils.mjs";
export async function handler(){return json({ok:true},200,{"Set-Cookie":"alf_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"});}
