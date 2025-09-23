import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/src/store/authStore";
import { useChatBadgeStore } from "@/src/store/chatBadgeStore";
import { useChatRoomsRefreshStore } from "@/src/store/chatRoomsRefreshStore";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

/**
 * Hook globale per il conteggio dei messaggi ricevuti non letti.
 * 
 * - Va usato in un componente sempre montato (es: layout principale o provider globale).
 * - Resta in ascolto in tempo reale tramite Supabase, anche se l'utente è su altre pagine.
 * - Aggiorna il conteggio sia quando arrivano nuovi messaggi sia quando vengono letti (apertura chat).
 * - Non dipende dal montaggio della pagina chat: il badge è sempre aggiornato ovunque nell'app.
 *
 * Restituisce il numero totale di messaggi ricevuti non letti per l'utente loggato.
 */
export function useGlobalChatRealtime() {
  const userId = useAuthStore((s) => s.userId || "");
  const setMaxUnread = useChatBadgeStore((s) => s.setMaxUnread);
  const triggerRefresh = useChatRoomsRefreshStore((s) => s.triggerRefresh);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let pollingInterval: ReturnType<typeof setInterval> | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let healthCheckInterval: ReturnType<typeof setInterval> | null = null;
    let isConnected = false;
    let lastFetchTime = 0;

    // Solo se abbiamo un userId
    if (!userId) {
      setUnreadCount(0);
      setMaxUnread(0);
      return () => {
        isMounted = false;
        if (channel) supabase.removeChannel(channel);
        if (pollingInterval) clearInterval(pollingInterval);
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        if (healthCheckInterval) clearInterval(healthCheckInterval);
        DeviceEventEmitter.removeAllListeners("unread-messages-updated");
      };
    }

    const fetchUnread = async () => {
      try {
        lastFetchTime = Date.now();
        
        // Recupera tutte le room in cui l'utente è partecipante
        const { data: partecipations, error: partecipationsError } = await supabase
          .from("room_partecipants")
          .select("room_id")
          .eq("user_id", userId);

        if (partecipationsError) {
          setUnreadCount(0);
          setMaxUnread(0);
          return;
        }

        if (!partecipations || partecipations.length === 0) {
          setUnreadCount(0);
          setMaxUnread(0);
          return;
        }

        const roomIds = partecipations.map((r) => Number(r.room_id)).filter((id) => !isNaN(id));
        
        if (roomIds.length === 0) {
          setUnreadCount(0);
          setMaxUnread(0);
          return;
        }

        // Conta tutti i messaggi non letti (chat normali + richieste)
        const { data, error } = await supabase
          .from("messages")
          .select("id, sender_id, read, room_id")
          .in("room_id", roomIds)
          .neq("sender_id", userId)
          .or("read.is.null,read.eq.false");

        if (!error && isMounted && data) {
          // Somma di tutti i messaggi non letti in tutte le room
          const count = data.length;
          setUnreadCount(count);
          setMaxUnread(count);
          triggerRefresh();
        } else if (error) {
          setUnreadCount(0);
          setMaxUnread(0);
        }
      } catch {
        setUnreadCount(0);
        setMaxUnread(0);
      }
    };

    const setupRealtimeConnection = () => {
      if (channel) {
        supabase.removeChannel(channel);
      }

      channel = supabase
        .channel(`global-unread-messages-${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          () => {
            if (isMounted) {
              fetchUnread();
            }
          }
        )
        .subscribe((status) => {
          if (!isMounted) return;
          
          if (status === 'SUBSCRIBED') {
            isConnected = true;
            // Stop polling se la connessione realtime funziona
            if (pollingInterval) {
              clearInterval(pollingInterval);
              pollingInterval = null;
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            isConnected = false;
            // Start fallback polling se realtime fallisce
            startPolling();
            // Riprova a riconnettersi dopo 5 secondi
            reconnectTimeout = setTimeout(() => {
              if (isMounted && !isConnected) {
                setupRealtimeConnection();
              }
            }, 5000);
          }
        });
    };

    const startPolling = () => {
      if (pollingInterval) return; // Già in polling
      
      pollingInterval = setInterval(() => {
        if (isMounted && !isConnected) {
          fetchUnread();
        }
      }, 10000); // Poll ogni 10 secondi quando realtime non funziona
    };

    const startHealthCheck = () => {
      healthCheckInterval = setInterval(() => {
        if (!isMounted) return;
        
        const timeSinceLastFetch = Date.now() - lastFetchTime;
        // Se non abbiamo fatto fetch per più di 2 minuti, c'è un problema
        if (timeSinceLastFetch > 120000) {
          isConnected = false;
          setupRealtimeConnection();
          startPolling();
        }
      }, 60000); // Check ogni minuto
    };

    fetchUnread();
    
    // Setup connessione realtime con retry
    setupRealtimeConnection();
    
    // Start health check
    startHealthCheck();

    // Listener per eventi custom tramite DeviceEventEmitter
    const handleCustomUpdate = () => { 
      fetchUnread(); 
    };
    DeviceEventEmitter.addListener("unread-messages-updated", handleCustomUpdate);

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
      if (pollingInterval) clearInterval(pollingInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (healthCheckInterval) clearInterval(healthCheckInterval);
      DeviceEventEmitter.removeAllListeners("unread-messages-updated");
    };
  }, [userId, setMaxUnread, triggerRefresh]);

  return unreadCount;
}

/**
 * Helper per triggerare manualmente l'aggiornamento del conteggio messaggi non letti.
 * Da usare quando si marca una chat come letta, per aggiornare immediatamente il badge.
 */
export function triggerUnreadMessagesUpdate() {
  DeviceEventEmitter.emit("unread-messages-updated");
}
