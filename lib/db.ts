import { Pool } from 'pg';

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER || 'user_yelp',
  password: process.env.DB_PASSWORD || 'password1234',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'db_yelp',
});

export { pool };