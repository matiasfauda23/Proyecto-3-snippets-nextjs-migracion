/**
 * URL pública del sitio, única fuente de verdad para `metadataBase`,
 * el sitemap y el robots.
 *
 * En Vercel se resuelve sola con `VERCEL_PROJECT_PRODUCTION_URL`. Si el deploy
 * vive en otro lado, alcanza con definir `NEXT_PUBLIC_SITE_URL`.
 *
 * Se expone como `URL` y no como string para que las rutas se compongan con
 * `new URL(path, SITE_URL)` y no dependan de si la base termina en barra.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "http://localhost:3000";
}

export const SITE_URL = new URL(resolveSiteUrl());

export const SITE_NAME = "Biblioteca de Snippets";

export const SITE_DESCRIPTION =
  "Creá, listá, editá y eliminá tus snippets de código en un solo lugar.";
