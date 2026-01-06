"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Moon,
  Cigarette,
  Utensils,
  Activity,
  Brain,
  Droplets,
  ChevronRight,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Navigation";
import { PerformanceAwareMotion } from "@/components/performance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Types
interface Habit {
  id: string;
  name: string;
  icon: React.ElementType;
  currentLevel: number; // 0-100
  optimalLevel: number;
  unit: string;
  options: { label: string; value: number }[];
  impactWeights: {
    heart: number;
    diabetes: number;
    stroke: number;
    thyroid: number;
  };
}

interface RiskScore {
  disease: string;
  baseline: number;
  simulated: number;
  icon: React.ElementType;
  color: string;
}

// Habit definitions with impact weights
const habits: Habit[] = [
  {
    id: "sleep",
    name: "Sleep Duration",
    icon: Moon,
    currentLevel: 40,
    optimalLevel: 80,
    unit: "hours",
    options: [
      { label: "< 5 hrs", value: 20 },
      { label: "5-6 hrs", value: 40 },
      { label: "6-7 hrs", value: 60 },
      { label: "7-8 hrs", value: 80 },
      { label: "8+ hrs", value: 100 },
    ],
    impactWeights: { heart: 0.15, diabetes: 0.12, stroke: 0.18, thyroid: 0.25 },
  },
  {
    id: "sugar",
    name: "Sugar Intake",
    icon: Utensils,
    currentLevel: 80,
    optimalLevel: 20,
    unit: "level",
    options: [
      { label: "Very High", value: 100 },
      { label: "High", value: 80 },
      { label: "Moderate", value: 50 },
      { label: "Low", value: 20 },
      { label: "Very Low", value: 0 },
    ],
    impactWeights: { heart: 0.12, diabetes: 0.35, stroke: 0.08, thyroid: 0.05 },
  },
  {
    id: "exercise",
    name: "Physical Activity",
    icon: Activity,
    currentLevel: 30,
    optimalLevel: 80,
    unit: "mins/day",
    options: [
      { label: "Sedentary", value: 10 },
      { label: "Light (15 min)", value: 30 },
      { label: "Moderate (30 min)", value: 50 },
      { label: "Active (45 min)", value: 70 },
      { label: "Very Active (60+ min)", value: 90 },
    ],
    impactWeights: { heart: 0.25, diabetes: 0.20, stroke: 0.15, thyroid: 0.10 },
  },
  {
    id: "smoking",
    name: "Smoking Status",
    icon: Cigarette,
    currentLevel: 60,
    optimalLevel: 0,
    unit: "status",
    options: [
      { label: "Heavy Smoker", value: 100 },
      { label: "Regular Smoker", value: 75 },
      { label: "Occasional", value: 50 },
      { label: "Former Smoker", value: 25 },
      { label: "Never Smoked", value: 0 },
    ],
    impactWeights: { heart: 0.30, diabetes: 0.08, stroke: 0.25, thyroid: 0.15 },
  },
  {
    id: "stress",
    name: "Stress Level",
    icon: Brain,
    currentLevel: 70,
    optimalLevel: 20,
    unit: "level",
    options: [
      { label: "Very High", value: 100 },
      { label: "High", value: 75 },
      { label: "Moderate", value: 50 },
      { label: "Low", value: 25 },
      { label: "Very Low", value: 0 },
    ],
    impactWeights: { heart: 0.18, diabetes: 0.10, stroke: 0.20, thyroid: 0.30 },
  },
  {
    id: "hydration",
    name: "Water Intake",
    icon: Droplets,
    currentLevel: 40,
    optimalLevel: 90,
    unit: "glasses/day",
    options: [
      { label: "< 4 glasses", value: 20 },
      { label: "4-6 glasses", value: 40 },
      { label: "6-8 glasses", value: 60 },
      { label: "8-10 glasses", value: 80 },
      { label: "10+ glasses", value: 100 },
    ],
    impactWeights: { heart: 0.05, diabetes: 0.08, stroke: 0.05, thyroid: 0.10 },
  },
];

