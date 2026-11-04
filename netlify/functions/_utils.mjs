import { connectLambda, getStore } from "@netlify/blobs";
import crypto from "node:crypto";

export const json = (data,statusCode=200,headers={}) => ({
  statusCode,
  headers: {"Content-Type":"application/json", ...headers},
  body: JSON.stringify(data)
});

// Estas funciones usan el evento de Netlify para inicializar Blobs
// porque este proyecto utiliza el formato clásico (Lambda) de Functions.
const catalogStore = (event) => {
  connectLambda(event);
  return getStore("alf-catalog");
};

export const readProducts = async (event) =>
  await catalogStore(event).get("products", { type: "json" }) || [];

export const writeProducts = async (event, products) =>
  catalogStore(event).setJSON("products", products);

export const validSession = (event) => {
  const cookie = event.headers?.cookie || event.headers?.Cookie || "";
  const token = cookie.split(";").map(x => x.trim())
    .find(x => x.startsWith("alf_session="))?.slice(12);

  if (!token || !process.env.ALF_SESSION_SECRET) return false;

  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;

  const expected = crypto.createHmac("sha256", process.env.ALF_SESSION_SECRET)
    .update(expires).digest("hex");

  const actualBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer);
};
