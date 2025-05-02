import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Esta ruta nos ayudará a verificar la conexión a la base de datos
export async function GET() {
  try {
    // Prueba simple para verificar la conexión
    const result = await pool.query('SELECT 1 as test');
    
    // Verificar si hay usuarios en la tabla yelp_user
    const userCount = await pool.query('SELECT COUNT(*) as count FROM yelp_user');
    
    // Obtener una muestra de IDs de usuario
    const sampleUsers = await pool.query('SELECT user_id FROM yelp_user LIMIT 5');
    
    return NextResponse.json({
      status: 'ok',
      dbConnected: true,
      testResult: result.rows[0],
      userCount: userCount.rows[0].count,
      sampleUsers: sampleUsers.rows.map(user => user.user_id)
    });
  } catch (error) {
    console.error('Error al verificar la base de datos:', error);
    return NextResponse.json({
      status: 'error',
      dbConnected: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}