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
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useState, useEffect } from "react";

const defaultDiseases = [
  {
    id: "heart",
    name: "Heart Disease",
    icon: Heart,
    status: "Active",
    lastUpdated: "2 days ago",
    riskLevel: 45,
    trend: "improving",
  },
  {
    id: "lung",
    name: "Lung Disease",
    icon: Brain,
    status: "Active",
    lastUpdated: "3 days ago",
    riskLevel: 32,
    trend: "stable",
  },
  {
    id: "thyroid",
    name: "Thyroid",
    icon: Activity,
    status: "Active",
    lastUpdated: "1 week ago",
    riskLevel: 36,
    trend: "improving",
  },
  {
    id: "pcod",
    name: "PCOD/PCOS",
    icon: Stethoscope,
    status: "Active",
    lastUpdated: "5 days ago",
    riskLevel: 41,
    trend: "stable",
  },
  {
    id: "diabetes",
    name: "Type 2 Diabetes",
    icon: Droplets,
    status: "Active",
    lastUpdated: "4 days ago",
    riskLevel: 58,
    trend: "improving",
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

function DiseasePanel({ disease }: { disease: typeof defaultDiseases[0] }) {
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
            href={`/assessment?disease=${disease.id}`}
            className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10"
          >
            Start Assessment
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ClinicalDashboard() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [diseases, setDiseases] = useState(defaultDiseases);
  
  useEffect(() => {
    // Get username from localStorage
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
      
      // Load saved risk levels from localStorage or use defaults
      const savedRisks = localStorage.getItem('diseaseRisks');
      if (savedRisks) {
        const parsedRisks = JSON.parse(savedRisks);
        const updatedDiseases = defaultDiseases.map(disease => ({
          ...disease,
          riskLevel: parsedRisks[disease.id] ?? disease.riskLevel,
          status: parsedRisks[disease.id] !== undefined ? "Active" : disease.status
        }));
        setDiseases(updatedDiseases);
      } else {
        // Save default risks to localStorage
        const defaultRisks = {
          heart: 45,
          lung: 32,
          thyroid: 36,
          pcod: 41,
          diabetes: 58
        };
        localStorage.setItem('diseaseRisks', JSON.stringify(defaultRisks));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };
  
  return (
    <div className="min-h-screen">
      <div className="bg-[#0f172a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-widest">HEALTH OVERVIEW</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Diagnostic Dashboard</p>
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
          {/* Welcome Message */}
          {username && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">Hi, {username}! 👋</h2>
              <p className="text-slate-400 mt-2">Here's your health overview</p>
            </div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {diseases.map((disease) => (
              <DiseasePanel key={disease.id} disease={disease} />
            ))}
            
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
