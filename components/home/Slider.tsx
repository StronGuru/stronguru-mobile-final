import { useRef, useState } from "react";
import { View, ViewToken } from "react-native";

import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import HomeSliderCard from "./HomeSliderCard";
import SliderPagination from "./SliderPagination";

const sliderData = [
  {
    title: "Cerca Pro",
    description: "Trova il professionista giusto per te, filtrali per specializzazione, distanza, E crea il tuo tema di esperti.",
    route: "/home/professionals"
  },
  { title: "Eventi", description: "Esplora tutti gli eventi sportivi in Italia, nella tua citta e degli sport che più ti interessano", route: "/home/events" },
  { title: "Ricette", description: "Scopri nuove ricette e idee per i tuoi pasti, filtrale per ingredienti e difficoltà.", route: "/home/recipes" },
  { title: "Allenamenti", description: "Trova allenamenti personalizzati per il tuo livello e obiettivi, e segui i progressi.", route: "/home/workouts" }
  // Aggiungi altri oggetti se necessario
];

export default function Slider() {
  const scrollX = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    }
  });
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0].index !== undefined && viewableItems[0].index !== null) {
      setPaginationIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);
  return (
    <View>
      <Animated.FlatList
        data={sliderData}
        renderItem={({ item, index }) => <HomeSliderCard item={item} index={index} scrollX={scrollX} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <SliderPagination items={sliderData} paginationIndex={paginationIndex} scrollX={scrollX} />
    </View>
  );
}
