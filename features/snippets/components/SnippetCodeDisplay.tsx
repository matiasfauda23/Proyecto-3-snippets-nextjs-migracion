"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

type SnippetCodeDisplayProps = {
  code: string;
  language: string;
};

/**
 * Alias que highlight.js no resuelve por sí solo.
 * Los nombres canónicos (javascript, python, etc.) y los alias internos de la
 * librería (html -> xml) los valida `hljs.getLanguage`, así que acá viven
 * únicamente las abreviaturas que escribe el usuario en el formulario.
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  py: "python",
  ts: "typescript",
  tsx: "typescript",
};

let languagesRegistered = false;

/**
 * Registra los lenguajes una única vez.
 * El registro vive acá y no en el cuerpo del módulo para que importar este
 * archivo no dispare efectos secundarios: se ejecuta recién cuando el
 * componente renderiza en el cliente.
 */
function ensureHighlightJs(): void {
  if (languagesRegistered) {
    return;
  }

  hljs.registerLanguage("css", css);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("sql", sql);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("xml", xml);

  languagesRegistered = true;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Devuelve el nombre canónico del lenguaje si highlight.js sabe resolverlo,
 * o `null` si no está registrado. `hljs.getLanguage` es la única fuente de
 * verdad, de modo que la lista de alias no puede desincronizarse del registro.
 */
function normalizeLanguage(language: string): string | null {
  const trimmedLanguage = language.trim().toLowerCase();

  if (!trimmedLanguage) {
    return null;
  }

  const candidate = LANGUAGE_ALIASES[trimmedLanguage] ?? trimmedLanguage;

  return hljs.getLanguage(candidate) ? candidate : null;
}

export function SnippetCodeDisplay({ code, language }: SnippetCodeDisplayProps) {
  const { normalizedLanguage, highlightedHtml } = useMemo(() => {
    ensureHighlightJs();

    const resolved = normalizeLanguage(language);

    if (!resolved) {
      return { normalizedLanguage: null, highlightedHtml: escapeHtml(code) };
    }

    try {
      return {
        normalizedLanguage: resolved,
        highlightedHtml: hljs.highlight(code, { language: resolved }).value,
      };
    } catch {
      return { normalizedLanguage: resolved, highlightedHtml: escapeHtml(code) };
    }
  }, [code, language]);

  return (
    <pre className="snippet-code-block">
      <code
        className={
          normalizedLanguage ? `language-${normalizedLanguage}` : undefined
        }
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </pre>
  );
}
