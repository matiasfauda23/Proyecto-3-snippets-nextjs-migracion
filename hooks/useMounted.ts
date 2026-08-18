"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Devuelve `false` en el servidor y durante el primer render del cliente
 * (hidratación), y `true` a partir del render siguiente.
 *
 * Permite gatear el render de datos persistidos (localStorage) para evitar
 * hydration mismatches en Next.js.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
