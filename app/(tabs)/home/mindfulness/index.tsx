import AppText from "@/components/ui/AppText";
import Card from "@/components/ui/Card";
import { BreathingConfig, breathingPresets, buildConfigFromCustom } from "@/utils/breathingUtils";
import { router } from "expo-router";
import { ChevronDown, ChevronUp, Info } from "lucide-react-native";
import React, { useState } from "react";
import { ImageBackground, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

export default function MindfulnessHomeScreen() {
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [infoText, setInfoText] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);

  // patternCycles: numero di cicli scelto per il preset (stringa per l'input)
  const [patternCycles, setPatternCycles] = useState<string>("1");

  // helper: compute estimated duration (returns minutes + seconds)
  const computeEstimatedDuration = (cfg: BreathingConfig | undefined, cyclesInput?: number) => {
    if (!cfg) return { minutes: undefined as number | undefined, seconds: undefined as number | undefined };
    const cycleSeconds = (cfg.inhale || 0) + (cfg.holdIn || 0) + (cfg.exhale || 0) + (cfg.holdOut || 0);
    // fallback to shown duration if cycle definition is missing
    if (!cycleSeconds) {
      const fallbackSec = cfg.duration ? Math.round(cfg.duration * 60) : undefined;
      return {
        minutes: fallbackSec !== undefined ? Math.floor(fallbackSec / 60) : undefined,
        seconds: fallbackSec !== undefined ? fallbackSec % 60 : undefined
      };
    }
    const cyclesToUse = cyclesInput ?? cfg.cycles;
    if (!cyclesToUse) {
      const fallbackSec = cfg.duration ? Math.round(cfg.duration * 60) : undefined;
      return {
        minutes: fallbackSec !== undefined ? Math.floor(fallbackSec / 60) : undefined,
        seconds: fallbackSec !== undefined ? fallbackSec % 60 : undefined
      };
    }
    const totalSec = cyclesToUse * cycleSeconds;
    return { minutes: Math.floor(totalSec / 60), seconds: totalSec % 60 };
  };

  const [customInspire, setCustomInspire] = useState<string>("4");
  const [customHold1, setCustomHold1] = useState<string>("4");
  const [customExpire, setCustomExpire] = useState<string>("4");
  const [customHold2, setCustomHold2] = useState<string>("4");
  // customCycles is number of cycles for custom pattern
  const [customCycles, setCustomCycles] = useState<string>("2"); // numero cicli

  const patterns = breathingPresets;

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // closing this section
        next.delete(key);
        // if closing patterns, reset selected pattern
        if (key === "patterns") {
          setSelectedPattern(null);
        }
      } else {
        // open only this section (close others)
        next.clear();
        next.add(key);
        // if opening custom, ensure selected pattern is cleared
        if (key === "custom") {
          setSelectedPattern(null);
        }
      }
      return next;
    });
  };

  // increment / decrement cycles (min 1)
  const incrementPatternCycles = () => setPatternCycles((prev) => String(Math.max(1, (Number(prev) || 0) + 1)));
  const decrementPatternCycles = () => setPatternCycles((prev) => String(Math.max(1, (Number(prev) || 0) - 1)));

  const incrementCustomCycles = () => {
    setCustomCycles((prev) => {
      const n = Number(prev) || 0;
      return String(Math.max(1, Math.round(n + 1)));
    });
  };
  const decrementCustomCycles = () => {
    setCustomCycles((prev) => {
      const n = Number(prev) || 0;
      return String(Math.max(1, Math.round(n - 1)));
    });
  };

  return (
    <ScrollView className="flex-1 px-4 py-6 bg-background" showsVerticalScrollIndicator={false}>
      <Card className="mb-5 p-0 ">
        <ImageBackground
          source={require("../../../../assets/images/mindfulness/breathingCard.jpeg")}
          className="h-60 justify-center items-center p-5"
          resizeMode="cover"
          imageStyle={{ borderRadius: 10 }}
        >
          <AppText w="bold" className="text-5xl text-white self-center">
            Breathing
          </AppText>
          <AppText w="semi" className="text-center text-white text-lg ">
            Esercizi di respirazione per rilassare la mente e il corpo
          </AppText>
        </ImageBackground>

        {/* Expandable Sections */}
        <View className=" py-4">
          {/* Patterns Section */}
          <View className="mb-3">
            <TouchableOpacity
              onPress={() => toggleSection("patterns")}
              className="bg-card border border-border shadow-sm rounded-lg p-4 flex-row justify-between items-center"
            >
              <AppText w="semi" className="text-lg">
                Patterns predefiniti
              </AppText>
              {expandedSections.has("patterns") ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#10b981" />}
            </TouchableOpacity>

            {expandedSections.has("patterns") && (
              <View className="mt-3 mb-8 px-2">
                <View>
                  {patterns.map((p, idx) => (
                    <View key={p.id} className="mb-2">
                      <TouchableOpacity
                        onPress={() => {
                          const preset = patterns[idx];
                          if (idx !== selectedPattern) {
                            setSelectedPattern(idx);
                            // set the input to the preset's number of cycles (fallback to duration if cycles missing)
                            setPatternCycles(String(preset.cycles ?? preset.duration ?? 1));
                          } else {
                            setSelectedPattern(idx);
                          }
                          // ensure custom section is closed when selecting a preset
                          setExpandedSections((prev) => {
                            const next = new Set(prev);
                            next.delete("custom");
                            return next;
                          });
                        }}
                        className={` p-3 rounded-md border ${selectedPattern === idx ? "border-primary bg-secondary dark:bg-muted" : "border-border bg-card"}`}
                      >
                        <View className="flex-row items-center justify-between flex-1">
                          <View>
                            <View className="flex-row gap-3">
                              <AppText w="semi" className="text-lg">
                                {p.label}
                              </AppText>
                              <AppText w="semi" className="text-lg text-primary">{`${p.inhale} - ${p.holdIn} - ${p.exhale} - ${p.holdOut}`}</AppText>
                            </View>
                            <AppText className="text-md">{`Circa: ${p.duration} min  •  Cicli: ${p.cycles ?? "-"}`}</AppText>
                          </View>

                          <View className="flex-row items-center">
                            <TouchableOpacity
                              onPress={() => {
                                setInfoText(p.description ?? "Nessuna descrizione disponibile");
                                setInfoModalVisible(true);
                              }}
                              className="mr-3"
                              accessibilityLabel={`Più info su ${p.label}`}
                            >
                              <Info size={22} color="#6b7280" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {selectedPattern === idx && (
                          <View className="mt-3 gap-3 border-t border-primary pt-5">
                            <View className="flex-row items-center mb-1 gap-2">
                              <AppText className="text-md mr-3">Numero cicli</AppText>
                              <View className="flex-row items-center shadow-sm flex-1 mr-3">
                                <TouchableOpacity onPress={decrementPatternCycles} className="px-6 py-1 bg-gray-200 dark:bg-muted-foreground rounded-l-md">
                                  <AppText className="text-3xl mt-1">-</AppText>
                                </TouchableOpacity>

                                <TextInput
                                  value={patternCycles}
                                  onChangeText={(t) => setPatternCycles(t.replace(/[^0-9]/g, ""))}
                                  keyboardType="numeric"
                                  placeholder="es. 1"
                                  className="flex-1 px-2 text-center bg-white"
                                  style={{ height: 42 }}
                                />

                                <TouchableOpacity onPress={incrementPatternCycles} className="px-6 py-1 bg-gray-200  dark:bg-muted-foreground rounded-r-md">
                                  <AppText className="text-3xl mt-1">+</AppText>
                                </TouchableOpacity>
                              </View>
                            </View>

                            {/* preview stima per preset selezionato */}
                            {selectedPattern !== null &&
                              (() => {
                                const d = computeEstimatedDuration(patterns[selectedPattern], Number(patternCycles) || undefined);
                                const display = d.minutes !== undefined ? `${d.minutes} min${d.seconds ? ` ${d.seconds} sec` : ""}` : "--";
                                return <AppText className="text-md text-center">{`Durata effettiva: ${display}`}</AppText>;
                              })()}

                            <View className="flex-row justify-center flex-1">
                              <TouchableOpacity
                                className="bg-primary px-4 py-3 rounded-md w-full items-center"
                                onPress={() => {
                                  // preset è già un BreathingConfig; sovrascrivo solo cycles se l'utente l'ha inserita
                                  const preset = patterns[selectedPattern];
                                  const parsedCycles = Number(patternCycles);
                                  const cycles = Number.isFinite(parsedCycles) && parsedCycles > 0 ? Math.round(parsedCycles) : undefined;
                                  const cycleSeconds = preset.inhale + preset.holdIn + preset.exhale + preset.holdOut;
                                  const estimatedMinutes = cycles ? Math.round((cycles * cycleSeconds) / 60) : preset.duration;
                                  const config = {
                                    ...preset,
                                    cycles,
                                    duration: estimatedMinutes
                                  };
                                  console.log("Breathing config (preset):", config);
                                  // invia config alla pagina di animazione (serializzato)
                                  router.push({
                                    pathname: "/(tabs)/home/mindfulness/breathing/breathingAnimation",
                                    params: { config: JSON.stringify(config) }
                                  });
                                }}
                              >
                                <AppText w="semi" className="text-white text-lg">
                                  Inizia
                                </AppText>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Custom Section */}
          <View>
            <TouchableOpacity
              onPress={() => toggleSection("custom")}
              className="bg-card border border-border shadow-sm rounded-lg p-4 flex-row justify-between items-center"
            >
              <AppText w="semi" className="text-lg">
                Pattern custom
              </AppText>
              {expandedSections.has("custom") ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#10b981" />}
            </TouchableOpacity>

            {expandedSections.has("custom") && (
              <View className="mt-3 px-2 gap-3 ">
                <View className="flex-row justify-between my-3">
                  <View className="flex-1 mr-2">
                    <AppText w="semi" className="text-md text-center mb-1">
                      Inspira
                    </AppText>
                    <TextInput
                      value={customInspire}
                      onChangeText={setCustomInspire}
                      keyboardType="numeric"
                      placeholder="4"
                      className="border border-border rounded-md p-2 bg-white text-center"
                      style={{ height: 44 }}
                    />
                  </View>
                  <View className="flex-1 mr-2">
                    <AppText w="semi" className="text-md text-center mb-1">
                      Trattieni
                    </AppText>
                    <TextInput
                      value={customHold1}
                      onChangeText={setCustomHold1}
                      keyboardType="numeric"
                      placeholder="4"
                      className="border border-border rounded-md p-2 bg-white text-center"
                      style={{ height: 44 }}
                    />
                  </View>
                  <View className="flex-1 mr-2">
                    <AppText w="semi" className="text-md text-center mb-1">
                      Espira
                    </AppText>
                    <TextInput
                      value={customExpire}
                      onChangeText={setCustomExpire}
                      keyboardType="numeric"
                      placeholder="4"
                      className="border border-border rounded-md p-2 bg-white text-center"
                      style={{ height: 44 }}
                    />
                  </View>
                  <View className="flex-1">
                    <AppText w="semi" className="text-md text-center mb-1">
                      Trattieni
                    </AppText>
                    <TextInput
                      value={customHold2}
                      onChangeText={setCustomHold2}
                      keyboardType="numeric"
                      placeholder="4"
                      className="border border-border rounded-md p-2 bg-white text-center"
                      style={{ height: 44 }}
                    />
                  </View>
                </View>

                <View className="flex-row items-center my-2 gap-2">
                  <AppText className="text-md mr-2">Numero cicli</AppText>

                  <View className="flex-row items-center shadow-sm flex-1 mr-3">
                    <TouchableOpacity onPress={decrementCustomCycles} className="px-6 py-1 bg-gray-200 dark:bg-muted-foreground rounded-l-md">
                      <AppText className="text-3xl mt-1">-</AppText>
                    </TouchableOpacity>

                    <TextInput
                      value={customCycles}
                      onChangeText={(t) => setCustomCycles(t.replace(/[^0-9]/g, ""))}
                      placeholder="es. 2"
                      keyboardType="numeric"
                      className="flex-1 px-2 text-center bg-white"
                      style={{ height: 42 }}
                    />

                    <TouchableOpacity onPress={incrementCustomCycles} className="px-6 py-1 bg-gray-200 dark:bg-muted-foreground rounded-r-md">
                      <AppText className="text-3xl mt-1">+</AppText>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    className="bg-primary px-4 py-3 rounded-md"
                    onPress={() => {
                      const parsedCycles = Number(customCycles);
                      const cycles = Number.isFinite(parsedCycles) && parsedCycles > 0 ? Math.round(parsedCycles) : undefined;
                      const baseCfg = buildConfigFromCustom(customInspire, customHold1, customExpire, customHold2, undefined, "Custom");
                      const cycleSeconds = (Number(customInspire) || 0) + (Number(customHold1) || 0) + (Number(customExpire) || 0) + (Number(customHold2) || 0);
                      const estimatedMinutes = cycles ? Math.round((cycles * cycleSeconds) / 60) : baseCfg.duration;
                      const config = { ...baseCfg, cycles, duration: estimatedMinutes };
                      console.log("Breathing config (custom):", config);
                      // invia config alla pagina di animazione (serializzato)
                      router.push({
                        pathname: "/(tabs)/home/mindfulness/breathing/breathingAnimation",
                        params: { config: JSON.stringify(config) }
                      });
                    }}
                  >
                    <AppText w="semi" className="text-white text-lg">
                      Inizia
                    </AppText>
                  </TouchableOpacity>
                </View>

                {/* mostra stima aggiornata */}
                {(() => {
                  const d = computeEstimatedDuration(
                    {
                      inhale: Number(customInspire) || 0,
                      holdIn: Number(customHold1) || 0,
                      exhale: Number(customExpire) || 0,
                      holdOut: Number(customHold2) || 0,
                      duration: undefined,
                      cycles: undefined
                    },
                    Number(customCycles) || undefined
                  );
                  const display = d.minutes !== undefined ? `${d.minutes} min${d.seconds ? ` ${d.seconds} sec` : ""}` : "--";
                  return <AppText className="text-md text-center ">{`Durata: ${display}`}</AppText>;
                })()}
              </View>
            )}
          </View>
        </View>
      </Card>

      {/* Info modal */}
      <Modal visible={infoModalVisible} transparent animationType="fade" onRequestClose={() => setInfoModalVisible(false)}>
        <Pressable className="flex-1 justify-center items-center bg-black/40" onPress={() => setInfoModalVisible(false)}>
          <Pressable className="w-[90%] bg-white dark:bg-muted p-4 rounded-lg" onPress={(e) => e.stopPropagation()}>
            <AppText w="semi" className="text-lg mb-2">
              Descrizione
            </AppText>
            <AppText className="text-md mb-4">{infoText}</AppText>
            <View className="flex-row justify-end">
              <TouchableOpacity onPress={() => setInfoModalVisible(false)} className="px-4 py-2 bg-primary rounded-md">
                <AppText w="semi" className="text-white text-lg">
                  Chiudi
                </AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
