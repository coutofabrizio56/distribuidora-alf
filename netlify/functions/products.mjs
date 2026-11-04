import { json, readProducts, writeProducts, validSession } from "./_utils.mjs";

export async function handler(event) {
  try {
    const method = event.httpMethod;
    const admin = validSession(event);

    if (method === "GET") {
      if (event.queryStringParameters?.all === "1" && !admin) {
        return json({ error: "No autorizado" }, 401);
      }
      const products = await readProducts(event);
      return json(admin ? products : products.filter(item => item.active !== false));
    }

    if (!admin) return json({ error: "No autorizado" }, 401);

    let products = await readProducts(event);

    if (method === "POST" || method === "PUT") {
      const item = JSON.parse(event.body || "{}");
      if (!item.name || !Number.isFinite(Number(item.price))) {
        return json({ error: "Nombre y precio son obligatorios" }, 400);
      }

      const index = products.findIndex(product => product.id === item.id);
      if (index >= 0) products[index] = item;
      else products.push(item);

      await writeProducts(event, products);
      return json({ ok: true, item });
    }

    if (method === "DELETE") {
      const { id } = JSON.parse(event.body || "{}");
      products = products.filter(product => product.id !== id);
      await writeProducts(event, products);
      return json({ ok: true });
    }

    return json({ error: "Método no permitido" }, 405);
  } catch (error) {
    console.error("Error en products:", error);
    return json({ error: "Error interno del servidor" }, 500);
  }
}
