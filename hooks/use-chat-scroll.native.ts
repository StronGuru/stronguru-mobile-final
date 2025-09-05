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

  const scrollToBottom = useCallback((opts?: { index?: number }) => {
    try {
      const refAny = (listRef as any).current;
      if (!refAny) return;
      // prefer scrollToEnd se disponibile (scorre alla fine reale della lista)
      if (typeof refAny.scrollToEnd === "function") {
        refAny.scrollToEnd({ animated: true });
        return;
      }
      // fallback a scrollToOffset (big offset)
      if (typeof refAny.scrollToOffset === "function") {
        refAny.scrollToOffset({ offset: 9999999, animated: true });
        return;
      }
      // fallback a scrollToIndex se viene passato l'indice finale
      if (typeof refAny.scrollToIndex === "function" && typeof opts?.index === "number") {
        refAny.scrollToIndex({ index: opts!.index, animated: true });
        return;
      }
    } catch {
      // noop
    }
  }, []);

  return { listRef, scrollToBottom };
}
