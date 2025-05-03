// filepath: c:\Users\Elkur\OneDrive\Documentos\Programacion\Universidad\Sistemas_de_recomendacion\Taller2\Taller2_MINE4201_front\lib\db.ts
import { Pool } from 'pg';

export let pool: Pool;

export function getDbPool() {
  if (!pool) {
    pool = new Pool({
      user: process.env.PGUSER || 'user_yelp',
      host: process.env.PGHOST || 'localhost', // Ajusta si tu DB está en otro host
      database: process.env.PGDATABASE || 'db_yelp',
      password: process.env.PGPASSWORD || 'password1234',
      port: parseInt(process.env.PGPORT || '5432', 10), // Puerto estándar de Postgres
    });
  }
  return pool;
}