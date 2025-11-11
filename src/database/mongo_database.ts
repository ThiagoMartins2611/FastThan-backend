// src/database/mongo_database.ts
import { MongoClient, Db } from "mongodb";

// 👇 Adicione isto antes de usar globalThis
declare global {
  // Aqui estamos dizendo ao TypeScript que globalThis pode ter essa propriedade
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGO_URI!;
const dbName = process.env.MONGO_DB!;

if (!uri || !dbName) {
  throw new Error("As variáveis de ambiente MONGO_URI e MONGO_DB são obrigatórias!");
}

const client = new MongoClient(uri);

// 👇 Usa cache global para evitar múltiplas conexões durante o hot-reload (tipo Next.js)
if (!globalThis._mongoClientPromise) {
  globalThis._mongoClientPromise = client.connect().then(() => {
    console.log("✅ MongoDB conectado (global)");
    return client;
  });
}

const clientPromise = globalThis._mongoClientPromise;
const db = (await clientPromise).db(dbName);

export default db;
