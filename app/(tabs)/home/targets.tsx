import {
    Activity,
    Award,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Flame,
    Heart,
    Target,
    TrendingUp
} from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    Text,
    View,
    useColorScheme
} from "react-native";
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

// Goal Card Component
const GoalCard = ({ 
	goal 
}: {
	goal: any;
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const getIcon = (type: string) => {
		switch (type) {
			case 'steps': return Activity;
			case 'calories': return Flame;
			case 'heart_rate': return Heart;
			case 'workout_time': return Clock;
			default: return Target;
		}
	};

	const getColor = (type: string) => {
		switch (type) {
			case 'steps': return "#10b981";
			case 'calories': return "#f59e0b";
			case 'heart_rate': return "#ef4444";
			case 'workout_time': return "#3b82f6";
			default: return "#8b5cf6";
		}
	};

	const Icon = getIcon(goal.type);
	const color = getColor(goal.type);
	const progress = goal.current / goal.target;

	return (
		<View className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg mb-4 border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
			{/* Header con icona */}
			<View className="flex-row items-center mb-4">
				<View className={`p-3 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-gray-50'}`}>
					<Icon size={22} color={color} />
				</View>
				<View className="flex-1 ml-3">
					<Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`} numberOfLines={1}>
						{goal.title}
					</Text>
					<Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`} numberOfLines={2}>
						{goal.description}
					</Text>
				</View>
			</View>
			
			{/* Progress Circle e Stats */}
			<View className="flex-row items-center">
				{/* Progress Circle */}
				<View className="mr-4">
					<CircularProgress
						size={70}
						strokeWidth={5}
						progress={progress}
						color={color}
						backgroundColor={isDark ? "#334155" : "#e5e7eb"}
					>
						<View className="items-center">
							<Text className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
								{Math.round(progress * 100)}%
							</Text>
						</View>
					</CircularProgress>
				</View>
				
				{/* Stats */}
				<View className="flex-1">
					<View className="mb-3">
						<Text className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
							PROGRESSO
						</Text>
						<Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
							{goal.current.toLocaleString()} / {goal.target.toLocaleString()}
						</Text>
						<Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
							{goal.unit}
						</Text>
					</View>
					
					<View className="mb-3">
						<Text className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
							RIMANENTE
						</Text>
						<Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
							{(goal.target - goal.current).toLocaleString()} {goal.unit}
						</Text>
					</View>
					
					<View className="flex-row items-center">
						<Calendar size={12} color={isDark ? "#94a3b8" : "#6b7280"} />
						<Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} numberOfLines={1}>
							{goal.deadline}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};


// Stats Overview Component
const StatsOverview = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const stats = [
		{
			title: "Obiettivi Attivi",
			value: "5",
			icon: Target,
			color: "#10b981"
		},
		{
			title: "Completati",
			value: "12",
			icon: CheckCircle,
			color: "#3b82f6"
		},
		{
			title: "Media Progresso",
			value: "68%",
			icon: TrendingUp,
			color: "#f59e0b"
		},
		{
			title: "Punteggio",
			value: "850",
			icon: Award,
			color: "#8b5cf6"
		}
	];

	return (
		<View className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg mb-6 border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
			<View className="flex-row items-center justify-between mb-5">
				<Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
					Statistiche Generali
				</Text>
				<BarChart3 size={20} color={isDark ? "#94a3b8" : "#6b7280"} />
			</View>
			
			<View className="flex-row flex-wrap -mx-2">
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<View key={index} className="w-1/2 px-2 mb-4">
							<View className={`p-4 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-gray-50'} border ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
								<View className="flex-row items-center mb-2">
									<View className={`p-2 rounded-lg mr-3`} style={{ backgroundColor: stat.color + "20" }}>
										<Icon size={16} color={stat.color} />
									</View>
									<Text className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
										{stat.title.toUpperCase()}
									</Text>
								</View>
								<Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
									{stat.value}
								</Text>
							</View>
						</View>
					);
				})}
			</View>
		</View>
	);
};

const TargetsPage = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	
	const goals = [
		{
			id: "1",
			title: "10.000 Passi Giornalieri",
			description: "Camminare almeno 10.000 passi ogni giorno per mantenere uno stile di vita attivo",
			type: "steps",
			target: 10000,
			current: 8247,
			unit: "passi",
			deadline: "31/12/2024"
		},
		{
			id: "2",
			title: "Bruciare 500 Calorie",
			description: "Bruciare almeno 500 calorie al giorno attraverso l'attività fisica",
			type: "calories",
			target: 500,
			current: 420,
			unit: "kcal",
			deadline: "31/12/2024"
		},
		{
			id: "3",
			title: "Mantenere 70 BPM",
			description: "Mantenere una frequenza cardiaca a riposo di 70 bpm o inferiore",
			type: "heart_rate",
			target: 70,
			current: 72,
			unit: "bpm",
			deadline: "31/12/2024"
		}
	];



	return (
		<View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
			<ScrollView 
				className="flex-1"
				showsVerticalScrollIndicator={false}
			>
				{/* Subtitle */}
				<View className="px-6 pt-4 pb-4">
					<Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
						Gestisci i tuoi obiettivi di salute e fitness
					</Text>
				</View>

				{/* Stats Overview */}
				<View className="px-6">
					<StatsOverview />
				</View>

				{/* Goals List */}
				<View className="px-6 mb-6">
					<View className="mb-4">
						<Text className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
							Obiettivi Attivi
						</Text>
					</View>

					{goals.map((goal) => (
						<GoalCard
							key={goal.id}
							goal={goal}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

export default TargetsPage;