// Calculate risk score based on habits
function calculateRisk(habitValues: Record<string, number>, disease: keyof Habit["impactWeights"]): number {
  let riskScore = 0;
  let totalWeight = 0;

  habits.forEach((habit) => {
    const value = habitValues[habit.id] ?? habit.currentLevel;
    const weight = habit.impactWeights[disease];
    
    // For habits where lower is better (sugar, smoking, stress)
    const isInverse = ["sugar", "smoking", "stress"].includes(habit.id);
    const normalizedValue = isInverse ? value : 100 - value;
    
    riskScore += normalizedValue * weight;
    totalWeight += weight;
  });

  return Math.round((riskScore / totalWeight) * 0.6 + 15); // Scale to realistic range 15-75%
}

// Habit Priority Card
function HabitPriorityCard({ 
  habit, 
  impact, 
  rank 
}: { 
  habit: Habit; 
  impact: number; 
  rank: number;
}) {
  const Icon = habit.icon;
  const isPositive = impact < 0;
  
  return (
    <PerformanceAwareMotion
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-sm">
        {rank}
      </div>
      <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium text-sm">{habit.name}</p>
        <p className="text-slate-500 text-xs">Optimize this habit</p>
      </div>
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
        isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
      }`}>
        {isPositive ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
        <span className="text-xs font-bold">{Math.abs(impact)}%</span>
      </div>
    </PerformanceAwareMotion>
  );
}

export default function LifestyleSimulatorPage() {
  // State for habit values
  const [habitValues, setHabitValues] = useState<Record<string, number>>(
    Object.fromEntries(habits.map((h) => [h.id, h.currentLevel]))
  );
  const [simulatedValues, setSimulatedValues] = useState<Record<string, number>>(
    Object.fromEntries(habits.map((h) => [h.id, h.currentLevel]))
  );
  const [activeHabit, setActiveHabit] = useState<string | null>(null);

  // Calculate risks
  const riskScores: RiskScore[] = useMemo(() => [
    {
      disease: "Heart Disease",
      baseline: calculateRisk(habitValues, "heart"),
      simulated: calculateRisk(simulatedValues, "heart"),
      icon: Heart,
      color: "#ef4444",
    },
    {
      disease: "Diabetes",
      baseline: calculateRisk(habitValues, "diabetes"),
      simulated: calculateRisk(simulatedValues, "diabetes"),
      icon: Droplets,
      color: "#f59e0b",
    },
    {
      disease: "Stroke",
      baseline: calculateRisk(habitValues, "stroke"),
      simulated: calculateRisk(simulatedValues, "stroke"),
      icon: Brain,
      color: "#8b5cf6",
    },
    {
      disease: "Thyroid",
      baseline: calculateRisk(habitValues, "thyroid"),
      simulated: calculateRisk(simulatedValues, "thyroid"),
      icon: Activity,
      color: "#06b6d4",
    },
  ], [habitValues, simulatedValues]);

  // Calculate habit priorities (impact of optimizing each habit)
  const habitPriorities = useMemo(() => {
    return habits.map((habit) => {
      // Simulate optimizing this habit
      const optimizedValues = { ...habitValues, [habit.id]: habit.optimalLevel };
      
      // Calculate total risk reduction across all diseases
      const currentTotal = riskScores.reduce((sum, r) => sum + r.baseline, 0);
      const optimizedTotal = ["heart", "diabetes", "stroke", "thyroid"].reduce(
        (sum, disease) => sum + calculateRisk(optimizedValues, disease as keyof Habit["impactWeights"]),
        0
      );
      
      return {
        habit,
        impact: Math.round((optimizedTotal - currentTotal) / 4), // Average impact
      };
    }).sort((a, b) => a.impact - b.impact); // Sort by biggest reduction
  }, [habitValues, riskScores]);

  // Chart data
  const chartData = riskScores.map((r) => ({
    name: r.disease.split(" ")[0],
    baseline: r.baseline,
    simulated: r.simulated,
    color: r.color,
  }));

  const totalBaselineRisk = Math.round(riskScores.reduce((sum, r) => sum + r.baseline, 0) / 4);
  const totalSimulatedRisk = Math.round(riskScores.reduce((sum, r) => sum + r.simulated, 0) / 4);
  const riskChange = totalSimulatedRisk - totalBaselineRisk;

  return (
    <div className="min-h-screen bg-[#030712]">
      <Header title="LIFESTYLE SIMULATOR" subtitle="What-If Health Analysis" />

      <main className="p-6 lg:p-10">
        <div className="max-w-[1800px] mx-auto">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <PerformanceAwareMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Current Risk</p>
                  <p className="text-3xl font-bold text-white">{totalBaselineRisk}%</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs">Based on your current lifestyle habits</p>
            </PerformanceAwareMotion>

            <PerformanceAwareMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Simulated Risk</p>
                  <p className="text-3xl font-bold text-white">{totalSimulatedRisk}%</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs">After applying lifestyle changes</p>
            </PerformanceAwareMotion>

            <PerformanceAwareMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-gradient-to-br ${
                riskChange <= 0 ? "from-green-900/20 to-green-950/20 border-green-500/20" : "from-red-900/20 to-red-950/20 border-red-500/20"
              } border rounded-2xl p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  riskChange <= 0 ? "bg-green-500/10" : "bg-red-500/10"
                }`}>
                  {riskChange <= 0 ? (
                    <TrendingDown className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Risk Change</p>
                  <p className={`text-3xl font-bold ${riskChange <= 0 ? "text-green-400" : "text-red-400"}`}>
                    {riskChange > 0 ? "+" : ""}{riskChange}%
                  </p>
                </div>
              </div>
              <p className="text-slate-500 text-xs">
                {riskChange <= 0 ? "Great! Your changes reduce health risks" : "These changes may increase risks"}
              </p>
            </PerformanceAwareMotion>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Habit Controls */}
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Adjust Lifestyle Habits
                </h3>
                
                <div className="space-y-6">
                  {habits.map((habit) => {
                    const Icon = habit.icon;
                    const currentOption = habit.options.find((o) => o.value === simulatedValues[habit.id]);
                    
                    return (
                      <div key={habit.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span className="text-white text-sm font-medium">{habit.name}</span>
                          </div>
                          <span className="text-cyan-400 text-xs font-bold">
                            {currentOption?.label || "Select"}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-1">
                          {habit.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSimulatedValues((prev) => ({
                                  ...prev,
                                  [habit.id]: option.value,
                                }));
                                setActiveHabit(habit.id);
                              }}
                              className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                                simulatedValues[habit.id] === option.value
                                  ? "bg-cyan-500 text-white"
                                  : habitValues[habit.id] === option.value
                                  ? "bg-slate-700 text-slate-300 border border-cyan-500/30"
                                  : "bg-slate-800/50 text-slate-500 hover:bg-slate-700/50 hover:text-slate-300"
                              }`}
                            >
                              {option.label.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setSimulatedValues(habitValues)}
                  className="mt-6 w-full py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all"
                >
                  Reset to Current
                </button>
              </div>
            </div>

            {/* Risk Comparison Chart */}
            <div className="xl:col-span-1">
              <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6 h-full">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  Risk Comparison
                </h3>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 80]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="baseline" name="Current" radius={[4, 4, 0, 0]} fill="#475569" />
                      <Bar dataKey="simulated" name="Simulated" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.simulated < entry.baseline ? "#22c55e" : entry.simulated > entry.baseline ? "#ef4444" : "#22d3ee"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Risk Cards */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {riskScores.map((risk) => {
                    const Icon = risk.icon;
                    const change = risk.simulated - risk.baseline;
                    return (
                      <div
                        key={risk.disease}
                        className="bg-slate-900/50 rounded-xl p-3 border border-white/5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" style={{ color: risk.color }} />
                          <span className="text-slate-400 text-xs">{risk.disease}</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-slate-500 text-xs line-through mr-2">{risk.baseline}%</span>
                            <span className="text-white font-bold">{risk.simulated}%</span>
                          </div>
                          <span className={`text-xs font-bold ${change <= 0 ? "text-green-400" : "text-red-400"}`}>
                            {change > 0 ? "+" : ""}{change}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Habit Priority Engine */}
            <div className="xl:col-span-1">
              <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6 h-full">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Habit Priority Engine
                </h3>
                <p className="text-slate-500 text-xs mb-6">
                  Fix these habits first for maximum health benefit
                </p>

                <div className="space-y-3">
                  {habitPriorities.slice(0, 5).map((item, index) => (
                    <HabitPriorityCard
                      key={item.habit.id}
                      habit={item.habit}
                      impact={item.impact}
                      rank={index + 1}
                    />
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl border border-cyan-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Top Recommendation</p>
                      <p className="text-slate-400 text-xs">
                        {habitPriorities[0] && (
                          <>
                            Optimizing <span className="text-cyan-400 font-medium">{habitPriorities[0].habit.name}</span> could 
                            reduce your overall risk by <span className="text-green-400 font-medium">{Math.abs(habitPriorities[0].impact)}%</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
