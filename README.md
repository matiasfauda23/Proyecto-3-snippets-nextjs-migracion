# Biblioteca de Snippets — migración a Next.js 16

Aplicación para guardar, buscar, editar y organizar snippets de código, con
resaltado de sintaxis, filtros por lenguaje y etiqueta, favoritos y persistencia
en el navegador.

Este repositorio es la **migración de React + Vite a Next.js 16 (App Router) +
TypeScript** del proyecto de otro grupo, hecha como Tercer Proyecto Integrador.

## Integrantes

- Agustín Tabarcache
- Matías Fauda
- Ángeles Álvarez Lucero

## Proyecto original

- **Repositorio:** https://github.com/julietaR29/snippets-library
- **Stack:** React 19 + Vite + TypeScript, `react-router-dom`, Zustand con
  `persist`, `highlight.js`.

El objetivo no fue reescribir la aplicación sino portar su lógica y su interfaz
al modelo de Next.js, conservando la identidad visual: `app/globals.css` es el
`src/index.css` del original sin modificar, salvo los dos ajustes documentados en
[`BUGFIXES.md`](./BUGFIXES.md).

## Tecnologías

| | |
|---|---|
| Framework | Next.js 16.2.11 (App Router) |
| Lenguaje | TypeScript 5 |
| UI | React 19.2 |
| Estado | Zustand 5 + middleware `persist` sobre `localStorage` |
| Resaltado | highlight.js 11.11 (`lib/core`, 7 lenguajes registrados a demanda) |
| Fuentes | `next/font/google` (Fira Code) |
| Gestor de paquetes | pnpm |

## Cómo correrlo

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # build de producción + chequeo de TypeScript
pnpm lint
```

### Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio. Alimenta `metadataBase`, el sitemap y el robots. En Vercel se resuelve sola con `VERCEL_PROJECT_PRODUCTION_URL`; localmente cae a `http://localhost:3000`. |

## Estructura

```
app/
  layout.tsx           Root Layout: metadata, Open Graph, next/font, estilos globales
  page.tsx             Server Component puro; compone el formulario y el listado
  globals.css          Estilos migrados del index.css original
  icon.svg             Favicon
  opengraph-image.tsx  Imagen de Open Graph generada en build
  sitemap.ts           sitemap.xml
  robots.ts            robots.txt
features/snippets/
  components/          SnippetList, SnippetForm, SearchBar, SnippetFilters, SnippetCodeDisplay
  hooks/               useFilteredSnippets
  store/               store de Zustand y tipos del dominio
  utils.ts             creación, actualización, validación y portapapeles
hooks/
  useMounted.ts        guard de hidratación
lib/
  site.ts              URL y textos del sitio, fuente de verdad del SEO
```

## Decisiones de la migración

**Ruteo.** El original tenía una sola ruta (`/`) resuelta con
`createBrowserRouter`. Se reemplazó por `app/page.tsx`; `main.tsx`, `router.tsx`,
`providers.tsx`, `index.html` y `react-router-dom` se eliminaron.

**Server vs Client Components.** `app/page.tsx` y `app/layout.tsx` quedaron como
Server Components. La directiva `"use client"` se agregó únicamente donde hay
estado, efectos o eventos del navegador: `SnippetList`, `SnippetForm`,
`SearchBar`, `SnippetFilters`, `SnippetCodeDisplay`, `useFilteredSnippets` y
`useMounted`.

**Hidratación.** El estado se persiste en `localStorage`, así que el servidor
renderiza una lista vacía y el cliente los datos reales. Para evitar el hydration
mismatch, `useMounted` (implementado con `useSyncExternalStore`) devuelve `false`
en el servidor y en el primer render del cliente, y `SnippetList` muestra un
estado de carga hasta que el componente está montado.

**highlight.js.** Registraba los lenguajes en el cuerpo del módulo, lo que se
ejecutaba también en el servidor. El registro se movió a `ensureHighlightJs()`,
que se invoca dentro del `useMemo` del componente. `hljs.getLanguage` es la única
fuente de verdad para validar el lenguaje, y si no lo reconoce o si `highlight`
falla, el código se muestra como texto plano escapado — el
`dangerouslySetInnerHTML` nunca recibe contenido sin sanitizar.

## Metadatos y SEO

- `metadata` con `title` y `description` en el Root Layout.
- Open Graph: `og:title`, `og:description`, `og:image`, `og:type`, `og:locale`.
  La imagen se genera en build desde `app/opengraph-image.tsx`.
- `metadataBase` derivado de `lib/site.ts`.
- `sitemap.xml` y `robots.txt` generados por las rutas de metadata de Next.
- Jerarquía de headings del original conservada: un solo `h1`, `h2` por sección y
  `h3` por snippet.

## Optimización

- **Fuentes:** Fira Code cargada con `next/font/google` y expuesta como variable
  CSS. El original la declaraba en el CSS sin cargarla nunca.
- **Carga diferida:** `SnippetCodeDisplay` se importa con `next/dynamic`, así
  `highlight.js` y sus gramáticas no entran en el bundle inicial.
- **Code-splitting** automático por ruta del App Router.
- **`next/image`:** no aplica. El proyecto original no tiene ni una etiqueta
  `<img>`; toda su interfaz es texto, formularios y bloques de código.

## Accesibilidad

- Los cinco campos del formulario tienen su `<label>` asociada y texto visible.
- El buscador tiene `label` vinculada por `htmlFor` y el botón de limpiar tiene
  `aria-label`.
- Los selects de filtro tienen `aria-label`.
- Los errores de validación se muestran en pantalla, no solo por color.
- Se corrigió el contraste del hover de los botones de filtro, que se leía como
  estado deshabilitado.

## Bugs encontrados y corregidos

Trece hallazgos documentados en [`BUGFIXES.md`](./BUGFIXES.md): siete
preexistentes del proyecto original y seis introducidos por la propia migración.
Cada uno indica qué pasaba, por qué pasaba, cómo se solucionó y en qué commit.

## Funcionalidad extra

No se agregó funcionalidad extra. El esfuerzo se concentró en la migración, la
corrección de bugs y los requisitos de SEO, optimización y accesibilidad.

## Links

- **Repositorio:** https://github.com/matiasfauda23/Proyecto-3-snippets-nextjs-migracion
- **Deploy:** https://proyecto-3-snippets-nextjs-migracio.vercel.app
