import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  Target,
  DollarSign,
  CheckCircle,
  Truck,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Heart,
  Shield,
  Zap,
  Check,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function KPICard({
  title,
  value,
  target,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  target: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744] card-glow hover:card-glow-hover transition-all duration-250 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-xs text-[#8B95A8] uppercase tracking-wider font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-[#E8EDF5] font-mono-data">{value}</p>
      <p className="text-xs text-[#8B95A8] mt-1">Target: {target}</p>
    </div>
  );
}

function HealthGauge({ score, label }: { score: number; label: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1A2744"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[#E8EDF5] font-mono-data">{score}</span>
        </div>
      </div>
      <p className="text-xs text-[#8B95A8] mt-2">{label}</p>
    </div>
  );
}

export default function CeoAgent() {
  const { data: kpis } = trpc.ceo.getKPIs.useQuery();
  const { data: roasData } = trpc.ceo.getROASChart.useQuery({ days: 30 });
  const { data: recommendations } = trpc.ceo.getRecommendations.useQuery({ limit: 6 });
  const { data: healthScore } = trpc.ceo.getHealthScore.useQuery();
  const utils = trpc.useUtils();
  const updateRec = trpc.ceo.updateRecommendation.useMutation({
    onSuccess: () => utils.ceo.getRecommendations.invalidate(),
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#22D3EE]/15 flex items-center justify-center">
          <Target className="w-5 h-5 text-[#22D3EE]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#E8EDF5]">CEO Agent</h2>
          <p className="text-sm text-[#8B95A8]">Executive Intelligence & Strategic Oversight</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="ROAS" value={`${kpis?.roas || 3.2}x`} target="3.0x" icon={TrendingUp} color="#22D3EE" />
        <KPICard title="CPA" value={`EGP ${kpis?.cpa || 89}`} target="EGP 95" icon={DollarSign} color="#10B981" />
        <KPICard title="Confirmation Rate" value={`${kpis?.confirmationRate || 73.8}%`} target="75%" icon={CheckCircle} color="#F59E0B" />
        <KPICard title="Delivery Rate" value={`${kpis?.deliveryRate || 89.2}%`} target="90%" icon={Truck} color="#3B82F6" />
        <KPICard title="Profit Margin" value={`${kpis?.profitMargin || 18.5}%`} target="20%" icon={TrendingDown} color="#8B5CF6" />
        <KPICard title="Cash Flow" value={`EGP ${(kpis?.cashFlow || 42000).toLocaleString()}`} target="Positive" icon={DollarSign} color="#10B981" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ROAS & CPA Chart */}
        <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#22D3EE]" />
            <h3 className="text-sm font-semibold text-[#E8EDF5]">ROAS & CPA Over Time</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roasData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" />
                <XAxis dataKey="date" tick={{ fill: "#8B95A8", fontSize: 10 }} tickFormatter={(v: string) => v?.slice(8) || ""} stroke="#1A2744" />
                <YAxis yAxisId="left" tick={{ fill: "#8B95A8", fontSize: 10 }} stroke="#1A2744" />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8B95A8", fontSize: 10 }} stroke="#1A2744" />
                <Tooltip contentStyle={{ backgroundColor: "#0F1829", border: "1px solid #1A2744", borderRadius: "8px", color: "#E8EDF5", fontSize: "12px" }} />
                <Line yAxisId="left" type="monotone" dataKey="roas" stroke="#22D3EE" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="cpa" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#EF4444]" />
            <h3 className="text-sm font-semibold text-[#E8EDF5]">Business Health Score</h3>
          </div>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1A2744" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (healthScore?.overall || 82) / 100 * 314}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#E8EDF5] font-mono-data">{healthScore?.overall || 82}</span>
                <span className="text-xs text-[#8B95A8]">/ 100</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <HealthGauge score={healthScore?.revenue || 90} label="Revenue" />
            <HealthGauge score={healthScore?.operations || 78} label="Operations" />
            <HealthGauge score={healthScore?.marketing || 85} label="Marketing" />
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="text-sm font-semibold text-[#E8EDF5]">AI Strategic Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(recommendations || []).map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg bg-[#0F1829] border border-[#1A2744]/50 hover:border-[#22D3EE]/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-sm font-semibold text-[#E8EDF5] flex-1">{rec.title}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] flex-shrink-0">
                  {rec.confidence}% confidence
                </span>
              </div>
              <p className="text-xs text-[#8B95A8] mb-3 leading-relaxed">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#10B981]">{rec.impact}</span>
                <div className="flex gap-2">
                  {rec.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateRec.mutate({ id: rec.id, status: "accepted" })}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981] text-xs font-medium hover:bg-[#10B981]/20 transition-all"
                      >
                        <Check className="w-3 h-3" /> Accept
                      </button>
                      <button
                        onClick={() => updateRec.mutate({ id: rec.id, status: "rejected" })}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#EF4444]/10 text-[#EF4444] text-xs font-medium hover:bg-[#EF4444]/20 transition-all"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </>
                  )}
                  {rec.status === "accepted" && (
                    <span className="flex items-center gap-1 text-xs text-[#10B981]">
                      <Check className="w-3 h-3" /> Accepted
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
