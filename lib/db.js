import pg from 'pg';
const { Pool } = pg;

const globalForDb = globalThis;
export const pool = globalForDb.__apmsPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000
});
if (process.env.NODE_ENV !== 'production') globalForDb.__apmsPool = pool;

export async function query(text, params = []) {
  return pool.query(text, params);
}
