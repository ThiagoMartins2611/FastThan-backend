import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("❌ A variável de ambiente MONGO_URI não foi definida.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true, // força uso de conexão segura
  tlsAllowInvalidCertificates: true, // evita falhas de handshake no Render
  serverSelectionTimeoutMS: 30000,
});

try {
  await client.connect();
  console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
} catch (error) {
  console.error("❌ Erro ao conectar ao MongoDB Atlas:", error);
}

const db = client.db(process.env.MONGO_DB);

export default db;