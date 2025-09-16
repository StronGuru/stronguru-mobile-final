
import ThemeToggle from "@/components/ThemeToggle";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { useAuthStore } from "../../../src/store/authStore";
import { useUserDataStore } from "../../../src/store/userDataStore";

export default function Settings() {
	const logoutUser = useAuthStore((state) => state.logoutUser);
	const { setHasCompletedOnboarding } = useOnboardingStore();
	const user = useUserDataStore((state) => state.user);
	const colorScheme = useColorScheme();

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

	const openSocialLink = async (url: string, platform: string) => {
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) {
				await Linking.openURL(url);
			} else {
				Alert.alert("Errore", `Impossibile aprire ${platform}. Assicurati che l'app sia installata.`);
			}
		} catch (error) {
			console.error(`Errore nell'apertura di ${platform}:`, error);
			Alert.alert("Errore", `Impossibile aprire ${platform}.`);
		}
	};

	const openEmailClient = async () => {
		try {
			const emailUrl = 'mailto:hello@stronguru.com?subject=Supporto Stronguru&body=Salve,%0D%0A%0D%0A';
			const supported = await Linking.canOpenURL(emailUrl);
			if (supported) {
				await Linking.openURL(emailUrl);
			} else {
				Alert.alert("Errore", "Impossibile aprire il client di posta. Assicurati che sia configurato un client email.");
			}
		} catch (error) {
			console.error("Errore nell'apertura del client email:", error);
			Alert.alert("Errore", "Impossibile aprire il client di posta.");
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
									<Feather name="sun" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-primary)'} />
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

				{/* Community Section */}
				<View className="mb-8">
					<Text className="text-lg font-semibold text-foreground mb-4">Community</Text>
					<View className="bg-card rounded-xl p-4 border border-border">
						<TouchableOpacity 
							className="flex-row items-center justify-between py-3 border-b border-border"
							onPress={() => openSocialLink("https://instagram.com/stronguru_app", "Instagram")}
						>
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 items-center justify-center mr-3">
									<Feather name="instagram" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Instagram</Text>
									<Text className="text-sm text-muted-foreground">Seguici su Instagram</Text>
								</View>
							</View>
							<Feather name="external-link" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-muted-foreground)'} />
						</TouchableOpacity>

						<TouchableOpacity 
							className="flex-row items-center justify-between py-3"
							onPress={() => openSocialLink("https://linkedin.com/company/stronguru", "LinkedIn")}
						>
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 items-center justify-center mr-3">
									<Feather name="linkedin" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">LinkedIn</Text>
									<Text className="text-sm text-muted-foreground">Connettiti con noi su LinkedIn</Text>
								</View>
							</View>
							<Feather name="external-link" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-muted-foreground)'} />
						</TouchableOpacity>
					</View>
				</View>

				{/* Contacts Section */}
				<View className="mb-8">
					<Text className="text-lg font-semibold text-foreground mb-4">Contatti</Text>
					<View className="bg-card rounded-xl p-4 border border-border">
						<TouchableOpacity 
							className="flex-row items-center justify-between py-3"
							onPress={openEmailClient}
						>
							<View className="flex-row items-center flex-1">
								<View className="w-10 h-10 rounded-full bg-accent/10 items-center justify-center mr-3">
									<Feather name="mail" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-accent)'} />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Contatta Supporto</Text>
									<Text className="text-sm text-muted-foreground">Ottieni aiuto e supporto</Text>
								</View>
							</View>
							<Feather name="chevron-right" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-muted-foreground)'} />
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
									<Feather name="refresh-cw" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-secondary-foreground)'} />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Ripristina Onboarding</Text>
									<Text className="text-sm text-muted-foreground">Mostra di nuovo le schermate di benvenuto</Text>
								</View>
							</View>
							<Feather name="chevron-right" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-muted-foreground)'} />
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
									<Feather name="log-out" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-destructive)'} />
								</View>
								<View className="flex-1">
									<Text className="text-base font-medium text-card-foreground">Logout</Text>
									<Text className="text-sm text-muted-foreground">
										{user?.email || "Esci dal tuo account"}
									</Text>
								</View>
							</View>
							<Feather name="chevron-right" size={20} color={colorScheme === 'dark' ? 'white' : 'var(--color-muted-foreground)'} />
						</TouchableOpacity>
					</View>
				</View>

				{/* App Info */}
				<View className="items-center py-4">
					<Text className="text-sm text-muted-foreground">Stronguru Mobile</Text>
					<Text className="text-xs text-muted-foreground mt-1">
						Versione {Constants.expoConfig?.version || "1.0.0"}
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
