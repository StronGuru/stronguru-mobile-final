import { useCallback, useRef } from "react";
import type { FlatList } from "react-native";

/* export function useChatScrollNative<T>() {
  const listRef = useRef<FlatList<T> | null>(null);
  const scrollToBottom = useCallback(() => {
    if (!listRef.current) return;
    try {
      listRef.current.scrollToEnd({ animated: true });
    } catch {}
  }, []);
  return { listRef, scrollToBottom };
} */

export function useChatScrollNative<T>() {
  const listRef = useRef<FlatList<T> | null>(null);

  const scrollToBottom = useCallback((opts?: { index?: number; force?: boolean }) => {
    try {
      const refAny = (listRef as any).current;
      if (!refAny) return;
      
      // Metodo più aggressivo: prova tutti i metodi disponibili
      if (typeof refAny.scrollToEnd === "function") {
        refAny.scrollToEnd({ animated: !opts?.force });
        return;
      }
      
      // Fallback con offset molto grande
      if (typeof refAny.scrollToOffset === "function") {
        refAny.scrollToOffset({ 
          offset: 999999, 
          animated: !opts?.force 
        });
        return;
      }
      
      // Fallback con scrollToIndex all'ultimo elemento
      if (typeof refAny.scrollToIndex === "function" && typeof opts?.index === "number") {
        refAny.scrollToIndex({ 
          index: Math.max(0, opts.index - 1), 
          animated: !opts?.force,
          viewPosition: 1 // Posiziona l'elemento alla fine della vista
        });
        return;
      }
    } catch {
      // Se tutti i metodi falliscono, riprova senza animazione
      if (!opts?.force) {
        setTimeout(() => scrollToBottom({ ...opts, force: true }), 100);
      }
    }
  }, []);

  return { listRef, scrollToBottom };
}
