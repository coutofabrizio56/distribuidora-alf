import { json, readProducts, writeProducts, validSession } from "./_utils.mjs";
export async function handler(event){
 try{
  const method=event.httpMethod,admin=validSession(event);
  if(method==="GET"){if(event.queryStringParameters?.all==="1"&&!admin)return json({error:"No autorizado"},401);const p=await readProducts();return json(admin?p:p.filter(x=>x.active!==false));}
  if(!admin)return json({error:"No autorizado"},401);
  let products=await readProducts();
  if(method==="POST"||method==="PUT"){const item=JSON.parse(event.body||"{}");if(!item.name||!Number.isFinite(Number(item.price)))return json({error:"Nombre y precio son obligatorios"},400);const i=products.findIndex(x=>x.id===item.id);if(i>=0)products[i]=item;else products.push(item);await writeProducts(products);return json({ok:true,item});}
  if(method==="DELETE"){const {id}=JSON.parse(event.body||"{}");products=products.filter(x=>x.id!==id);await writeProducts(products);return json({ok:true});}
  return json({error:"Método no permitido"},405);
 }catch(e){return json({error:"Error interno del servidor"},500);}
}
