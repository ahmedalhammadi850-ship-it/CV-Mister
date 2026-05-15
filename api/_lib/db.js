import pkg from "pg";
const { Pool } = pkg;

let pool;
export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

export async function query(sql, params) {
  const client = await getPool().connect();
  try { return await client.query(sql, params); }
  finally { client.release(); }
}
