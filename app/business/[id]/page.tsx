// filepath: c:\Users\Elkur\OneDrive\Documentos\Programacion\Universidad\Sistemas_de_recomendacion\Taller2\Taller2_MINE4201_front\app\business\[id]\page.tsx
import { getBusinessById, getReviewsByBusinessId } from '@/lib/data'; // Ajusta la ruta
import { BusinessCard } from '@/components/business-card'; // Ajusta la ruta
// Importa un componente para mostrar reseñas (necesitarás crearlo o adaptarlo)
import { ReviewList } from '@/components/review-list';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface BusinessPageProps {
  params: { id: string };
}

// Generar metadatos dinámicos (opcional pero bueno para SEO)
export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const business = await getBusinessById(params.id);
  if (!business) {
    return { title: 'Negocio no encontrado' };
  }
  return {
    title: business.name || 'Detalles del Negocio',
    description: `Información detallada y reseñas para ${business.name}`,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const businessId = params.id;

  // Fetch de datos en paralelo
  const [business, reviews] = await Promise.all([
    getBusinessById(businessId),
    getReviewsByBusinessId(businessId)
  ]);

  // Si el negocio no se encuentra, muestra página 404
  if (!business) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Usa BusinessCard en modo detallado */}
      <BusinessCard business={business} detailed={true} />

      {/* Sección de Fotos (Ejemplo básico) */}
      {business.photos && business.photos.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Fotos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {business.photos.map((photo) => (
              <div key={photo.photo_id} className="relative aspect-square">
                 {/* Asume que las fotos están en public/photos/ */}
                 <img
                    src={`/photos/${photo.photo_id}.jpg`}
                    alt={photo.caption || `Foto de ${business.name}`}
                    className="object-cover w-full h-full rounded-md"
                    loading="lazy" // Carga diferida para mejorar rendimiento
                 />
                 {photo.caption && (
                    <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {photo.caption}
                    </p>
                 )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Reseñas */}
      <div className="mt-6">
         <h2 className="text-2xl font-semibold mb-4">Reseñas ({reviews.length})</h2>
         {/* Renderiza las reseñas usando un componente dedicado */}
         <ReviewList reviews={reviews} />
      </div>

    </div>
  );
}

// Opcional: Si quieres que las páginas se generen estáticamente en build time
// export async function generateStaticParams() {
//   // Aquí podrías obtener todos los business_id de tu base de datos
//   // const pool = getDbPool();
//   // const res = await pool.query('SELECT business_id FROM business');
//   // return res.rows.map((row) => ({ id: row.business_id }));
//   return []; // Devuelve vacío si no quieres pre-generar ninguna
// }

// Opcional: Revalidación bajo demanda o basada en tiempo si los datos cambian
// export const revalidate = 3600; // Revalidar cada hora, por ejemplo