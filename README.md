# La Rampa

Carta digital mobile-first para Cafetería La Rampa. Next.js + TypeScript + Supabase + Vercel.

## Desarrollo

1. `npm install`
2. Copia `.env.example` a `.env.local` y completa las variables públicas de Supabase.
3. Ejecuta `supabase/migrations/001_initial.sql` en el proyecto Supabase.
4. `npm run dev`

La carta incluye un seed local para que la experiencia pública continúe funcionando si la base de datos no está disponible. El panel `/admin` es la interfaz demostrativa; la autenticación y persistencia se activan al conectar Supabase Auth.

## Despliegue

Importa el repositorio en Vercel, configura las dos variables de entorno y despliega `main`. Genera el QR únicamente después de fijar la URL de producción.
