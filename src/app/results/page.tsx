"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Calendar,
  Target,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Header } from "@/components/Navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const trendData = [
  { month: "Jan", risk: 48 },
  { month: "Feb", risk: 45 },
  { month: "Mar", risk: 42 },
  { month: "Apr", risk: 38 },
  { month: "May", risk: 36 },
  { month: "Jun", risk: 33 },
];

// Health Risk Forecast Data (6-month projection)
const forecastData = [
  { month: "Jul", current: 33, improved: 33, unchanged: 33 },
  { month: "Aug", current: null, improved: 30, unchanged: 35 },
  { month: "Sep", current: null, improved: 27, unchanged: 38 },
  { month: "Oct", current: null, improved: 24, unchanged: 42 },
  { month: "Nov", current: null, improved: 22, unchanged: 47 },
  { month: "Dec", current: null, improved: 20, unchanged: 52 },
];

// Before vs After comparison data
const beforeAfterData = [
  { metric: "Heart Risk", before: 45, after: 33, unit: "%" },
  { metric: "Diabetes Risk", before: 38, after: 28, unit: "%" },
  { metric: "Sleep Quality", before: 5, after: 7, unit: "hrs" },
  { metric: "Activity Level", before: 2000, after: 5500, unit: "steps" },
  { metric: "Cholesterol", before: 230, after: 198, unit: "mg/dL" },
  { metric: "Blood Pressure", before: 138, after: 118, unit: "mmHg" },
];

const factorData = [
  { name: "Age", contribution: 25, color: "#22D3EE" },
  { name: "Cholesterol", contribution: 30, color: "#22D3EE" },
  { name: "Blood Pressure", contribution: 15, color: "#22D3EE" },
  { name: "Lifestyle", contribution: 20, color: "#22D3EE" },
  { name: "Family History", contribution: 10, color: "#22D3EE" },
];

