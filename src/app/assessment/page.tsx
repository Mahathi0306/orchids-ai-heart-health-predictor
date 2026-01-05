"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
  Droplets,
  Cigarette,
  Users,
  Stethoscope,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AssessmentData {
  age: number;
  gender: string;
  hypertension: boolean | null;
  diabetes: boolean | null;
  smoking: string;
  cholesterol: number;
  familyHistory: boolean | null;
}

const steps = [
  { id: 1, title: "Age & Gender", icon: User },
  { id: 2, title: "Blood Pressure", icon: Activity },
  { id: 3, title: "Diabetes", icon: Droplets },
  { id: 4, title: "Smoking Status", icon: Cigarette },
  { id: 5, title: "Cholesterol", icon: Stethoscope },
  { id: 6, title: "Family History", icon: Users },
];

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#94A3B8]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-cyan-400">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ToggleButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-14 rounded-2xl font-medium transition-all duration-200 ${
        selected
          ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-[#0B1220] shadow-lg shadow-cyan-500/25"
          : "bg-[#1E293B] text-[#94A3B8] hover:bg-[#2D3B4F] border border-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function PillSelector({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
            selected === option.value
              ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-[#0B1220] shadow-lg shadow-cyan-500/25"
              : "bg-[#1E293B] text-[#94A3B8] hover:bg-[#2D3B4F] border border-white/5"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<AssessmentData>({
    age: 45,
    gender: "",
    hypertension: null,
    diabetes: null,
    smoking: "",
    cholesterol: 200,
    familyHistory: null,
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.age > 0 && data.gender !== "";
      case 2:
        return data.hypertension !== null;
      case 3:
        return data.diabetes !== null;
      case 4:
        return data.smoking !== "";
      case 5:
        return data.cholesterol > 0;
      case 6:
        return data.familyHistory !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 6 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const riskScore = Math.floor(Math.random() * 40) + 20;
    setTimeout(() => {
      router.push(`/results?score=${riskScore}`);
    }, 1500);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    setDirection(1);
    handleNext();
  };

  const goBack = () => {
    setDirection(-1);
    handleBack();
  };

  const renderStepContent = () => {
    const CurrentIcon = steps[currentStep - 1].icon;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Age & Gender
                </h2>
                <p className="text-sm text-[#64748B]">Basic demographic information</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-[#94A3B8]">Your Age</label>
              <div className="flex items-center gap-6">
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-[#1E293B] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/30"
                />
                <div className="w-20 h-12 bg-[#1E293B] rounded-xl flex items-center justify-center">
                  <span className="text-xl font-semibold text-white">{data.age}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-[#94A3B8]">Gender</label>
              <PillSelector
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                selected={data.gender}
                onChange={(value) => setData({ ...data, gender: value })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Blood Pressure
                </h2>
                <p className="text-sm text-[#64748B]">Have you been diagnosed with hypertension?</p>
              </div>
            </div>

            <div className="flex gap-4">
              <ToggleButton
                selected={data.hypertension === true}
                onClick={() => setData({ ...data, hypertension: true })}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                selected={data.hypertension === false}
                onClick={() => setData({ ...data, hypertension: false })}
              >
                No
              </ToggleButton>
            </div>

            <p className="text-sm text-[#64748B] bg-[#1E293B]/50 p-4 rounded-xl">
              Hypertension (high blood pressure) is a major risk factor for heart disease. Normal blood
              pressure is typically below 120/80 mmHg.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Diabetes Status
                </h2>
                <p className="text-sm text-[#64748B]">Have you been diagnosed with diabetes?</p>
              </div>
            </div>

            <div className="flex gap-4">
              <ToggleButton
                selected={data.diabetes === true}
                onClick={() => setData({ ...data, diabetes: true })}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                selected={data.diabetes === false}
                onClick={() => setData({ ...data, diabetes: false })}
              >
                No
              </ToggleButton>
            </div>

            <p className="text-sm text-[#64748B] bg-[#1E293B]/50 p-4 rounded-xl">
              Diabetes significantly increases the risk of developing cardiovascular disease. Managing
              blood sugar levels is crucial for heart health.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Smoking Status
                </h2>
                <p className="text-sm text-[#64748B]">What is your current smoking status?</p>
              </div>
            </div>

            <PillSelector
              options={[
                { value: "never", label: "Never Smoked" },
                { value: "former", label: "Former Smoker" },
                { value: "current", label: "Current Smoker" },
              ]}
              selected={data.smoking}
              onChange={(value) => setData({ ...data, smoking: value })}
            />

            <p className="text-sm text-[#64748B] bg-[#1E293B]/50 p-4 rounded-xl">
              Smoking is one of the leading preventable causes of heart disease. Quitting smoking can
              significantly reduce cardiovascular risk within years.
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Cholesterol Level
                </h2>
                <p className="text-sm text-[#64748B]">Approximate total cholesterol (mg/dL)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={data.cholesterol}
                  onChange={(e) => setData({ ...data, cholesterol: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-[#1E293B] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/30"
                />
                <div className="w-24 h-12 bg-[#1E293B] rounded-xl flex items-center justify-center">
                  <span className="text-xl font-semibold text-white">{data.cholesterol}</span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-[#64748B]">
                <span>Desirable (&lt;200)</span>
                <span>Borderline (200-239)</span>
                <span>High (&gt;240)</span>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl text-sm ${
                data.cholesterol < 200
                  ? "bg-green-500/10 text-green-400"
                  : data.cholesterol < 240
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {data.cholesterol < 200
                ? "Your cholesterol level is in the desirable range."
                : data.cholesterol < 240
                ? "Your cholesterol is borderline high. Consider lifestyle changes."
                : "Your cholesterol is high. Consult a healthcare provider."}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <CurrentIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Family History
                </h2>
                <p className="text-sm text-[#64748B]">Heart disease in immediate family members?</p>
              </div>
            </div>

            <div className="flex gap-4">
              <ToggleButton
                selected={data.familyHistory === true}
                onClick={() => setData({ ...data, familyHistory: true })}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                selected={data.familyHistory === false}
                onClick={() => setData({ ...data, familyHistory: false })}
              >
                No
              </ToggleButton>
            </div>

            <p className="text-sm text-[#64748B] bg-[#1E293B]/50 p-4 rounded-xl">
              Family history of heart disease (parents or siblings) can increase your risk. Early
              detection and prevention become even more important.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1220] relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Heart Health Assessment
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <ProgressBar currentStep={currentStep} totalSteps={6} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111827] rounded-[32px] p-8 shadow-2xl border border-white/5"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-4 mt-10">
              {currentStep > 1 && (
                <button
                  onClick={goBack}
                  className="h-12 px-6 bg-[#1E293B] text-[#94A3B8] rounded-full font-medium hover:bg-[#2D3B4F] transition-all flex items-center gap-2 border border-white/5"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              )}

              {currentStep < 6 ? (
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#0B1220] font-semibold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-cyan-500/25"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#0B1220] font-semibold rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      Get My Results
                      <Heart className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          <p className="mt-6 text-center text-xs text-[#64748B]">
            Your data is encrypted and never shared. This assessment is for educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
