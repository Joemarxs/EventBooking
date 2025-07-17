import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection pool — works for Neon with SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required by Neon
  },
});

// Create Drizzle ORM instance
const db = drizzle(pool, { schema });

export default db;
export { pool };
