import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/rating-stars"; // Asegúrate que este componente exista y funcione
import { Clock, ExternalLink, MapPin } from 'lucide-react';
import type { Business } from '@/lib/types'; // Ajusta la ruta si es necesario

interface BusinessCardProps {
  business: Business;
  detailed?: boolean; // Para diferenciar entre vista de lista y vista detallada
}

// Función mejorada para formatear claves de atributos
function formatAttributeKey(key: string): string {
  // Mapeo de claves conocidas a nombres más descriptivos
  const keyMap: Record<string, string> = {
    HasTV: "Tiene TV",
    Caters: "Ofrece Catering",
    Alcohol: "Alcohol",
    HappyHour: "Happy Hour",
    NoiseLevel: "Nivel de Ruido",
    BikeParking: "Estacionamiento de Bicicletas",
    DogsAllowed: "Permite Perros",
    GoodForKids: "Bueno para Niños",
    OutdoorSeating: "Asientos al Aire Libre",
    ByAppointmentOnly: "Solo con Cita Previa",
    RestaurantsAttire: "Vestimenta",
    RestaurantsTakeOut: "Para Llevar",
    RestaurantsDelivery: "A Domicilio",
    WheelchairAccessible: "Accesible Silla de Ruedas",
    BusinessAcceptsBitcoin: "Acepta Bitcoin",
    RestaurantsPriceRange2: "Rango de Precio",
    RestaurantsReservations: "Acepta Reservaciones",
    RestaurantsTableService: "Servicio a la Mesa",
    RestaurantsGoodForGroups: "Bueno para Grupos",
    BusinessAcceptsCreditCards: "Acepta Tarjetas de Crédito",
    WiFi: "Wi-Fi",
    Ambience: "Ambiente", // Claves para objetos anidados
    GoodForMeal: "Bueno para",
    BusinessParking: "Estacionamiento",
    // Agrega más mapeos según sea necesario
  };
  // Convierte camelCase a palabras separadas y capitaliza
  const formatted = keyMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  return formatted;
}

// Función mejorada para formatear valores de atributos
function formatAttributeValue(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (value === null || value === undefined || value === 'None') {
    return 'No especificado';
  }
  if (typeof value === 'string') {
    // Limpiar prefijos como u' y capitalizar
    const cleanedValue = value.startsWith("u'") ? value.substring(2, value.length - 1) : value;
    if (cleanedValue === 'no' || cleanedValue === 'none') return 'No';
    if (cleanedValue === 'yes') return 'Sí'; // Añadir manejo para 'yes'
    return cleanedValue.charAt(0).toUpperCase() + cleanedValue.slice(1);
  }
   if (typeof value === 'number') {
     // Formatear rango de precios
     if (value >= 1 && value <= 4) { // Asumiendo que es el rango de precios
        return '$'.repeat(value);
     }
    return String(value);
  }
  if (typeof value === 'object') {
    // Los objetos complejos se manejan por separado con formatNestedAttribute
    // Si llegamos aquí con un objeto, podría ser un error o un caso no manejado
    return '[Objeto complejo]'; // O alguna representación por defecto
  }
  return String(value); // Fallback
}

// Función para formatear atributos anidados (objetos dentro del JSON)
function formatNestedAttribute(obj: Record<string, any>): string {
    const trueKeys = Object.entries(obj)
        .filter(([_, val]) => val === true || (typeof val === 'string' && val.toLowerCase() === 'true'))
        // Usar formatAttributeKey para las subclaves también
        .map(([key]) => key.replace(/_/g, ' ').replace(/^./, (str) => str.toUpperCase())); // Formato simple para subclaves

    if (trueKeys.length > 0) {
        return trueKeys.join(', ');
    }

    // Si ninguna clave es true, busca valores string específicos
    const specifiedValues = Object.entries(obj)
     .filter(([_, val]) => typeof val === 'string' && val !== 'none' && val !== 'no' && val !== 'false' && val !== null && val !== undefined)
     // Usar formatAttributeKey para las subclaves también
     .map(([key, val]) => `${key.replace(/_/g, ' ').replace(/^./, (str) => str.toUpperCase())}: ${formatAttributeValue(val)}`);

    if (specifiedValues.length > 0) return specifiedValues.join(', ');

    return 'No disponible'; // O 'Ninguno'
}