function DataPanel({ 
  title, 
  children, 
  className = "",
  delay = 0 
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return (
      <div className={`bg-[#0f172a] border border-white/5 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-xs uppercase tracking-widest">{title}</h3>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`bg-[#0f172a] border border-white/5 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xs uppercase tracking-widest">{title}</h3>
        <ChevronRight className="w-4 h-4 text-slate-600" />
      </div>
      {children}
    </motion.div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam) : 33;
  const [reportId, setReportId] = useState("RPT-000000");
  const [username, setUsername] = useState("");

  useEffect(() => {
    setReportId(`RPT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const getRiskLevel = () => {
    if (score < 30) return { level: "Low", color: "text-green-400" };
    if (score < 60) return { level: "Moderate", color: "text-cyan-400" };
    return { level: "Elevated", color: "text-red-400" };
  };

  const riskInfo = getRiskLevel();

  return (
    <div className="min-h-screen">
      <div className="bg-[#0f172a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-widest">DIAGNOSTIC REPORT</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Risk Analysis Verification</p>
            </div>
            <div className="flex items-center gap-4">
              {username && (
                <span className="text-sm text-slate-400">
                  Welcome, <span className="text-cyan-400 font-medium">{username}</span>
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="p-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full lg:col-span-4 bg-[#0f172a] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -mr-16 -mt-16" />
              
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-10">Aggregate Risk Index</h3>
              
              <div className="relative w-48 h-48 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#1E293B" strokeWidth="6" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - score / 100) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ strokeDasharray: 2 * Math.PI * 44 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {score}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global Score</span>
                </div>
              </div>
              
              <p className={`text-xl font-bold uppercase tracking-tight ${riskInfo.color}`}>
                {riskInfo.level} Risk Profile
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3 max-w-[200px]">
                Analyzed across 6 distinct physiological vectors
              </p>
            </motion.div>
            
            <DataPanel title="Temporal Risk Trajectory" className="col-span-full lg:col-span-8" delay={0.05}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="riskGradientRes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#22D3EE"
                      strokeWidth={3}
                      fill="url(#riskGradientRes)"
                      dot={{ fill: "#22D3EE", r: 4, strokeWidth: 2, stroke: "#0f172a" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DataPanel>
            
            <DataPanel title="Vector Contribution" className="col-span-full lg:col-span-6" delay={0.1}>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                    <XAxis type="number" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={[0, 40]} />
                    <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={100} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    />
                    <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                      {factorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DataPanel>
            
            <DataPanel title="Vector Breakdown" className="col-span-full lg:col-span-6" delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Chronological age", status: "warning", icon: AlertCircle, text: "Elevated baseline risk factor" },
                  { label: "Systolic pressure", status: "good", icon: CheckCircle, text: "Optimal therapeutic range" },
                  { label: "Lipid profile", status: "warning", icon: AlertCircle, text: "Modified dietary input required" },
                  { label: "Nicotine history", status: "good", icon: CheckCircle, text: "Negative history detected" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${item.status === "good" ? "text-green-400" : "text-amber-400"}`} />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">{item.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DataPanel>
            
            <DataPanel title="Intelligence Synthesis" className="col-span-full lg:col-span-8" delay={0.2}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-4 p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                    <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-widest">Diagnostic Summary</p>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        The cardiovascular profile exhibits moderate concern, primarily influenced by lipid concentrations. 
                        However, the temporal trend shows a sustained 15% reduction in overall risk over the preceding 6-month epoch.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 md:w-[360px]">
                  {[
                    { icon: TrendingDown, value: "-15%", label: "Risk Delta", color: "text-green-400" },
                    { icon: TrendingUp, value: "6", label: "Protocol Runs", color: "text-cyan-400" },
                    { icon: CheckCircle, value: "4/6", label: "Vectors Pass", color: "text-green-400" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center">
                      <stat.icon className={`w-4 h-4 mx-auto mb-3 ${stat.color}`} />
                      <p className="text-lg font-bold text-white tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </DataPanel>
            
            <DataPanel title="Clinical Directives" className="col-span-full lg:col-span-4" delay={0.25}>
              <div className="space-y-4">
                {[
                  "Bi-monthly lipid concentration monitoring",
                  "150min sustained cardiovascular load/week",
                  "Secondary diagnostic follow-up: Q3 2024",
                  "Nutrition protocol: High-fiber focus",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-[11px] text-slate-300 font-medium">{text}</span>
                  </div>
                ))}
                <Link
                  href="/recommendations"
                  className="mt-6 flex items-center justify-center gap-2 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-500/20 transition-all"
                >
                  Retrieve Implementation Plan
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </DataPanel>

            {/* Health Risk Forecast */}
            <DataPanel title="6-Month Health Risk Forecast" className="col-span-full lg:col-span-8" delay={0.3}>
              <div className="mb-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-slate-400">If habits improved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-xs text-slate-400">If unchanged</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={[0, 60]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: 11,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="improved"
                      name="With Improvements"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: "#22c55e", r: 4 }}
                      strokeDasharray="0"
                    />
                    <Line
                      type="monotone"
                      dataKey="unchanged"
                      name="No Changes"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", r: 4 }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Forecast Insight</p>
                    <p className="text-slate-400 text-xs">
                      With consistent habit improvements, your risk could drop to <span className="text-green-400 font-bold">20%</span> by December. 
                      Without changes, it may rise to <span className="text-red-400 font-bold">52%</span>.
                    </p>
                  </div>
                </div>
              </div>
            </DataPanel>

            {/* Before vs After Comparison */}
            <DataPanel title="Before vs After Comparison" className="col-span-full lg:col-span-4" delay={0.35}>
              <p className="text-slate-500 text-xs mb-4">Your progress over the past 6 months</p>
              <div className="space-y-4">
                {beforeAfterData.map((item, i) => {
                  const isImproved = item.metric.includes("Risk") || item.metric.includes("Cholesterol") || item.metric.includes("Pressure")
                    ? item.after < item.before
                    : item.after > item.before;
                  const changePercent = Math.round(Math.abs(item.after - item.before) / item.before * 100);
                  
                  return (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">{item.metric}</span>
                        <span className={`text-xs font-bold ${isImproved ? "text-green-400" : "text-red-400"}`}>
                          {isImproved ? "↓" : "↑"} {changePercent}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">Before</span>
                            <span className="text-slate-300 font-mono">{item.before}{item.unit}</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-600 rounded-full"
                              style={{ width: `${Math.min((item.before / Math.max(item.before, item.after)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">After</span>
                            <span className={`font-mono font-bold ${isImproved ? "text-green-400" : "text-red-400"}`}>
                              {item.after}{item.unit}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isImproved ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${Math.min((item.after / Math.max(item.before, item.after)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DataPanel>
          </div>
          
          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/dashboard"
              className="h-12 px-8 bg-slate-900 border border-white/5 text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-800 hover:text-white transition-all"
            >
              System Command
            </Link>
            <Link
              href="/simulator"
              className="h-12 px-8 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:from-cyan-500/20 hover:to-teal-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Try Lifestyle Simulator
            </Link>
            <Link
              href="/assessment"
              className="h-12 px-8 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-500/20 transition-all"
            >
              Execute New Analysis
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Synchronizing Diagnostics...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
