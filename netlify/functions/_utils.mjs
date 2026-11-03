import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
export const store = getStore("alf-catalog");
export const json = (data,statusCode=200,headers={}) => ({statusCode,headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(data)});
export const readProducts = async()=>await store.get("products",{type:"json"})||[];
export const writeProducts = async p=>store.setJSON("products",p);
export const validSession = event=>{
  const cookie=event.headers.cookie||event.headers.Cookie||"";
  const token=cookie.split(";").map(x=>x.trim()).find(x=>x.startsWith("alf_session="))?.slice(12);
  if(!token||!process.env.ALF_SESSION_SECRET)return false;
  const [expires,sig]=token.split(".");
  if(!expires||!sig||Number(expires)<Date.now())return false;
  const expected=crypto.createHmac("sha256",process.env.ALF_SESSION_SECRET).update(expires).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected));
};
