# Countries App

Una mini aplicación Next.js que consume la API de países REST para mostrar una lista de países con capacidades de filtrado y búsqueda.

## Getting Started

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecute el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Características

- Lista de países con nombre, bandera, región y población
- Búsqueda por nombre de país (sin distinción entre mayúsculas y minúsculas)
- Filtrar por región
- Filtrar por rango de población (mín./máx.)
- Ventana emergente con información detallada del país
- Persistencia de URL para filtros

## Función opcional implementada

- Persistir filtros en la URL (Persist filters in the URL)

## Tecnologías usadas

- Next.js
- TypeScript
- Tailwind CSS
