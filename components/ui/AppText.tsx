import React from "react";
import { Text, TextProps } from "react-native";

// Utility per combinare classi (inline)
const cn = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Mapping dei font weights
const fontWeights = {
  regular: "font-kanit-regular",
  semi: "font-kanit-semibold",
  bold: "font-kanit-bold"
} as const;

// Type per il componente
interface AppTextProps extends TextProps {
  w?: keyof typeof fontWeights;
  className?: string;
  children: React.ReactNode;
}

const AppText = React.memo<AppTextProps>(({ w = "regular", className, children, style, ...props }) => {
  // Solo aggiungi text-foreground se non c'è già una classe text-* in className
  const hasTextColor = className?.match(
    /\btext-(primary|secondary|accent|destructive|foreground|muted|red-|blue-|green-|yellow-|purple-|pink-|gray-|slate-|zinc-|neutral-|stone-|orange-|amber-|lime-|emerald-|teal-|cyan-|sky-|indigo-|violet-|fuchsia-|rose-|white|black)\S*/
  );

  const textClasses = cn(
    fontWeights[w], // font per primo
    ...(hasTextColor ? [] : ["text-foreground"]), // classe base solo se non specificata
    className // classi custom per ultime
  );

  return (
    <Text className={textClasses} style={style} {...props}>
      {children}
    </Text>
  );
});

AppText.displayName = "AppText";

export default AppText;
