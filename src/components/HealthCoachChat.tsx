"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PerformanceAwareMotion } from "@/components/performance";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Moon,
  Utensils,
  Activity,
  Heart,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface WeeklyPlan {
  day: string;
  sleep: string;
  diet: string;
  activity: string;
  mindfulness: string;
}

// AI Coach response templates
const coachResponses: Record<string, { response: string; suggestions: string[] }> = {
  sleep: {
    response: "I understand sleep can be challenging. Here are some evidence-based tips:\n\n🌙 **Sleep Hygiene Improvements:**\n• Avoid screens 60 minutes before bed\n• Keep your bedroom cool (65-68°F)\n• Try a consistent wake time, even weekends\n• Limit caffeine after 2 PM\n\nWould you like me to create a personalized sleep improvement plan?",
    suggestions: ["Create sleep plan", "More sleep tips", "Track my sleep"],
  },
  sugar: {
    response: "Reducing sugar intake is one of the most impactful changes you can make! Here's a gradual approach:\n\n🍭 **Sugar Reduction Strategy:**\n• Week 1-2: Replace sugary drinks with water\n• Week 3-4: Swap desserts for fruit\n• Week 5-6: Check labels for hidden sugars\n\nYour diabetes risk could drop by **12-15%** with consistent effort!",
    suggestions: ["Low-sugar meal ideas", "Sugar alternatives", "Weekly meal plan"],
  },
  exercise: {
    response: "Great question! Starting small is key to sustainable fitness:\n\n🏃 **Beginner Activity Plan:**\n• Start with 10-minute walks after meals\n• Add 5 minutes each week\n• Include strength training 2x/week\n• Find activities you enjoy!\n\nEven 30 minutes of moderate activity reduces heart disease risk by **20%**.",
    suggestions: ["Home workouts", "Walking plan", "Track activity"],
  },
  stress: {
    response: "Stress management is crucial for heart and thyroid health. Try these techniques:\n\n🧘 **Stress Reduction Tools:**\n• 4-7-8 breathing: Inhale 4s, hold 7s, exhale 8s\n• 5-minute morning meditation\n• Progressive muscle relaxation before bed\n• Nature walks when possible\n\nReducing stress can lower your overall health risk by **8-12%**!",
    suggestions: ["Breathing exercise", "Meditation guide", "Stress tracker"],
  },
  snacking: {
    response: "Night snacking is common! Here's how to manage it healthily:\n\n🥜 **Smart Snacking Strategy:**\n• Choose protein-rich snacks (Greek yogurt, nuts)\n• Aim for an 8-hour eating window\n• Keep healthy snacks visible, hide tempting ones\n• Drink water first - sometimes we're just thirsty!\n\nThis simple change can improve your metabolic health significantly.",
    suggestions: ["Healthy snack list", "Meal timing plan", "Appetite tips"],
  },
  default: {
    response: "I'm here to help you optimize your health! I can provide personalized advice on:\n\n• 😴 Sleep improvement\n• 🍎 Nutrition & diet\n• 🏃 Physical activity\n• 🧘 Stress management\n• 💊 Habit building\n\nWhat area would you like to focus on today?",
    suggestions: ["Improve sleep", "Reduce sugar", "Start exercising", "Manage stress"],
  },
};

// Weekly plan generator
function generateWeeklyPlan(): WeeklyPlan[] {
  return [
    { day: "Monday", sleep: "7.5 hrs target", diet: "Reduce sugar 20%", activity: "5000 steps", mindfulness: "5 min breathing" },
    { day: "Tuesday", sleep: "Sleep by 10:30 PM", diet: "Add 2 vegetables", activity: "20 min walk", mindfulness: "Gratitude journal" },
    { day: "Wednesday", sleep: "No screens after 9 PM", diet: "Protein breakfast", activity: "6000 steps", mindfulness: "Body scan" },
    { day: "Thursday", sleep: "8 hrs target", diet: "Meal prep lunch", activity: "Light stretching", mindfulness: "Nature break" },
    { day: "Friday", sleep: "Consistent wake time", diet: "Hydration focus", activity: "5000 steps", mindfulness: "Social connection" },
    { day: "Saturday", sleep: "7.5 hrs minimum", diet: "Cook healthy meal", activity: "30 min activity", mindfulness: "Hobby time" },
    { day: "Sunday", sleep: "Prep for week", diet: "Meal planning", activity: "Rest/light walk", mindfulness: "Week reflection" },
  ];
}

