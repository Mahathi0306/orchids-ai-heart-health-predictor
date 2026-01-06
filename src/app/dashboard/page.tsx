"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useReducedMotion } from "@/hooks/use-reduced-motion";

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
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [wearablesData, setWearablesData] = useState<{day: number, value: number}[]>([]);

  useEffect(() => {
    setWearablesData(Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      value: 20 + Math.random() * 40,
    })));
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

  return (
    <div className="min-h-screen">
      <div className="bg-[#0f172a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-widest">ANALYTICS COMMAND</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Advanced Heart Disease Dashboard</p>
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
