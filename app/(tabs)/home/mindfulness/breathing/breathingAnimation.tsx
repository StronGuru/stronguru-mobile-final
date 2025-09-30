import AppText from "@/components/ui/AppText";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pause, Play, Square } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";

type BreathingConfig = {
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  duration?: number; // minutes
  label?: string;
  description?: string;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function BreathingAnimationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const configJson = params.config as string | undefined;

  const config: BreathingConfig | null = useMemo(() => {
    if (!configJson) return null;
    try {
      return JSON.parse(configJson) as BreathingConfig;
    } catch {
      return null;
    }
  }, [configJson]);

  // timeline
  const totalSeconds = config?.duration ? Math.max(1, Math.round(config.duration * 60)) : undefined;
  const phases = useMemo(() => {
    if (!config) return [];
    return [
      { key: "inhale", label: "Inspira", length: Math.max(0, Math.round(config.inhale)) },
      { key: "holdIn", label: "Trattieni", length: Math.max(0, Math.round(config.holdIn)) },
      { key: "exhale", label: "Espira", length: Math.max(0, Math.round(config.exhale)) },
      { key: "holdOut", label: "Trattieni", length: Math.max(0, Math.round(config.holdOut)) }
    ].filter((p) => p.length > 0);
  }, [config]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0); // seconds elapsed
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const tickRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  // shared progress (0..1) for the current phase
  const phaseProgress = useSharedValue(0);

  // start a phase animation on JS -> update shared value withTiming
  const startPhaseAnimation = (phaseLengthSec: number) => {
    // if 0 length just set to 1 immediately
    if (phaseLengthSec <= 0) {
      phaseProgress.value = withTiming(1, { duration: 10 });
      return;
    }
    phaseProgress.value = 0;
    // animate from 0 to 1 in phaseLengthSec * 1000
    phaseProgress.value = withTiming(1, {
      duration: phaseLengthSec * 1000,
      easing: Easing.inOut(Easing.quad)
    });
  };

  // trigger haptics on phase change (run on JS)
  const triggerHaptic = async (phaseKey: string) => {
    try {
      // choose slightly different feedback for inhale/exhale
      if (phaseKey === "inhale" || phaseKey === "exhale") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.selectionAsync();
      }
    } catch (e) {
      console.log("Haptics error:", e);
      // ignore haptics errors
    }
  };

  // advance logic: compute current phase and keep elapsed
  useEffect(() => {
    if (!phases.length) return;

    // when phaseIndex changes AND we're playing, start animation for that phase and trigger haptics
    if (!isPlaying) return;
    const current = phases[phaseIndex % phases.length];
    runOnJS(triggerHaptic)(current.key);
    startPhaseAnimation(current.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, phases, isPlaying]);

  // tick handler
  useEffect(() => {
    if (!phases.length) return;
    if (!isPlaying) {
      // stop ticking
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
        lastTickRef.current = null;
      }
      return;
    }

    // start ticking every 200ms for smoothness
    lastTickRef.current = Date.now();
    tickRef.current = setInterval(() => {
      const now = Date.now();
      const last = lastTickRef.current ?? now;
      const deltaMs = Math.max(0, now - last);
      lastTickRef.current = now;

      const deltaSec = deltaMs / 1000;

      setElapsed((prev) => {
        const next = prev + deltaSec;
        // if totalSeconds defined and reached, stop and clamp
        if (totalSeconds !== undefined && next >= totalSeconds) {
          setIsPlaying(false);
          // compute final phase index at end
          const cycleLength = phases.reduce((s, p) => s + p.length, 0) || 1;
          const absoluteElapsed = totalSeconds % cycleLength;
          let acc = 0;
          for (let i = 0; i < phases.length; i++) {
            acc += phases[i].length;
            if (absoluteElapsed < acc) {
              setPhaseIndex(i);
              break;
            }
          }
          return totalSeconds;
        }

        // compute phase index for 'next' elapsed
        const cycleLength = phases.reduce((s, p) => s + p.length, 0) || 1;
        const absoluteElapsed = next % cycleLength;
        let acc = 0;
        for (let i = 0; i < phases.length; i++) {
          acc += phases[i].length;
          if (absoluteElapsed < acc) {
            setPhaseIndex(i);
            break;
          }
        }

        return next;
      });
    }, 200);

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
        lastTickRef.current = null;
      }
    };
  }, [isPlaying, phases, totalSeconds]);

  // percent progress for progress bar
  const percent = totalSeconds ? Math.min(1, elapsed / totalSeconds) : 0;

  // Animated flower: derives a scale for each petal from phaseProgress and phaseKey
  // derive petal base scale
  const baseScale = useDerivedValue(() => {
    // phaseProgress ranges 0..1
    // inhale => scale from 0.8 -> 1.15
    // exhale => scale from 1.15 -> 0.8 (inverse)
    // hold => stable (either end value)
    if (!phases.length) return 1;
    const phase = phases[phaseIndex % phases.length];
    const key = phase.key;
    if (key === "inhale") {
      return 0.8 + phaseProgress.value * 0.35;
    }
    if (key === "exhale") {
      return 0.8 + (1 - phaseProgress.value) * 0.35;
    }
    // hold phases -> hold at start or end depending previous phase
    if (key === "holdIn") {
      return 0.8 + 1 * 0.35; // full inhale scale
    }
    if (key === "holdOut") {
      return 0.8; // end of exhale
    }
    return 1;
  }, [phaseIndex, phases]);

  // animated props for each circle: radius = baseRadius * layerFactor * baseScale
  // responsive size: fill available width (with some padding) and keep a sensible min/max
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPadding = 20 * 2; // adjust if your screen padding differs
  const maxAllowed = Math.min(windowWidth - horizontalPadding, 900); // cap maximum
  const size = Math.max(390, maxAllowed); // minimum 280, otherwise fit available space
  const center = size / 2;
  const baseRadius = Math.round(size * 0.34); // scale radius with size (24% of size)

  // create animated props per layer (call hooks at top-level, not inside map)

  const animatedProps0 = useAnimatedProps(() => {
    const i = 0;
    const layerFactor = 1 - i * 0.12;
    const r = baseRadius * layerFactor * baseScale.value;
    return { r };
  });
  const animatedProps1 = useAnimatedProps(() => {
    const i = 1;
    const layerFactor = 1 - i * 0.12;
    const r = baseRadius * layerFactor * baseScale.value;
    return { r };
  });
  const animatedProps2 = useAnimatedProps(() => {
    const i = 2;
    const layerFactor = 1 - i * 0.12;
    const r = baseRadius * layerFactor * baseScale.value;
    return { r };
  });
  const animatedProps3 = useAnimatedProps(() => {
    const i = 3;
    const layerFactor = 1 - i * 0.12;
    const r = baseRadius * layerFactor * baseScale.value;
    return { r };
  });
  const animatedProps4 = useAnimatedProps(() => {
    const i = 4;
    const layerFactor = 1 - i * 0.12;
    const r = baseRadius * layerFactor * baseScale.value;
    return { r };
  });

  const togglePlay = () => {
    setIsPlaying((s) => !s);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  if (!config) {
    return (
      <ScrollView className="flex-1 px-4 py-6 bg-background" showsVerticalScrollIndicator={false}>
        <View className="p-4 bg-card rounded-lg">
          <AppText w="semi" className="text-xl mb-3">
            Config non valida
          </AppText>
        </View>
      </ScrollView>
    );
  }

  // find label for current phase
  const currentPhaseLabel = phases[phaseIndex % Math.max(1, phases.length)]?.label ?? "";

  return (
    <ScrollView className="flex-1 px-4 py-6 bg-background " contentContainerStyle={{ alignItems: "center" }} showsVerticalScrollIndicator={false}>
      <View style={{ width: "100%", maxWidth: 720 }} className="mb-4">
        {config.label !== "Custom" && (
          <AppText w="semi" className="text-lg">
            {config.label ?? "Esercizio di respirazione"}
          </AppText>
        )}
        <AppText className="text-md text-muted-foreground">{config.description}</AppText>
      </View>

      <View className="mb-4 items-center">
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size}>
            <AnimatedCircle cx={center} cy={center} fill="#6ee7b7" opacity={0.18} animatedProps={animatedProps0} />
            <AnimatedCircle cx={center} cy={center} fill="#34d399" opacity={0.16} animatedProps={animatedProps1} />
            <AnimatedCircle cx={center} cy={center} fill="#10b981" opacity={0.14} animatedProps={animatedProps2} />
            <AnimatedCircle cx={center} cy={center} fill="#059669" opacity={0.12} animatedProps={animatedProps3} />
            <AnimatedCircle cx={center} cy={center} fill="#047857" opacity={0.1} animatedProps={animatedProps4} />
          </Svg>
          {/* center label */}
          <View style={{ position: "absolute", left: 0, right: 0, top: size / 2 - 10, alignItems: "center" }}>
            <AppText w="bold" className="text-3xl text-white">
              {isPlaying ? `${currentPhaseLabel}` : "Avvia"}
            </AppText>
          </View>
        </View>
      </View>

      {/* progress bar */}
      <View style={{ width: "80%", maxWidth: 720 }} className="mb-2">
        <View className="h-3 bg-muted rounded-full overflow-hidden" style={{ width: "100%" }}>
          <Animated.View style={{ width: `${Math.round(percent * 100)}%`, height: "100%", backgroundColor: "#34d399" }} />
        </View>
        <View className="flex-row justify-between mt-2">
          <AppText className="text-sm">{new Date(elapsed * 1000).toISOString().substr(14, 5)}</AppText>
          <AppText className="text-sm">{totalSeconds ? new Date(totalSeconds * 1000).toISOString().substr(14, 5) : "--:--"}</AppText>
        </View>
      </View>

      {/*  <View>
        <AppText className="text-sm text-muted-foreground mb-4">
          {totalSeconds ? `Tempo totale: ${Math.floor(totalSeconds / 60)} min` : "Loop infinito"}
        </AppText>
      </View> */}
      {/* controls */}
      <View className="flex-row items-center justify-center gap-4">
        <TouchableOpacity
          onPress={() => {
            setElapsed(0);
            setPhaseIndex(0);
            phaseProgress.value = 0;
            setIsPlaying(false);
          }}
          className="px-4 py-3 bg-destructive border border-border rounded-md"
        >
          <Square color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} className="px-6 py-3 bg-primary rounded-full">
          <AppText w="semi" className="text-white text-lg">
            {isPlaying ? <Pause color="#FFFFFF" /> : <Play color="#FFFFFF" />}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="px-4 py-3 bg-card border border-border rounded-md">
          <AppText>Fine</AppText>
        </TouchableOpacity>
      </View>

      {/* debug: show parsed config */}
      {/*  <View className="mt-6 p-4 bg-card rounded-lg w-full">
        <AppText w="semi" className="mb-2">
          Debug config
        </AppText>
        <AppText style={{ fontFamily: "monospace" }}>{JSON.stringify(config, null, 2)}</AppText>
      </View> */}
    </ScrollView>
  );
}
