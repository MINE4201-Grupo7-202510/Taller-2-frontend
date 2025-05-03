// filepath: c:\Users\Elkur\OneDrive\Documentos\Programacion\Universidad\Sistemas_de_recomendacion\Taller2\Taller2_MINE4201_front\lib\data.ts
import { getDbPool } from './db';
import type { Business, Review, Photo, User } from './types';

// Helper para parsear categorías si están como string separado por comas
function parseCategories(categoriesString: string | null): string[] {
    if (!categoriesString) return [];
    return categoriesString.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0);
}

export async function getBusinessById(id: string): Promise<Business | null> {
    const pool = getDbPool();
    try {
        // Obtener datos del negocio
        const businessRes = await pool.query<Omit<Business, 'categories' | 'photos'> & { categories: string | null }>(
            'SELECT * FROM business WHERE business_id = $1',
            [id]
        );

        if (businessRes.rows.length === 0) {
            return null;
        }

        const businessData = businessRes.rows[0];

        // Obtener fotos del negocio
        const photoRes = await pool.query<Photo>(
            'SELECT photo_id, caption, label FROM photo WHERE business_id = $1',
            [id]
        );

        // Construir el objeto Business final
        const business: Business = {
            ...businessData,
            // Asegurarse que los tipos numéricos sean números (pg puede devolverlos como string)
            latitude: businessData.latitude ? parseFloat(businessData.latitude as any) : null,
            longitude: businessData.longitude ? parseFloat(businessData.longitude as any) : null,
            stars: businessData.stars ? parseFloat(businessData.stars as any) : null,
            review_count: businessData.review_count ? parseInt(businessData.review_count as any, 10) : null,
            // Parsear categorías
            categories: parseCategories(businessData.categories),
            // Mapear fotos para incluir la ruta completa (relativa a /public)
            photos: photoRes.rows.map(p => ({
                ...p,
                // No necesitas la URL completa aquí, solo el ID para construirla en el componente
            })),
            // Asegurarse que attributes y hours sean objetos o null
            attributes: businessData.attributes || null,
            hours: businessData.hours || null,
        };

        return business;
    } catch (error) {
        console.error(`Error fetching business ${id}:`, error);
        // Podrías lanzar el error o devolver null/undefined según tu manejo de errores
        throw new Error(`Failed to fetch business data for ${id}.`);
    }
    // No es necesario liberar el cliente explícitamente cuando se usa pool.query
}

export async function getReviewsByBusinessId(businessId: string): Promise<Review[]> {
    const pool = getDbPool();
    try {
        // Obtener reseñas y datos básicos del usuario asociado
        const reviewRes = await pool.query<Omit<Review, 'user'> & { user_name: string | null }>(
            `SELECT r.*, u.name as user_name
             FROM review r
             LEFT JOIN yelp_user u ON r.user_id = u.user_id
             WHERE r.business_id = $1
             ORDER BY r.date DESC`, // O el orden que prefieras
            [businessId]
        );

        // Mapear resultados al tipo Review
        const reviews: Review[] = reviewRes.rows.map(row => ({
            review_id: row.review_id,
            user_id: row.user_id,
            business_id: row.business_id,
            stars: row.stars ? parseFloat(row.stars as any) : null,
            date: new Date(row.date).toISOString(), // Convertir a string ISO o el formato que necesites
            text: row.text,
            useful: row.useful ? parseInt(row.useful as any, 10) : null,
            funny: row.funny ? parseInt(row.funny as any, 10) : null,
            cool: row.cool ? parseInt(row.cool as any, 10) : null,
            user: { // Crear el objeto User anidado
                user_id: row.user_id,
                name: row.user_name,
                review_count: 0,
                yelping_since: new Date().toISOString(),
                friends: [],
                useful: 0,
                funny: 0,
                cool: 0,
                fans: 0,
                elite: [],
                average_stars: 0,
                compliment_hot: 0,
                compliment_more: 0,
                compliment_profile: 0,
                compliment_cute: 0,
                compliment_list: 0,
                compliment_note: 0,
                compliment_plain: 0,
                compliment_cool: 0,
                compliment_funny: 0,
                compliment_writer: 0,
                compliment_photos: 0
            }
        }));

        return reviews;
    } catch (error) {
        console.error(`Error fetching reviews for business ${businessId}:`, error);
        throw new Error(`Failed to fetch reviews for business ${businessId}.`);
    }
}