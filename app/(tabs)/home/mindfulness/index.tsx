import AppText from "@/components/ui/AppText";
import Card from "@/components/ui/Card";
import { breathingPresets, buildConfigFromCustom } from "@/utils/breathingUtils";
import { Check, ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import { ImageBackground, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

export default function MindfulnessHomeScreen() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);

  // pattern duration string + flag per rilevare modifica utente
  const [patternDuration, setPatternDuration] = useState<string>("1"); // minuti interi

  const [customInspire, setCustomInspire] = useState<string>("4");
  const [customHold1, setCustomHold1] = useState<string>("4");
  const [customExpire, setCustomExpire] = useState<string>("4");
  const [customHold2, setCustomHold2] = useState<string>("4");
  const [customDuration, setCustomDuration] = useState<string>("2"); // minuti interi

  const patterns = breathingPresets;

  const toggleSection = (key: string) => {
    const next = new Set(expandedSections);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedSections(next);
  };

  // new helpers: increment / decrement minutes (min 1)
  const incrementPatternDuration = () => {
    setPatternDuration((prev) => {
      const n = Number(prev) || 0;
      const next = String(Math.max(1, Math.round(n + 1)));

      return next;
    });
  };
  const decrementPatternDuration = () => {
    setPatternDuration((prev) => {
      const n = Number(prev) || 0;
      const next = String(Math.max(1, Math.round(n - 1)));

      return next;
    });
  };

  const incrementCustomDuration = () => {
    setCustomDuration((prev) => {
      const n = Number(prev) || 0;
      return String(Math.max(1, Math.round(n + 1)));
    });
  };
  const decrementCustomDuration = () => {
    setCustomDuration((prev) => {
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
              <View className="mt-3 mb-8">
                <View>
                  {patterns.map((p, idx) => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => {
                        // se cambio selezione verso un pattern diverso, ripristina la durata di default del preset
                        const preset = patterns[idx];
                        if (idx !== selectedPattern) {
                          setSelectedPattern(idx);
                          setPatternDuration(String(preset.duration ?? 1));
                        } else {
                          // se riclicco lo stesso pattern, lo lascio com'è (non sovrascrivere un edit in corso)
                          setSelectedPattern(idx);
                        }
                      }}
                      className={`flex-row items-center justify-between p-3 rounded-md mb-2 border ${
                        selectedPattern === idx ? "border-primary bg-primary/10" : "border-border bg-card"
                      }`}
                    >
                      <View className="w-80">
                        <AppText w="semi" className="text-md">
                          {p.label}
                        </AppText>
                        <AppText w="semi" className="text-md text-primary">{`${p.inhale} - ${p.holdIn} - ${p.exhale} - ${p.holdOut}`}</AppText>
                        <AppText className="text-md">Durata: {p.duration} min</AppText>
                        <AppText className="text-md">{p.description}</AppText>
                      </View>
                      <AppText className="text-sm text-muted-foreground">{selectedPattern === idx ? <Check size={20} color="#10b981" /> : ""}</AppText>
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="mt-3 flex-row items-center">
                  <AppText className="text-sm mr-2">Durata (min)</AppText>

                  <View className="flex-row items-center shadow-sm flex-1 mr-3">
                    <TouchableOpacity onPress={decrementPatternDuration} className="px-6 py-1 bg-gray-200 dark:bg-muted-foreground rounded-l-md">
                      <AppText className="text-3xl mt-1">-</AppText>
                    </TouchableOpacity>

                    <TextInput
                      value={patternDuration}
                      onChangeText={(t) => {
                        setPatternDuration(t.replace(/[^0-9]/g, ""));
                      }}
                      placeholder="es. 1"
                      keyboardType="numeric"
                      className="flex-1  px-2 text-center bg-white"
                      style={{ height: 42 }}
                    />

                    <TouchableOpacity onPress={incrementPatternDuration} className="px-6 py-1 bg-gray-200  dark:bg-muted-foreground rounded-r-md">
                      <AppText className="text-3xl mt-1">+</AppText>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    className="bg-primary px-4 py-3 rounded-md"
                    onPress={() => {
                      if (selectedPattern === null) return;
                      // preset è già un BreathingConfig; sovrascrivo solo duration se l'utente l'ha inserita
                      const preset = patterns[selectedPattern];
                      const parsedMinutes = Number(patternDuration);
                      const config = {
                        ...preset,
                        duration: Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? Math.round(parsedMinutes) : preset.duration
                      };
                      console.log("Breathing config (preset):", config);
                      // in seguito: passare `config` al router / schermata animazione
                    }}
                  >
                    <AppText w="semi" className="text-white">
                      Inizia
                    </AppText>
                  </TouchableOpacity>
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
              <View className="mt-3 ">
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

                <View className="flex-row items-center my-2">
                  <AppText className="text-sm mr-2">Durata (min)</AppText>

                  <View className="flex-row items-center shadow-sm flex-1 mr-3">
                    <TouchableOpacity onPress={decrementCustomDuration} className="px-6 py-1 bg-gray-200 dark:bg-muted-foreground rounded-l-md">
                      <AppText className="text-3xl mt-1">-</AppText>
                    </TouchableOpacity>

                    <TextInput
                      value={customDuration}
                      onChangeText={(t) => setCustomDuration(t.replace(/[^0-9]/g, ""))}
                      placeholder="Minuti (es. 2)"
                      keyboardType="numeric"
                      className="flex-1 px-2 text-center bg-white"
                      style={{ height: 42 }}
                    />

                    <TouchableOpacity onPress={incrementCustomDuration} className="px-6 py-1 bg-gray-200 dark:bg-muted-foreground rounded-r-md">
                      <AppText className="text-3xl mt-1">+</AppText>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    className="bg-primary px-4 py-3 rounded-md"
                    onPress={() => {
                      const config = buildConfigFromCustom(customInspire, customHold1, customExpire, customHold2, customDuration, "Custom");
                      console.log("Breathing config (custom):", config);
                      // in seguito: passare `config` al router / schermata animazione
                    }}
                  >
                    <AppText w="semi" className="text-white">
                      Inizia
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Card>

      {/* <TouchableOpacity
        onPress={() => {
          router.push("/(tabs)/home/mindfulness/breathing/breathingAnimation");
        }}
      >
        <AppText>Vai alla respirazione</AppText>
      </TouchableOpacity> */}
    </ScrollView>
  );
}
