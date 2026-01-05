"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";
import { Header } from "@/components/Navigation";

const riskData = [
  { year: "2018", risk: 3.2 },
  { year: "2019", risk: 2.8 },
  { year: "2020", risk: 3.5 },
  { year: "2021", risk: 4.2 },
  { year: "2022", risk: 3.8 },
  { year: "2023", risk: 4.5 },
  { year: "2024", risk: 3.3 },
];

const medicationData = [
  { name: "Altair", current: 85, target: 100 },
  { name: "Metho", current: 60, target: 100 },
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

function BodyHeatmap() {
  const points = [
    { id: "shoulder-r", x: 58, y: 22, label: "R", active: true },
    { id: "elbow-r", x: 65, y: 38, label: "elbow", active: true },
    { id: "wrist-r", x: 70, y: 52, label: "wrist", active: true },
  ];

  return (
    <div className="relative w-full h-48 flex items-center justify-center bg-slate-900/50 rounded-xl overflow-hidden">
      <div className="text-[10px] font-bold uppercase tracking-tighter text-cyan-400 absolute top-2 left-4">Diagnostic Mapping</div>
      <svg viewBox="0 0 100 100" className="h-40 opacity-40">
        <ellipse cx="50" cy="12" rx="8" ry="10" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
        <rect x="42" y="22" width="16" height="30" rx="3" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
        <rect x="28" y="22" width="14" height="6" rx="2" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
        <rect x="58" y="22" width="14" height="6" rx="2" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
        <rect x="24" y="28" width="6" height="25" rx="2" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
        <rect x="70" y="28" width="6" height="25" rx="2" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
        <rect x="44" y="52" width="5" height="35" rx="2" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
        <rect x="51" y="52" width="5" height="35" rx="2" fill="#1E293B" stroke="#22D3EE" strokeWidth="0.5" />
      </svg>
      {points.map((point) => (
        <div
          key={point.id}
          className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [wearablesData, setWearablesData] = useState<{day: number, value: number}[]>([]);

  useEffect(() => {
    setWearablesData(Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      value: 20 + Math.random() * 40,
    })));
  }, []);

  return (
    <div className="min-h-screen">
      <Header title="ANALYTICS COMMAND" subtitle="Advanced Heart Disease Dashboard" />
      
      <main className="p-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <DataPanel title="Disease Activity Forecast" className="col-span-full xl:col-span-8" delay={0}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskData}>
                    <defs>
                      <linearGradient id="riskGradientDash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="year" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={[0, 5]} />
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
                      fill="url(#riskGradientDash)"
                      dot={{ fill: "#22D3EE", r: 4, strokeWidth: 2, stroke: "#0f172a" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DataPanel>
            
            <DataPanel title="Risk Heatmap" className="col-span-full md:col-span-6 xl:col-span-4" delay={0.05}>
              <BodyHeatmap />
            </DataPanel>
            
            <DataPanel title="Disease Clusters" className="col-span-full md:col-span-6 xl:col-span-4" delay={0.1}>
              <div className="h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 60" className="w-full h-full">
                  <g className="opacity-80">
                    <circle cx="25" cy="15" r="8" fill="#22D3EE" fillOpacity="0.2" stroke="#22D3EE" strokeWidth="0.5" />
                    <circle cx="25" cy="15" r="2" fill="#22D3EE" />
                    <text x="25" y="40" fill="#64748B" fontSize="3" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">Joint Stiffness</text>
                  </g>
                  <g className="opacity-80">
                    <circle cx="70" cy="12" r="7" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="0.5" />
                    <circle cx="70" cy="12" r="2" fill="#8B5CF6" />
                    <text x="70" y="40" fill="#64748B" fontSize="3" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">Polymyalgia</text>
                  </g>
                  <g className="opacity-80">
                    <circle cx="50" cy="45" r="6" fill="#14B8A6" fillOpacity="0.2" stroke="#14B8A6" strokeWidth="0.5" />
                    <circle cx="50" cy="45" r="2" fill="#14B8A6" />
                    <text x="50" y="58" fill="#64748B" fontSize="3" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">Erosive</text>
                  </g>
                </svg>
              </div>
            </DataPanel>
            
            <DataPanel title="Active Protocol" className="col-span-full md:col-span-6 xl:col-span-4" delay={0.15}>
              <div className="space-y-6">
                {medicationData.map((med) => (
                  <div key={med.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.name}</span>
                      <span className="text-[10px] font-bold text-cyan-400 tracking-tighter">{med.current}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${med.current}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-cyan-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </DataPanel>
            
            <DataPanel title="Telemetry Intake" className="col-span-full md:col-span-6 xl:col-span-4" delay={0.2}>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wearablesData}>
                    <Bar dataKey="value" fill="#22D3EE" radius={[2, 2, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4 text-center">30-Day Biometric Stream</p>
            </DataPanel>
            
            <div className="col-span-full mt-6">
              <Link
                href="/assessment"
                className="flex items-center justify-center gap-3 h-14 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-500/20 transition-all group"
              >
                <Zap className="w-4 h-4 group-hover:fill-cyan-400 transition-all" />
                Initialize New Patient Assessment
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
