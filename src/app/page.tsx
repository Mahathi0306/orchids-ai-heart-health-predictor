"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Droplets,
  Bone,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Navigation";

const diseases = [
  {
    id: "heart",
    name: "Heart Disease",
    icon: Heart,
    status: "Active",
    lastUpdated: "2 days ago",
    riskLevel: 33,
    trend: "improving",
  },
  {
    id: "diabetes",
    name: "Diabetes Risk",
    icon: Droplets,
    status: "Not Assessed",
    lastUpdated: null,
    riskLevel: null,
    trend: null,
  },
  {
    id: "stroke",
    name: "Stroke Risk",
    icon: Brain,
    status: "Not Assessed",
    lastUpdated: null,
    riskLevel: null,
    trend: null,
  },
  {
    id: "hypertension",
    name: "Hypertension",
    icon: Activity,
    status: "Updated",
    lastUpdated: "1 week ago",
    riskLevel: 28,
    trend: "stable",
  },
  {
    id: "kidney",
    name: "Kidney Disease",
    icon: Stethoscope,
    status: "Not Assessed",
    lastUpdated: null,
    riskLevel: null,
    trend: null,
  },
  {
    id: "osteoporosis",
    name: "Bone Density",
    icon: Bone,
    status: "Not Assessed",
    lastUpdated: null,
    riskLevel: null,
    trend: null,
  },
];

function MiniSparkline({ trend }: { trend: string | null }) {
  if (!trend) return null;
  
  const isImproving = trend === "improving";
  const points = isImproving 
    ? "0,15 10,14 20,16 30,10 40,8 50,4"
    : "0,10 10,12 20,10 30,11 40,10 50,10";
  
  return (
    <svg className="w-12 h-5 opacity-80" viewBox="0 0 50 20">
      <polyline
        points={points}
        fill="none"
        stroke={isImproving ? "#22D3EE" : "#64748B"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiseasePanel({ disease }: { disease: typeof diseases[0] }) {
  const Icon = disease.icon;
  const isAssessed = disease.riskLevel !== null;
  
  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 hover:bg-[#1e293b]/50 transition-all group cursor-pointer relative overflow-hidden">
      {isAssessed && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-cyan-500/10 transition-colors" />
      )}
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
            <Icon className={`w-5 h-5 ${isAssessed ? "text-cyan-400" : "text-slate-500"}`} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">{disease.name}</h3>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                disease.status === "Active" ? "text-cyan-400" : 
                disease.status === "Updated" ? "text-green-400" : "text-slate-500"
            }`}>
              {disease.status}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
      </div>
      
      {isAssessed ? (
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {disease.riskLevel}%
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global Risk Score</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <MiniSparkline trend={disease.trend} />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-white/5">
               <span className={`text-[10px] font-bold uppercase tracking-tighter ${disease.trend === "improving" ? "text-cyan-400" : "text-slate-500"}`}>
                {disease.trend === "improving" ? "Improving" : "Stable"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-2">
          <p className="text-slate-500 text-xs font-medium">Insufficient data for analysis</p>
          <Link
            href="/assessment"
            className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10"
          >
            Start Assessment
          </Link>
        </div>
      )}
    </div>
  );
}

function QuickStatsPanel() {
  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 col-span-full xl:col-span-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">Statistical Risk Distribution</h3>
          <p className="text-slate-500 text-xs mt-1">Aggregated data from all active monitors</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Monitoring</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: "Assessed Conditions", value: "2", sub: "Out of 6", color: "text-white" },
          { label: "Mean Risk Index", value: "31%", sub: "-4% since last week", color: "text-cyan-400" },
          { label: "Pending Analysis", value: "4", sub: "Requires input", color: "text-slate-400" },
          { label: "Recovery Velocity", value: "+12%", sub: "Above average", color: "text-green-400", trend: true },
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold tracking-tighter ${stat.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </p>
              {stat.trend && <TrendingUp className="w-3 h-3 text-green-400" />}
            </div>
            <p className="text-[10px] text-slate-600 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClinicalDashboard() {
  return (
    <div className="min-h-screen">
      <Header title="HEALTH OVERVIEW" subtitle="Diagnostic Dashboard" />
      
      <main className="p-10">
        <div className="max-w-[1600px] mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {diseases.map((disease) => (
              <DiseasePanel key={disease.id} disease={disease} />
            ))}
            
            <QuickStatsPanel />
            
            <div className="xl:col-span-1 bg-[#0f172a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Recent Logs</h3>
                <Link href="/history" className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:underline">
                  Protocol History
                </Link>
              </div>
              
              <div className="space-y-4">
                {[
                  { action: "Cardiovascular profile synchronized", time: "08:42 AM", status: "cyan" },
                  { action: "Hypertension baseline recalibrated", time: "Yesterday", status: "green" },
                  { action: "System: New biometric data detected", time: "2 days ago", status: "slate" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "cyan" ? "bg-cyan-400" : 
                        item.status === "green" ? "bg-green-400" : "bg-slate-700"
                      }`} />
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{item.action}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <footer className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 gap-4">
            <div className="flex gap-6">
              <Link href="#" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors">Documentation</Link>
              <Link href="#" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors">System Status</Link>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              © 2024 CARDIO-AI PROTOCOL. PRED-V2.4.12
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