export function BusinessCard({ business, detailed = false }: BusinessCardProps) {
  if (!business) {
    return null; // O mostrar un estado de carga/error
  }

  const {
    business_id,
    name,
    city,
    state,
    stars,
    review_count,
    categories = [], // Default a array vacío si es null/undefined
    hours,
    is_open,
    attributes,
    address,
    postal_code
  } = business;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl font-bold">{name || 'Nombre no disponible'}</CardTitle>
            <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              {city || 'Ciudad desconocida'}, {state || 'Estado desconocido'}
              {detailed && address && `, ${address}`}
              {detailed && postal_code && ` ${postal_code}`}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
             {stars !== null && <RatingStars rating={stars} />}
            <span className="text-xs text-muted-foreground mt-1">
              ({review_count ?? 0} reseñas)
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Categorías */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.slice(0, detailed ? undefined : 3).map((category) => (
            <span key={category} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
              {category}
            </span>
          ))}
          {!detailed && categories.length > 3 && (
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
              +{categories.length - 3} más
            </span>
          )}
        </div>

        {/* Horario */}
        {hours && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className={`font-semibold ${is_open === true ? 'text-green-600' : is_open === false ? 'text-red-600' : ''}`}>
                {is_open === true ? "Abierto ahora" : is_open === false ? "Cerrado ahora" : "Estado desconocido"}
            </span>
            {/* Mostrar horario de Lunes como ejemplo, se podría mejorar para mostrar el día actual */}
            {hours.Monday && ` • Lun: ${hours.Monday.replace('-', ' - ')}`}
          </div>
        )}

        {/* Atributos detallados */}
        {detailed && attributes && (
          <div className="mt-4 border-t pt-4">
             <h3 className="text-lg font-semibold mb-3">Detalles Adicionales</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(attributes)
                    // Filtrar los atributos complejos que se manejarán específicamente después
                    .filter(([key]) => !['Ambience', 'GoodForMeal', 'BusinessParking'].includes(key))
                    .map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium">{formatAttributeKey(key)}: </span>
                    <span className="text-muted-foreground">{formatAttributeValue(value)}</span>
                  </div>
                ))}
                {/* Manejo específico para atributos complejos */}
                {attributes.Ambience && typeof attributes.Ambience === 'object' && (
                  <div className="text-sm sm:col-span-2">
                    <span className="font-medium">{formatAttributeKey('Ambience')}: </span>
                    <span className="text-muted-foreground">{formatNestedAttribute(attributes.Ambience)}</span>
                  </div>
                )}
                 {attributes.GoodForMeal && typeof attributes.GoodForMeal === 'object' && (
                  <div className="text-sm sm:col-span-2">
                    <span className="font-medium">{formatAttributeKey('GoodForMeal')}: </span>
                    <span className="text-muted-foreground">{formatNestedAttribute(attributes.GoodForMeal)}</span>
                  </div>
                )}
                 {attributes.BusinessParking && typeof attributes.BusinessParking === 'object' && (
                  <div className="text-sm sm:col-span-2">
                    <span className="font-medium">{formatAttributeKey('BusinessParking')}: </span>
                    <span className="text-muted-foreground">{formatNestedAttribute(attributes.BusinessParking)}</span>
                  </div>
                )}
             </div>
          </div>
        )}
      </CardContent>

      {/* Footer con botón "Ver Detalles" solo si no es la vista detallada */}
      {!detailed && (
        <CardFooter className="border-t pt-4">
          <Button asChild className="w-full" variant="outline">
            <Link href={`/business/${business_id}`}>
              Ver Detalles
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}