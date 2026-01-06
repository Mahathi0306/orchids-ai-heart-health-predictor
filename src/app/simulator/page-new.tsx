"use client";

import { useState } from "react";
import { Heart, Wind, Activity, Droplets, Zap } from "lucide-react";
import { Header } from "@/components/Navigation";

interface DiseaseQuestion {
  id: string;
  text: string;
  options: string[];
}

interface Disease {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  questions: DiseaseQuestion[];
  simulatedRisk: number;
}

const diseases: Disease[] = [
  {
    id: "heart",
    name: "Heart Disease",
    icon: Heart,
    color: "text-red-400",
    simulatedRisk: 52,
    questions: [
      {
        id: "exercise",
        text: "How often do you exercise per week?",
        options: ["Never", "1-2 times", "3-4 times", "5+ times"],
      },
      {
        id: "oily_food",
        text: "How often do you consume oily/fried food?",
        options: ["Daily", "Few times a week", "Rarely", "Never"],
      },
      {
        id: "sleep",
        text: "How many hours do you sleep daily?",
        options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "9+ hours"],
      },
      {
        id: "stress",
        text: "What is your stress level at work/home?",
        options: ["Low", "Moderate", "High", "Very High"],
      },
      {
        id: "smoking_alcohol",
        text: "Do you smoke/consume alcohol?",
        options: ["Both regularly", "Only smoke", "Only alcohol", "Neither"],
      },
    ],
  },
  {
    id: "lung",
    name: "Lung Disease",
    icon: Wind,
    color: "text-blue-400",
    simulatedRisk: 38,
    questions: [
      {
        id: "smoking_status",
        text: "What is your smoking status?",
        options: ["Never smoked", "Former smoker", "Current smoker", "Passive smoker"],
      },
      {
        id: "air_quality",
        text: "How is the air quality in your area?",
        options: ["Excellent", "Good", "Moderate", "Poor"],
      },
      {
        id: "breathing",
        text: "Do you experience breathing difficulties?",
        options: ["Never", "Rarely", "Sometimes", "Frequently"],
      },
      {
        id: "activity_level",
        text: "How active is your lifestyle?",
        options: ["Sedentary", "Lightly active", "Moderately active", "Very active"],
      },
      {
        id: "allergies",
        text: "Do you have any allergies or asthma?",
        options: ["None", "Mild allergies", "Asthma", "Both"],
      },
    ],
  },
  {
    id: "diabetes",
    name: "Type 2 Diabetes",
    icon: Droplets,
    color: "text-purple-400",
    simulatedRisk: 45,
    questions: [
      {
        id: "sugary_foods",
        text: "How often do you consume sugary foods/drinks?",
        options: ["Daily", "Few times a week", "Rarely", "Never"],
      },
      {
        id: "physical_activity",
        text: "What is your physical activity level?",
        options: ["Sedentary", "Light", "Moderate", "High"],
      },
      {
        id: "body_weight",
        text: "How would you describe your body weight?",
        options: ["Underweight", "Normal", "Overweight", "Obese"],
      },
      {
        id: "family_history",
        text: "Do you have a family history of diabetes?",
        options: ["No", "Distant relatives", "Immediate family", "Both parents"],
      },
      {
        id: "processed_food",
        text: "How often do you eat processed/junk food?",
        options: ["Daily", "Few times a week", "Rarely", "Never"],
      },
    ],
  },
  {
    id: "pcod",
    name: "PCOD/PCOS",
    icon: Activity,
    color: "text-pink-400",
    simulatedRisk: 55,
    questions: [
      {
        id: "menstrual_cycle",
        text: "How regular is your menstrual cycle?",
        options: ["Regular (every 28-35 days)", "Irregular", "Very irregular", "Absent periods"],
      },
      {
        id: "acne_hair",
        text: "Do you experience acne or excess hair growth?",
        options: ["Neither", "Acne only", "Excess hair only", "Both"],
      },
      {
        id: "weight_gain",
        text: "Have you experienced unexplained weight gain?",
        options: ["No", "Slight (2-5 kg)", "Moderate (5-10 kg)", "Significant (>10 kg)"],
      },
      {
        id: "stress_level",
        text: "What is your stress level?",
        options: ["Low", "Moderate", "High", "Very High"],
      },
      {
        id: "family_history_pcod",
        text: "Family history of PCOD/PCOS?",
        options: ["No", "Distant relatives", "Immediate family", "Multiple family members"],
      },
    ],
  },
  {
    id: "thyroid",
    name: "Thyroid",
    icon: Zap,
    color: "text-yellow-400",
    simulatedRisk: 42,
    questions: [
      {
        id: "fatigue",
        text: "Do you experience unexplained fatigue?",
        options: ["Never", "Rarely", "Sometimes", "Frequently"],
      },
      {
        id: "weight_changes",
        text: "Have you noticed unexplained weight changes?",
        options: ["No changes", "Weight gain", "Weight loss", "Fluctuating"],
      },
      {
        id: "mood_changes",
        text: "Do you experience mood swings or depression?",
        options: ["Never", "Rarely", "Sometimes", "Frequently"],
      },
      {
        id: "temperature_sensitivity",
        text: "Are you sensitive to cold or heat?",
        options: ["Neither", "Sensitive to cold", "Sensitive to heat", "Both"],
      },
      {
        id: "family_history_thyroid",
        text: "Family history of thyroid disorders?",
        options: ["No", "Distant relatives", "Immediate family", "Multiple family members"],
      },
    ],
  },
];

export default function SimulatorPage() {
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});

  const handleAnswerChange = (diseaseId: string, questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [diseaseId]: {
        ...prev[diseaseId],
        [questionId]: answer,
      },
    }));
  };

  const handleAnalyzeRisk = () => {
    alert("Analyzing risk based on your inputs...");
    // Here you would typically calculate and show results
  };

  return (
    <div className="min-h-screen">
      <Header title="LIFESTYLE SIMULATOR" subtitle="Adjust habits to see impact on health" />

      <main className="p-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="space-y-8">
            {diseases.map((disease) => {
              const Icon = disease.icon;
              return (
                <div key={disease.id} className="bg-[#0f172a] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${disease.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{disease.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Simulated Risk</p>
                      <p className={`text-3xl font-bold ${disease.color}`}>{disease.simulatedRisk}%</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {disease.questions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">{question.text}</label>
                        <select
                          value={answers[disease.id]?.[question.id] || ""}
                          onChange={(e) => handleAnswerChange(disease.id, question.id, e.target.value)}
                          className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                        >
                          <option value="">Select an option</option>
                          {question.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        disease.simulatedRisk < 30
                          ? "bg-green-500"
                          : disease.simulatedRisk < 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${disease.simulatedRisk}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex justify-center pt-6">
              <button
                onClick={handleAnalyzeRisk}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#0B1220] font-semibold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center gap-2"
              >
                Analyze Risk
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
