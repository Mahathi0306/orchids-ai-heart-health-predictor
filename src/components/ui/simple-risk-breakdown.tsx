"use client";

import { Heart, Droplets, Activity, Brain, Moon, Cigarette } from "lucide-react";

interface RiskFactor {
  name: string;
  value: number;
  impact: "high" | "medium" | "low";
  icon: React.ReactNode;
}

interface SimpleRiskBreakdownProps {
  overallRisk?: number;
  factors?: RiskFactor[];
}

const defaultFactors: RiskFactor[] = [
  { name: "Blood Pressure", value: 72, impact: "medium", icon: <Heart className="w-4 h-4" /> },
  { name: "Cholesterol", value: 45, impact: "low", icon: <Droplets className="w-4 h-4" /> },
  { name: "Activity Level", value: 38, impact: "high", icon: <Activity className="w-4 h-4" /> },
  { name: "Stress", value: 65, impact: "medium", icon: <Brain className="w-4 h-4" /> },
  { name: "Sleep Quality", value: 52, impact: "medium", icon: <Moon className="w-4 h-4" /> },
  { name: "Smoking", value: 0, impact: "low", icon: <Cigarette className="w-4 h-4" /> },
];

const impactColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const impactBg = {
  high: "bg-red-500/10 border-red-500/20",
  medium: "bg-yellow-500/10 border-yellow-500/20",
  low: "bg-green-500/10 border-green-500/20",
};

const impactText = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

export function SimpleRiskBreakdown({ 
  overallRisk = 32, 
  factors = defaultFactors 
}: SimpleRiskBreakdownProps) {
  
  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { label: "Low", color: "text-green-400", bg: "bg-green-500/10" };
    if (risk < 60) return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/10" };
    return { label: "High", color: "text-red-400", bg: "bg-red-500/10" };
  };

  const riskLevel = getRiskLevel(overallRisk);
  const highImpactFactor = factors.find(f => f.impact === "high");

  return (
    <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6 space-y-6">
      {/* Overall Risk - Simple Circle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Risk Overview</h3>
          <p className="text-sm text-slate-500">Based on your health profile</p>
        </div>
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={riskLevel.color}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${overallRisk}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${riskLevel.color}`}>{overallRisk}%</span>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskLevel.bg} ${riskLevel.color}`}>
        {riskLevel.label} Risk
      </div>

      {/* Simple Factor List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Contributing Factors</h4>
        {factors.map((factor) => (
          <div 
            key={factor.name} 
            className={`flex items-center justify-between p-3 rounded-xl border ${impactBg[factor.impact]} transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${impactBg[factor.impact]} ${impactText[factor.impact]}`}>
                {factor.icon}
              </div>
              <span className="text-sm font-medium text-white">{factor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Simple bar instead of complex chart */}
              <div className="w-24 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${impactColors[factor.impact]}`}
                  style={{ width: `${factor.value}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-8 text-right">{factor.value}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Recommendation */}
      {highImpactFactor && (
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-sm text-slate-300">
            <span className="font-medium text-white">Top Priority:</span> Focus on improving{" "}
            <span className="text-cyan-400 font-medium">{highImpactFactor.name}</span>{" "}
            for the biggest health impact.
          </p>
        </div>
      )}
    </div>
  );
}

export default SimpleRiskBreakdown;