function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("sleep") || lower.includes("tired") || lower.includes("insomnia") || lower.includes("rest")) return "sleep";
  if (lower.includes("sugar") || lower.includes("sweet") || lower.includes("dessert") || lower.includes("carb")) return "sugar";
  if (lower.includes("exercise") || lower.includes("workout") || lower.includes("active") || lower.includes("gym") || lower.includes("walk")) return "exercise";
  if (lower.includes("stress") || lower.includes("anxious") || lower.includes("worried") || lower.includes("overwhelm")) return "stress";
  if (lower.includes("snack") || lower.includes("night") || lower.includes("hungry") || lower.includes("craving")) return "snacking";
  return "default";
}

export function HealthCoachChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hi! I'm your AI Health Coach. I can help you with personalized advice on sleep, nutrition, exercise, and stress management.\n\nBased on your profile, I notice some areas we could work on together. What would you like to focus on?",
      timestamp: new Date(),
      suggestions: ["Improve my sleep", "Reduce sugar intake", "Start exercising", "Manage stress better"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const intent = detectIntent(messageText);
    const response = coachResponses[intent] || coachResponses.default;

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.response,
      timestamp: new Date(),
      suggestions: response.suggestions,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const weeklyPlan = generateWeeklyPlan();

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full shadow-lg shadow-cyan-500/25 flex items-center justify-center text-white z-50 hover:scale-105 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <PerformanceAwareMotion
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-[#0a0f1a] border border-cyan-500/20 rounded-2xl shadow-2xl shadow-black/50 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Health Coach</h3>
                  <p className="text-cyan-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title="Weekly Plan"
                >
                  <Calendar className="w-5 h-5 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Weekly Plan Panel */}
            <AnimatePresence>
              {showWeeklyPlan && (
                <PerformanceAwareMotion
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-white/5 overflow-hidden"
                >
                  <div className="p-4 bg-slate-800/30">
                    <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      Your Weekly Health Plan
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {weeklyPlan.map((day) => (
                        <div
                          key={day.day}
                          className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg text-xs"
                        >
                          <span className="text-cyan-400 font-bold w-16">{day.day.slice(0, 3)}</span>
                          <span className="text-slate-400 flex-1 truncate" title={day.diet}>
                            {day.diet}
                          </span>
                          <span className="text-slate-500">{day.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PerformanceAwareMotion>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <PerformanceAwareMotion
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[280px] ${
                      message.role === "user"
                        ? "bg-cyan-500 text-white rounded-2xl rounded-tr-sm"
                        : "bg-slate-800/50 text-slate-200 rounded-2xl rounded-tl-sm border border-white/5"
                    } p-3`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSend(suggestion)}
                            className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/20 transition-colors flex items-center gap-1"
                          >
                            {suggestion}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </PerformanceAwareMotion>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <PerformanceAwareMotion
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl rounded-tl-sm p-3 border border-white/5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </PerformanceAwareMotion>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
              {[
                { icon: Moon, label: "Sleep", color: "text-purple-400" },
                { icon: Utensils, label: "Diet", color: "text-orange-400" },
                { icon: Activity, label: "Exercise", color: "text-green-400" },
                { icon: Heart, label: "Stress", color: "text-red-400" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(`Help me with ${action.label.toLowerCase()}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-full text-xs text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                >
                  <action.icon className={`w-3 h-3 ${action.color}`} />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask your health coach..."
                  className="flex-1 bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/30"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </PerformanceAwareMotion>
        )}
      </AnimatePresence>
    </>
  );
}
