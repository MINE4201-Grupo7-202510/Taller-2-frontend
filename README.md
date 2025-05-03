**Next.js Project**

Este repositorio contiene una aplicación web basada en Next.js. A continuación se explica cómo configurar y ejecutar el proyecto localmente.

---

## 🔧 Requisitos Previos

* **Node.js 14+** y **npm** (o **Yarn**) instalados.

  ```bash
  node --version
  npm --version
  ```
* **Git** (opcional) para clonar el repositorio.

---

## 📁 Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/nextjs-app.git
cd nextjs-app
```

También puedes descargar el ZIP desde GitHub y descomprimirlo.

---

## 🗄️ Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz con el formato:

```ini
# filepath: .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> Asegúrate de no subir este archivo a repositorios públicos.

---

## 📦 Instalación de Dependencias

Con npm:

```bash
npm install
```

O con Yarn:

```bash
yarn install
```

---

## 🚀 Modo Desarrollo

Inicia el servidor de desarrollo con:

```bash
npm run dev
# o
yarn dev
```

Abre en tu navegador `http://localhost:3000`. Cualquier cambio en el código recargará la página automáticamente.

---

## 📦 Construir y Desplegar

1. **Construir la aplicación**:

   ```bash
   npm run build
   # o
   yarn build
   ```
2. **Iniciar en modo producción**:

   ```bash
   npm start
   # o
   yarn start
   ```

Por defecto el servidor de producción corre en `http://localhost:3000`.

---

## 🛠️ Scripts Disponibles

Dentro de `package.json` encontrarás los siguientes comandos:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  }
}
```

* `dev`: ejecuta Next.js en modo desarrollo.
* `build`: compila la app para producción.
* `start`: inicia la app compilada.
* `lint`: corre ESLint.
* `test`: ejecuta pruebas unitarias (si existen).

---

## 🗂️ Estructura del Proyecto

```
nextjs-app/
├── pages/          # Rutas y páginas de Next.js
├── public/         # Archivos estáticos
├── components/     # Componentes React reutilizables
├── styles/         # Estilos CSS/SCSS
├── lib/            # Lógica externa (API, utilidades)
├── middleware.js   # Middleware global
├── next.config.js  # Configuración de Next.js
├── package.json    # Dependencias y scripts
└── .env.local      # Variables de entorno (no versionar)
```

---

## 🖼️ Documentación y Recursos

* **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
* **React**: [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)
* **Vercel Deploy**: [https://vercel.com/docs](https://vercel.com/docs)

---

¡Con esto ya tienes todo lo necesario para poner en marcha el proyecto de Next.js! 🚀
