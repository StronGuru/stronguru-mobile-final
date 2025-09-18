import { useRouter } from "expo-router";
import {
	Activity,
	ArrowRight,
	Flame,
	Heart
} from "lucide-react-native";
import React from "react";
import {
	ScrollView,
	Text,
	TouchableOpacity,
	useColorScheme,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

// Circular Progress Component
const CircularProgress = ({ 
	size = 120, 
	strokeWidth = 8, 
	progress = 0.75, 
	color = "#10b981",
	backgroundColor = "#e5e7eb",
	children 
}: {
	size?: number;
	strokeWidth?: number;
	progress?: number;
	color?: string;
	backgroundColor?: string;
	children?: React.ReactNode;
}) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDasharray = circumference;
	const strokeDashoffset = circumference - (progress * circumference);

	return (
		<View className="relative items-center justify-center">
			<Svg width={size} height={size} className="absolute">
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={backgroundColor}
					strokeWidth={strokeWidth}
					fill="transparent"
				/>
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={color}
					strokeWidth={strokeWidth}
					fill="transparent"
					strokeDasharray={strokeDasharray}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
			</Svg>
			{children}
		</View>
	);
};

// Health Stats Component
const HealthStats = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const stats = [
		{
			title: "Passi",
			value: "8,247",
			unit: "passi",
			progress: 0.75,
			color: "#10b981",
			icon: Activity,
			subtitle: "Obiettivo: 10,000"
		},
		{
			title: "Calorie",
			value: "420",
			unit: "kcal",
			progress: 0.6,
			color: "#f59e0b",
			icon: Flame,
			subtitle: "Bruciate oggi"
		},
		{
			title: "Battiti",
			value: "72",
			unit: "bpm",
			progress: 0.9,
			color: "#ef4444",
			icon: Heart,
			subtitle: "Frequenza cardiaca"
		}
	];

	return (
		<View className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
			<View className="flex-row items-center justify-between mb-6">
				<Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
					I tuoi obiettivi
				</Text>
				<ArrowRight size={20} color={isDark ? "#94a3b8" : "#6b7280"} />
			</View>
			
			<View className="flex-row justify-between">
				{stats.map((stat, index) => (
					<View key={index} className="flex-1 items-center">
						<View className="items-center mb-3">
							<View className={`p-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-50'} mb-2`}>
								<stat.icon size={24} color={stat.color} />
							</View>
							<Text className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
								{stat.title}
							</Text>
						</View>
						
						<CircularProgress
							size={80}
							strokeWidth={5}
							progress={stat.progress}
							color={stat.color}
							backgroundColor={isDark ? "#334155" : "#e5e7eb"}
						>
							<View className="items-center">
								<Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
									{stat.value}
								</Text>
								<Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
									{stat.unit}
								</Text>
							</View>
						</CircularProgress>
						
						<Text className={`text-xs text-center mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
							{stat.subtitle}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};


const Index = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const router = useRouter();

	return (
		<SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
			<ScrollView 
				className="flex-1"
				showsVerticalScrollIndicator={false}
			>
				{/* Health Stats Card */}
				<TouchableOpacity 
					onPress={() => router.push('/home/targets')}
					className="px-6 pt-6"
				>
					<HealthStats />
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Index;
