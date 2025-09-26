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
  const textClasses = cn(
    "text-foreground", // classe base per dark/light mode
    fontWeights[w],
    className
  );

  return (
    <Text className={textClasses} style={style} {...props}>
      {children}
    </Text>
  );
});

AppText.displayName = "AppText";

export default AppText;
