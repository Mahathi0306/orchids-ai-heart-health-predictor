"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  User,
  LogOut,
  Settings,
  History,
  Apple,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Sidebar({ username, onLogout }: { username: string; onLogout: () => void }) {
  const navItems = [
    { icon: Activity, label: "Dashboard", href: "/dashboard" },
    { icon: History, label: "History", href: "/history" },
    { icon: Apple, label: "Recommendations", href: "/recommendations", active: true },
    { icon: Settings, label: "Settings", href: "/dashboard" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0F172A] border-r border-white/5 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            CardioAI
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{username || "User"}</p>
            <p className="text-xs text-[#64748B]">Health Profile</p>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function RecommendationCard({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
}

function ActivityRing({ percent }: { percent: number }) {
  const circumference = 2 * Math.PI * 35;
  const strokeOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" fill="none" stroke="#1E293B" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r="35"
          fill="none"
          stroke="#22C55E"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{percent}%</span>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
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
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-0 vignette pointer-events-none z-10" />
      
      {/* Static organic shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px]" />

      <Sidebar username={username} onLogout={handleLogout} />

      <main className="ml-64 p-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Lifestyle Guidance
            </h1>
            <p className="text-[#94A3B8]">
              Personalized AI recommendations based on your latest heart health assessment
            </p>
          </motion.div>

          <div className="grid gap-8">
            <RecommendationCard title="Dietary Recommendations" icon={Apple} color="#22C55E">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[#22C55E] font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Foods to Prioritize
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Leafy Greens", "Oatmeal", "Fatty Fish", "Berries", "Walnuts", "Olive Oil"].map((food) => (
                      <span
                        key={food}
                        className="px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[#EF4444] font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Foods to Limit
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Processed Meats", "Soda", "Trans Fats", "Excess Salt", "White Bread"].map((food) => (
                      <span
                        key={food}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-sm font-medium border border-red-500/20"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-8 text-sm text-[#94A3B8] leading-relaxed italic border-l-2 border-teal-500 pl-4">
                "Small dietary changes can lead to a 20-30% reduction in cardiovascular risk factors over time. Focus on consistency rather than perfection."
              </p>
            </RecommendationCard>

            <RecommendationCard title="Physical Activity" icon={Activity} color="#22D3EE">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Recommended Intensity</h3>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">
                      Moderate-intensity aerobic activity, such as brisk walking, for at least 150 minutes per week.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#1E293B]/50 rounded-2xl border border-white/5">
                      <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1 font-bold">Daily Goal</p>
                      <p className="text-xl font-bold text-white">30 Min</p>
                    </div>
                    <div className="p-4 bg-[#1E293B]/50 rounded-2xl border border-white/5">
                      <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1 font-bold">Frequency</p>
                      <p className="text-xl font-bold text-white">5 Days/Wk</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center bg-[#1E293B]/30 p-8 rounded-3xl border border-white/5">
                  <ActivityRing percent={65} />
                  <p className="mt-4 text-white font-bold">Weekly Progress</p>
                  <p className="text-[#64748B] text-sm mt-1">98 / 150 mins</p>
                </div>
              </div>
            </RecommendationCard>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-[32px] p-8 border border-cyan-500/20"
            >
              <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Next Steps for You
              </h2>
              <ul className="space-y-4">
                {[
                  "Schedule a follow-up lipid panel in 3 months",
                  "Monitor blood pressure twice weekly at home",
                  "Incorporate 10-minute morning stretching routine",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#94A3B8]">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
              <Link
                href="/assessment"
                className="mt-8 inline-flex items-center gap-2 h-12 px-8 bg-white text-[#0B1220] font-bold rounded-full hover:bg-cyan-50 transition-all"
              >
                Retake Assessment
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <p className="mt-12 text-center text-xs text-[#64748B] leading-relaxed">
            These recommendations are generated by AI based on clinical guidelines. They should supplement, not replace, the personalized advice from your doctor.
          </p>
        </div>
      </main>
    </div>
  );
}
