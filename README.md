# Sistema de Recomendación Híbrido - Yelp Dataset

Este proyecto es una aplicación académica para un sistema de recomendación híbrido basado en el Yelp Dataset. La aplicación está construida con Next.js (App Router), React, TypeScript y Tailwind CSS.

## Características

- Interfaz de usuario moderna y responsive
- Modo oscuro/claro con persistencia en localStorage
- Visualización de recomendaciones con explicaciones
- Filtrado por ciudad y categoría
- Detalles de negocios con mapas, fotos y reseñas
- Gráficos de métricas de experimentos
- Accesibilidad WCAG 2.1 AA

## Estructura del Proyecto

\`\`\`
root/
├─ app/ - rutas Next.js (App Router)
├─ components/ - UI genérica
├─ lib/ - lógica de la aplicación
│ ├─ hooks/ - hooks personalizados
│ ├─ mocks.ts - datos estáticos
│ ├─ types.ts - tipos TypeScript
│ └─ utils.ts - utilidades
├─ styles/ - estilos globales
├─ public/ - assets estáticos
└─ tests/ - pruebas
\`\`\`

## Requisitos

- Node.js 18.x o superior
- npm o yarn

## Instalación

1. Clona el repositorio:

\`\`\`bash
git clone https://github.com/tu-usuario/yelp-recommendation-system.git
cd yelp-recommendation-system
\`\`\`

2. Instala las dependencias:

\`\`\`bash
npm install
# o
yarn install
\`\`\`

## Ejecución

### Desarrollo

Para ejecutar el servidor de desarrollo:

\`\`\`bash
npm run dev
# o
yarn dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Producción

Para construir la aplicación para producción:

\`\`\`bash
npm run build
# o
yarn build
\`\`\`

Para iniciar el servidor de producción:

\`\`\`bash
npm run start
# o
yarn start
\`\`\`

## Pruebas

Para ejecutar las pruebas:

\`\`\`bash
npm run test
# o
yarn test
\`\`\`

## Linting

Para ejecutar el linter:

\`\`\`bash
npm run lint
# o
yarn lint
\`\`\`

## Notas Importantes

- Todos los datos son estáticos (mocks) y se encuentran en `lib/mocks.ts`
- La aplicación está estructurada para facilitar la futura integración con un backend real
- Los hooks abstraen la lógica de acceso a datos para que sea fácil reemplazar los mocks por llamadas API reales

## Páginas Principales

- `/` - Landing estática
- `/login` - Formulario de inicio de sesión
- `/dashboard` - Lista de recomendaciones con filtros
- `/business/[id]` - Detalle de negocio
- `/
