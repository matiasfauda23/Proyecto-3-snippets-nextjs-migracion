# Registro de bugs

Bugs detectados durante la lectura del proyecto original y durante la migración
a Next.js, con su causa y su corrección. Se separan en **preexistentes** (ya
estaban en el proyecto React + Vite) y **de migración** (los introdujo el propio
proceso de portar el código).

---

## Bugs preexistentes

### 1. El feedback de "¡Copiado!" se cortaba antes de tiempo

- **Qué pasaba:** al copiar dos snippets distintos con menos de dos segundos de
  diferencia, el cartel de "¡Copiado!" del segundo desaparecía casi enseguida.
- **Por qué pasaba:** `handleCopy` limpiaba el timeout anterior *antes* de
  `await copyToClipboard(...)`. Con dos clics rápidos, ambas llamadas pasaban ese
  guard con el ref todavía vacío, así que el `setTimeout` del primer clic quedaba
  vivo y al dispararse borraba el estado del segundo.
- **Cómo se solucionó:** el callback del timeout ahora compara el id antes de
  limpiar el estado, en lugar de borrarlo a ciegas.
- **Commit:** `a0b786a`

### 2. El formulario de edición no se recargaba al cambiar de snippet

- **Qué pasaba:** si se abría la edición de un snippet y, sin cerrarla, se pasaba
  a editar otro, el formulario seguía mostrando los datos del primero.
- **Por qué pasaba:** el estado local se inicializa con
  `useState(getInitialFormData(snippetToEdit))`, y React solo usa ese valor en el
  primer render. Cambiar la prop no vuelve a inicializar el estado.
- **Cómo se solucionó:** se le pasa `key={snippet.id}` al `SnippetForm` desde
  `SnippetList`, para que React desmonte y vuelva a montar el componente.
- **Commit:** `b6eab65`

### 3. Los selects de filtros tenían un orden impredecible

- **Qué pasaba:** las opciones de "lenguaje" y "etiqueta" salían en el orden en
  que los snippets se habían creado, y cambiaban de lugar al agregar o borrar uno.
- **Por qué pasaba:** las listas se derivaban de un `Set` sin ordenar.
- **Cómo se solucionó:** se les aplicó `.sort((a, b) => a.localeCompare(b, "es"))`.
- **Commit:** `b7c85fb`

### 4. El hover de los botones de filtro parecía deshabilitado

- **Qué pasaba:** al pasar el mouse por "Limpiar filtros" el botón se ponía gris
  claro (`#d0d0d0`), que se lee como estado deshabilitado en vez de interactivo.
- **Por qué pasaba:** el color de hover era más apagado que el de reposo.
- **Cómo se solucionó:** se cambió a `#2563eb`, que da contraste suficiente
  contra el texto y se lee como acción disponible.
- **Commit:** `31d3d0c`

### 5. La fuente monoespaciada nunca se cargaba

- **Qué pasaba:** los bloques de código se veían con la monoespaciada por defecto
  del sistema en cualquier máquina que no tuviera Fira Code instalada.
- **Por qué pasaba:** `index.css` declaraba `font-family: "Fira Code", ...` pero
  el proyecto nunca cargaba la fuente, ni por CSS ni por CDN.
- **Cómo se solucionó:** se carga con `next/font/google` desde `app/layout.tsx`,
  que la expone como la variable `--font-fira-code`, y la hoja de estilos la
  consume con `var(--font-fira-code)`.
- **Commits:** `32d3b41`, `e32ed00`

### 6. `highlight.js` registraba los lenguajes al importar el módulo

- **Qué pasaba:** en Vite pasaba desapercibido, pero en Next.js el registro se
  ejecutaba también del lado del servidor con solo importar el archivo, sin forma
  de diferirlo.
- **Por qué pasaba:** las once llamadas a `hljs.registerLanguage(...)` estaban en
  el cuerpo del módulo, no dentro de una función.
- **Cómo se solucionó:** se encapsularon en `ensureHighlightJs()`, idempotente
  gracias a un flag de módulo, invocada dentro del `useMemo` del componente.
- **Commit:** `81adb8f`

### 7. El mapa de alias de lenguajes era una segunda fuente de verdad

- **Qué pasaba:** el mapa tenía 14 entradas, 8 de ellas mapeos identidad
  (`css` a `css`), en paralelo a lo que ya sabía `highlight.js`. Si se registraba
  un lenguaje nuevo y nadie tocaba el mapa, quedaba inaccesible.
