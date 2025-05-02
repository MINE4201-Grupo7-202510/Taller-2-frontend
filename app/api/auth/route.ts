import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Validar que userId existe
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    console.log('Buscando usuario con ID:', userId);

    // Consultar el usuario en la base de datos
    const userQuery = await pool.query(
      `SELECT user_id, name, review_count, yelping_since, useful, funny, cool, elite, friends, fans, average_stars FROM yelp_user WHERE user_id = $1`,
      [userId]
    );

    console.log('Resultado de la consulta:', userQuery.rows.length > 0 ? 'Usuario encontrado' : 'Usuario no encontrado');

    if (userQuery.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = userQuery.rows[0];
    console.log('Usuario encontrado:', user);
    
    // Procesar el campo elite que viene como string en la DB
    let eliteYears: string[] = [];
    if (user.elite && user.elite.trim() !== '') {
      eliteYears = user.elite.split(',').map((year: string) => year.trim());
    }
    
    // Procesar el campo friends que viene como string en la DB
    let friendsList: string[] = [];
    if (user.friends && user.friends.trim() !== '') {
      friendsList = user.friends.split(',').map((friend: string) => friend.trim());
    }

    // Formatear la respuesta
    const formattedUser = {
      ...user,
      elite: eliteYears,
      friends: friendsList,
      yelping_since: user.yelping_since ? user.yelping_since.toISOString().split('T')[0] : null, // Formatear fecha con verificación
    };

    return NextResponse.json({ user: formattedUser });
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}