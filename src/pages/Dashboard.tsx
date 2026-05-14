import { trpc } from "@/lib/trpc";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Truck,
  DollarSign,
  Zap,
  Activity,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  BarChart3,
  MapPin,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router";

function KPICard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}) {
  const isPositive = change.startsWith("+");
  return (
    <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744] card-glow hover:card-glow-hover transition-all duration-250 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            isPositive ? "text-[#10B981] bg-[#10B981]/10" : "text-[#EF4444] bg-[#EF4444]/10"
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <p className="text-xs text-[#8B95A8] uppercase tracking-wider font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-[#E8EDF5] font-mono-data">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: kpis } = trpc.dashboard.getKPIs.useQuery();
  const { data: revenueData } = trpc.dashboard.getRevenueChart.useQuery({ days: 30 });
  const { data: govData } = trpc.dashboard.getGovernorateBreakdown.useQuery();
  const { data: activities } = trpc.dashboard.getActivityFeed.useQuery({ limit: 10 });
  const { data: alerts } = trpc.dashboard.getAlerts.useQuery();
  const { data: agentStatus } = trpc.dashboard.getAgentStatus.useQuery();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#E8EDF5] tracking-tight">Command Center</h2>
          <p className="text-sm text-[#8B95A8] mt-1">
            All agents operational. {kpis?.totalOrders || 1247} shipments this month.
          </p>
        </div>
        <div className="flex gap-2">
          {["Today", "7 Days", "30 Days"].map((range) => (
            <button
              key={range}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                range === "30 Days"
                  ? "bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30"
                  : "bg-[#0A1120] text-[#8B95A8] border border-[#1A2744] hover:text-[#E8EDF5]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`EGP ${(kpis?.revenue || 847320).toLocaleString()}`}
          change="+12.4%"
          icon={DollarSign}
          color="#22D3EE"
        />
        <KPICard
          title="Confirmation Rate"
          value={`${kpis?.confirmationRate || 73.8}%`}
          change="+2.1%"
          icon={CheckCircle}
          color="#10B981"
        />
        <KPICard
          title="Delivery Rate"
          value={`${kpis?.deliveryRate || 89.2}%`}
          change="-0.5%"
          icon={Truck}
          color="#F59E0B"
        />
        <KPICard
          title="Active Campaigns"
          value={`${kpis?.activeCampaigns || 12}`}
          change={`${kpis?.activeCampaigns ? kpis.activeCampaigns - 9 : 3} need attention`}
          icon={Zap}
          color="#8B5CF6"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#22D3EE]" />
              <h3 className="text-sm font-semibold text-[#E8EDF5]">Revenue & Orders</h3>
            </div>
            <span className="text-xs text-[#8B95A8]">30 days</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData || []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8B95A8", fontSize: 10 }}
                  tickFormatter={(v: string) => v?.slice(8) || ""}
                  stroke="#1A2744"
                />
                <YAxis tick={{ fill: "#8B95A8", fontSize: 10 }} stroke="#1A2744" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F1829",
                    border: "1px solid #1A2744",
                    borderRadius: "8px",
                    color: "#E8EDF5",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Governorate Breakdown */}
        <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#10B981]" />
            <h3 className="text-sm font-semibold text-[#E8EDF5]">By Governorate</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(govData || []).slice(0, 10)}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2744" />
                <XAxis type="number" tick={{ fill: "#8B95A8", fontSize: 10 }} stroke="#1A2744" />
                <YAxis
                  dataKey="governorate"
                  type="category"
                  tick={{ fill: "#8B95A8", fontSize: 10 }}
                  stroke="#1A2744"
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F1829",
                    border: "1px solid #1A2744",
                    borderRadius: "8px",
                    color: "#E8EDF5",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="total" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Activity + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Activity Feed */}
        <div className="lg:col-span-3 bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[#22D3EE]" />
            <h3 className="text-sm font-semibold text-[#E8EDF5]">AI Activity Stream</h3>
          </div>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {(activities || []).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#0F1829] border border-[#1A2744]/50 hover:border-[#22D3EE]/20 transition-all"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    backgroundColor:
                      activity.type === "recommendation"
                        ? "#22D3EE"
                        : activity.type === "alert"
                        ? "#F59E0B"
                        : activity.type === "automation"
                        ? "#10B981"
                        : "#8B5CF6",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#8B95A8] mb-0.5">{activity.agentName}</p>
                  <p className="text-sm text-[#E8EDF5] leading-relaxed">{activity.action}</p>
                  {activity.impact && (
                    <span className="inline-block mt-1 text-xs font-medium text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-full">
                      {activity.impact}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    activity.status === "completed"
                      ? "text-[#10B981] bg-[#10B981]/10"
                      : activity.status === "accepted"
                      ? "text-[#3B82F6] bg-[#3B82F6]/10"
                      : "text-[#F59E0B] bg-[#F59E0B]/10"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + Agent Status */}
        <div className="lg:col-span-2 space-y-4">
          {/* Priority Alerts */}
          <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-sm font-semibold text-[#E8EDF5]">Priority Alerts</h3>
            </div>
            <div className="space-y-3">
              {(alerts || []).slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/20"
                >
                  <p className="text-sm text-[#E8EDF5] leading-relaxed">{alert.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#F59E0B] font-medium">{alert.impact}</span>
                    <Link
                      to={`/${alert.agentName.toLowerCase().split(" ")[0] === "ceo" ? "ceo" : alert.agentName.toLowerCase().split(" ")[0] === "product" ? "products" : alert.agentName.toLowerCase().split(" ")[0] === "creative" ? "creative" : alert.agentName.toLowerCase().split(" ")[0] === "landing" ? "landing" : alert.agentName.toLowerCase().split(" ")[0] === "confirmation" ? "orders" : alert.agentName.toLowerCase().split(" ")[0] === "shipping" ? "shipping" : alert.agentName.toLowerCase().split(" ")[0] === "finance" ? "finance" : "team"}`}
                      className="flex items-center gap-1 text-xs text-[#22D3EE] hover:underline"
                    >
                      Investigate <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Status */}
          <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-semibold text-[#E8EDF5]">Agent Status</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(agentStatus || []).map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#0F1829]"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      agent.status === "operational" ? "bg-[#10B981]" : "bg-[#F59E0B] animate-pulse"
                    }`}
                  />
                  <span className="text-xs text-[#8B95A8] truncate">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
