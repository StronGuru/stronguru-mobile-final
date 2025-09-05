import { useCallback, useRef } from "react";
import type { FlatList } from "react-native";

export function useChatScrollNative<T>() {
  const listRef = useRef<FlatList<T> | null>(null);
  const scrollToBottom = useCallback(() => {
    if (!listRef.current) return;
    try {
      listRef.current.scrollToEnd({ animated: true });
    } catch {}
  }, []);
  return { listRef, scrollToBottom };
}
