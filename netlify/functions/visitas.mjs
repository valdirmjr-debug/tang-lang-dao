// Contador de visitas do site (Netlify Functions + Netlify Blobs).
// GET  -> devolve o total fechado às 6h (horário de Brasília) do dia.
// POST -> soma uma visita (o site só envia depois de 30 s com a página aberta).
import { getStore } from "@netlify/blobs";

// Brasília é UTC-3 (sem horário de verão desde 2019). O "dia" do contador vira às 6h.
function diaDoContador(agora = Date.now()) {
  return new Date(agora - (3 + 6) * 3600e3).toISOString().slice(0, 10);
}

export default async (req) => {
  if (req.method !== "GET" && req.method !== "POST") return new Response("Método não permitido", { status: 405 });
  const store = getStore("visitas");
  const d = (await store.get("contador", { type: "json" })) || { total: 0, mostrado: 0, dia: "" };
  const hoje = diaDoContador();
  let mudou = false;
  if (d.dia !== hoje) { d.mostrado = d.total; d.dia = hoje; mudou = true; }
  if (req.method === "POST") { d.total += 1; mudou = true; }
  if (mudou) await store.setJSON("contador", d);
  return Response.json({ total: d.mostrado, desde: d.dia }, { headers: { "cache-control": "no-store" } });
};
