"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
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
} from "recharts";
import { Header } from "@/components/Navigation";

const trendData = [
  { month: "Jan", risk: 48 },
  { month: "Feb", risk: 45 },
  { month: "Mar", risk: 42 },
  { month: "Apr", risk: 38 },
  { month: "May", risk: 36 },
  { month: "Jun", risk: 33 },
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
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam) : 33;
  const [reportId, setReportId] = useState("RPT-000000");

  useEffect(() => {
    setReportId(`RPT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
  }, []);

  const getRiskLevel = () => {
    if (score < 30) return { level: "Low", color: "text-green-400" };
    if (score < 60) return { level: "Moderate", color: "text-cyan-400" };
    return { level: "Elevated", color: "text-red-400" };
  };

  const riskInfo = getRiskLevel();

  return (
    <div className="min-h-screen">
      <Header title="DIAGNOSTIC REPORT" subtitle="Risk Analysis Verification" />
      
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
          </div>
          
          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/dashboard"
              className="h-12 px-8 bg-slate-900 border border-white/5 text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-800 hover:text-white transition-all"
            >
              System Command
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
