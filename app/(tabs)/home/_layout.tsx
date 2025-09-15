import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

export default function HomeLayout() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: isDark ? "#1e293b" : "#10b981",
				},
				headerTintColor: "#ffffff",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 20,
				},
			}}
		>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen 
				name="targets" 
				options={{ 
					headerShown: true,
					title: "I Miei Obiettivi",
					headerBackTitle: "Home"
				}} 
			/>
		</Stack>
	);
}
