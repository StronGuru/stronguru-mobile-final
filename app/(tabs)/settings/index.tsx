import ThemeToggle from "@/components/ThemeToggle";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../../src/store/authStore";

export default function Settings() {
	const logoutUser = useAuthStore((state) => state.logoutUser);
	const { setHasCompletedOnboarding } = useOnboardingStore();

	const resetOnboarding = () => {
		setHasCompletedOnboarding(false);
		// L'app mostrerà di nuovo l'onboarding
	};
	const handleLogout = async () => {
		try {
			await logoutUser();
			console.log("Logout completato"); // DEBUG
		} catch (error) {
			console.error("Errore durante il logout:", error);
		}
	};

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="px-6 py-8">
				{/* Appearance Section */}
				<View className="mb-8">
					<Text className="text-lg font-semibold text-foreground mb-4">Aspetto</Text>
					<View className="bg-card rounded-xl p-4 border border-border">
						<View className="flex-row items-center justify-between">
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
									<Feather name="sun" size={20} color="var(--color-primary)" />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Tema</Text>
									<Text className="text-sm text-muted-foreground">Scegli il tuo tema preferito</Text>
								</View>
							</View>
							<ThemeToggle />
						</View>
					</View>
				</View>

				{/* Contacts Section */}
				<View className="mb-8">
					<Text className="text-lg font-semibold text-foreground mb-4">Contatti</Text>
					<View className="bg-card rounded-xl p-4 border border-border">
						<TouchableOpacity 
							className="flex-row items-center justify-between py-3"
							onPress={() => {
								// TODO: Implement contact support functionality
								console.log("Contact support pressed");
							}}
						>
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mr-3">
									<Feather name="mail" size={20} color="var(--color-accent)" />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Contatta Supporto</Text>
									<Text className="text-sm text-muted-foreground">Ottieni aiuto e supporto</Text>
								</View>
							</View>
							<Feather name="chevron-right" size={20} color="var(--color-muted-foreground)" />
						</TouchableOpacity>						
						
					</View>
				</View>

				{/* App Management Section */}
				<View className="mb-8">
					<Text className="text-lg font-semibold text-foreground mb-4">Gestione App</Text>
					<View className="bg-card rounded-xl p-4 border border-border">
						<TouchableOpacity 
							className="flex-row items-center justify-between py-3"
							onPress={resetOnboarding}
						>
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mr-3">
									<Feather name="refresh-cw" size={20} color="var(--color-secondary-foreground)" />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Ripristina Onboarding</Text>
									<Text className="text-sm text-muted-foreground">Mostra di nuovo le schermate di benvenuto</Text>
								</View>
							</View>
							<Feather name="chevron-right" size={20} color="var(--color-muted-foreground)" />
						</TouchableOpacity>
					</View>
				</View>

				{/* Account Section */}
				<View className="mb-8">
					<Text className="text-lg font-semibold text-foreground mb-4">Account</Text>
					<View className="bg-card rounded-xl p-4 border border-border">
						<TouchableOpacity 
							className="flex-row items-center justify-between py-3"
							onPress={handleLogout}
						>
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 rounded-full bg-destructive/10 items-center justify-center mr-3">
									<Feather name="log-out" size={20} color="var(--color-destructive)" />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Logout</Text>
									<Text className="text-sm text-muted-foreground">Esci dal tuo account</Text>
								</View>
							</View>
							<Feather name="chevron-right" size={20} color="var(--color-muted-foreground)" />
						</TouchableOpacity>
					</View>
				</View>

				{/* App Info */}
				<View className="items-center py-4">
					<Text className="text-sm text-muted-foreground">Stronguru Mobile</Text>
					<Text className="text-xs text-muted-foreground mt-1">Versione 1.0.0</Text>
				</View>
			</View>
		</ScrollView>
	);
}