- **Cómo se solucionó:** el mapa bajó a las 5 abreviaturas que escribe el usuario
  (`js`, `jsx`, `py`, `ts`, `tsx`) y el resto lo valida `hljs.getLanguage`, que
  además resuelve los alias internos de la librería.
- **Commit:** `81adb8f`

---

## Bugs introducidos por la migración

### 8. La hoja de estilos global no estaba importada

- **Qué pasaba:** la aplicación se renderizaba completamente sin estilos.
- **Por qué pasaba:** en Vite, `index.css` se importaba desde `main.tsx`. Al
  borrar ese archivo, `globals.css` quedó huérfano y nadie lo enganchó al
  Root Layout.
- **Cómo se solucionó:** `import "./globals.css"` en `app/layout.tsx`.
- **Commit:** `31a5230`

### 9. `SnippetForm` y `SearchBar` habían perdido su markup

- **Qué pasaba:** el formulario no se veía como card y sus campos aparecían
  pegados; el buscador era un `<input>` suelto sin label ni botón de limpiar.
- **Por qué pasaba:** los componentes se reescribieron desde cero al conectarlos
  con el store en vez de portar el markup del original, así que se perdieron las
  clases `.snippet-form`, `.form-field` y todo el bloque `.search-bar`.
- **Impacto extra:** sin `<label>` reales, el formulario incumplía el requisito
  de accesibilidad "formularios con labels asociadas".
- **Cómo se solucionó:** se restauró el markup original de ambos componentes,
  junto con los helpers `normalizeTags`, `createSnippetFromForm`,
  `updateSnippetFromForm` y `validateSnippetForm`, que tampoco se habían migrado.
- **Commit:** `31a5230`

### 10. La búsqueda dejó de encontrar por etiqueta

- **Qué pasaba:** buscar el nombre de una etiqueta no devolvía los snippets que
  la tenían, aunque el placeholder del buscador seguía prometiendo "Buscar por
  título, descripción, código o etiqueta…".
- **Por qué pasaba:** `useFilteredSnippets` se reescribió y el nuevo filtro arma
  un texto con título, descripción y código solamente. El original evaluaba
  además `snippet.tags.some(...)`.
- **Cómo se solucionó:** se volvió a agregar la comprobación sobre las etiquetas.
- **Commit:** `77161ba`

### 11. Los selects de filtros podían mostrar una opción vacía

- **Qué pasaba:** con un snippet sin lenguaje o con etiquetas vacías guardado en
  `localStorage`, aparecía una opción en blanco en los desplegables.
- **Por qué pasaba:** al reescribir el hook se perdió el `.filter(Boolean)` que
  el original aplicaba antes de armar el `Set`.
- **Cómo se solucionó:** se restauró el `.filter(Boolean)` en ambas listas.
- **Commit:** `77161ba`

### 12. Un espacio en el buscador ya filtraba el listado

- **Qué pasaba:** escribir un espacio (o dejarlo al final de la búsqueda)
  descartaba resultados válidos.
- **Por qué pasaba:** el hook migrado usaba `query` tal cual; el original hacía
  `filters.query.trim().toLowerCase()`.
- **Cómo se solucionó:** se normaliza la query con `.trim().toLowerCase()` una
  sola vez antes de recorrer los snippets.
- **Commit:** `77161ba`

### 13. El sitemap y el robots apuntaban al deploy equivocado

- **Qué pasaba:** `robots.txt` declaraba el sitemap con una doble barra
  (`…vercel.app//sitemap.xml`) y la URL base era la del deploy del proyecto
  original, no la del migrado.
- **Por qué pasaba:** la constante `BASE_URL` estaba duplicada en `sitemap.ts` y
  `robots.ts`, hardcodeada y terminada en barra, y después se concatenaba con
  `/sitemap.xml`.
- **Cómo se solucionó:** la URL vive en `lib/site.ts` como única fuente de
  verdad, se resuelve desde `NEXT_PUBLIC_SITE_URL` o desde el entorno de Vercel,
  y las rutas se componen con el constructor `URL`, que normaliza las barras.
  De paso se agregó `metadataBase`, que Next necesita para resolver las URLs
  absolutas de Open Graph.
- **Commit:** `a622f17`
