import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text className="text-center text-blue-500 font-bold text-3xl">Test App </Text>
    </View>
  );
}
