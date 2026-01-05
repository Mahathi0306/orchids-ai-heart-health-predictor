"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Search,
  ChevronRight,
  Home,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Mail,
  Download,
  List,
  TrendingDown,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const riskHistoryData = [
  { date: "Jan 15", risk: 48 },
  { date: "Feb 12", risk: 45 },
  { date: "Mar 18", risk: 42 },
  { date: "Apr 22", risk: 38 },
  { date: "May 10", risk: 36 },
  { date: "Jun 15", risk: 33 },
];

const cholesterolHistoryData = [
  { date: "Jan 15", value: 230 },
  { date: "Feb 12", value: 225 },
  { date: "Mar 18", value: 218 },
  { date: "Apr 22", value: 210 },
  { date: "May 10", value: 205 },
  { date: "Jun 15", value: 198 },
];

const bpHistoryData = [
  { date: "Jan 15", systolic: 128, diastolic: 84 },
  { date: "Feb 12", systolic: 125, diastolic: 82 },
  { date: "Mar 18", systolic: 122, diastolic: 80 },
  { date: "Apr 22", systolic: 120, diastolic: 78 },
  { date: "May 10", systolic: 118, diastolic: 76 },
  { date: "Jun 15", systolic: 118, diastolic: 76 },
];

const assessments = [
  { id: 1, date: "June 15, 2024", riskScore: 33, status: "low", cholesterol: 198, bp: "118/76" },
  { id: 2, date: "May 10, 2024", riskScore: 36, status: "moderate", cholesterol: 205, bp: "118/76" },
  { id: 3, date: "April 22, 2024", riskScore: 38, status: "moderate", cholesterol: 210, bp: "120/78" },
  { id: 4, date: "March 18, 2024", riskScore: 42, status: "moderate", cholesterol: 218, bp: "122/80" },
  { id: 5, date: "February 12, 2024", riskScore: 45, status: "moderate", cholesterol: 225, bp: "125/82" },
  { id: 6, date: "January 15, 2024", riskScore: 48, status: "moderate", cholesterol: 230, bp: "128/84" },
];

const sidebarItems = [
  { icon: List, label: "Overview", href: "/" },
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/history", active: true },
  { icon: FileText, label: "Reports", href: "/results" },
  { icon: Download, label: "Export" },
  { icon: Mail, label: "Messages" },
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

function Sidebar() {
  return (
    <aside className="w-20 h-screen bg-[#0a0f1a] border-r border-cyan-500/10 flex flex-col items-center py-6 fixed left-0 top-0 z-50">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center mb-8">
        <Heart className="w-5 h-5 text-white" />
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            href={item.href || "#"}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              item.active
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}

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
      className={`bg-[#111827] border border-cyan-500/10 rounded-lg p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <ChevronRight className="w-4 h-4 text-slate-600" />
      </div>
      {children}
    </motion.div>
  );
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Sidebar />
      
      <main className="ml-20">
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="h-16 border-b border-cyan-500/10 flex items-center justify-between px-8 bg-[#0a0f1a]/80 backdrop-blur-sm sticky top-0 z-40"
        >
          <div>
            <h1 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PATIENT: JOHN DOE <span className="text-cyan-400 ml-1">+</span>
            </h1>
            <p className="text-slate-500 text-xs">Historical analytics</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="SEARCH"
                className="w-48 h-9 pl-9 pr-4 bg-[#111827] border border-cyan-500/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30"
              />
            </div>
            <p className="text-slate-500 text-sm">Case number: <span className="text-white">00027689</span></p>
          </div>
        </motion.header>
        
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111827] border border-cyan-500/10 rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs">Risk Score Change</span>
                  <TrendingDown className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  -15%
                </p>
                <p className="text-xs text-slate-600 mt-1">Since first assessment</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-[#111827] border border-cyan-500/10 rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs">Cholesterol Change</span>
                  <TrendingDown className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  -32 mg/dL
                </p>
                <p className="text-xs text-slate-600 mt-1">From 230 to 198</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111827] border border-cyan-500/10 rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs">Total Assessments</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  6
                </p>
                <p className="text-xs text-slate-600 mt-1">In the past 6 months</p>
              </motion.div>
            </div>
            
            <DataPanel title="Risk score over time" className="col-span-6" delay={0.15}>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskHistoryData}>
                    <defs>
                      <linearGradient id="riskGradientHist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid rgba(34,211,238,0.2)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#22D3EE"
                      strokeWidth={2}
                      fill="url(#riskGradientHist)"
                      dot={{ fill: "#22D3EE", r: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DataPanel>
            
            <DataPanel title="Cholesterol over time" className="col-span-6" delay={0.2}>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cholesterolHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} domain={[150, 250]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid rgba(34,211,238,0.2)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#14B8A6"
                      strokeWidth={2}
                      dot={{ fill: "#14B8A6", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DataPanel>
            
            <DataPanel title="Blood pressure trend" className="col-span-12" delay={0.25}>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bpHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} domain={[60, 140]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid rgba(34,211,238,0.2)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#22C55E"
                      strokeWidth={2}
                      name="Systolic"
                      dot={{ fill: "#22C55E", r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Diastolic"
                      dot={{ fill: "#F59E0B", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-500">Systolic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-500">Diastolic</span>
                </div>
              </div>
            </DataPanel>
            
            <DataPanel title="Assessment history" className="col-span-12" delay={0.3}>
              <div className="space-y-2">
                {assessments.map((assessment, i) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.03 }}
                    className="flex items-center justify-between p-3 bg-[#0a0f1a] rounded-lg hover:bg-[#0f1520] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#111827] flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm text-white">{assessment.date}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>Cholesterol: {assessment.cholesterol}</span>
                          <span>BP: {assessment.bp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          assessment.status === "low" ? "text-green-400" : "text-amber-400"
                        }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {assessment.riskScore}%
                        </p>
                        <p className="text-xs text-slate-600">Risk Score</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </DataPanel>
          </div>
          
          <p className="mt-6 text-center text-xs text-slate-600">
            This platform provides predictive analytics for educational purposes only. 
            Always consult healthcare professionals for medical decisions.
          </p>
        </div>
      </main>
    </div>
  );
}
