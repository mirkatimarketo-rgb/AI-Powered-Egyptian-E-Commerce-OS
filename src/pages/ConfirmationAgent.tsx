import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  Shield,
  Phone,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "#22D3EE" },
  whatsapp_sent: { label: "WhatsApp Sent", color: "#3B82F6" },
  responded: { label: "Responded", color: "#F59E0B" },
  confirmed: { label: "Confirmed", color: "#10B981" },
  voice_confirmed: { label: "Voice Confirmed", color: "#10B981" },
  shipped: { label: "Shipped", color: "#8B5CF6" },
  delivered: { label: "Delivered", color: "#10B981" },
  returned: { label: "Returned", color: "#EF4444" },
  cancelled: { label: "Cancelled", color: "#5A6680" },
};

export default function ConfirmationAgent() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data: pipeline } = trpc.order.getPipeline.useQuery();
  const { data: ordersData } = trpc.order.list.useQuery({
    status: statusFilter || undefined,
    search: search || undefined,
    limit: 20,
    offset: page * 20,
  });
  const { data: stats } = trpc.order.getStats.useQuery();
  const { data: templates } = trpc.order.getTemplates.useQuery();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#E8EDF5]">Confirmation & Customer</h2>
          <p className="text-sm text-[#8B95A8]">AI-Powered Order Confirmation & Customer Follow-up</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: stats?.totalOrders || 1247, color: "#22D3EE", icon: MessageSquare },
          { label: "Fake Orders", value: stats?.fakeOrders || 20, color: "#EF4444", icon: AlertTriangle },
          { label: "Avg Risk Score", value: stats?.avgRiskScore || 42, color: "#F59E0B", icon: Shield, suffix: "/100" },
          { label: "Confirmation Rate", value: "73.8%", color: "#10B981", icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0A1120] rounded-xl p-4 border border-[#1A2744]">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <span className="text-xs text-[#8B95A8]">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-[#E8EDF5] font-mono-data">
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              {stat.suffix || ""}
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-sm font-semibold text-[#E8EDF5]">Order Pipeline</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(pipeline || []).map((stage, i) => {
            const nextStage = pipeline?.[i + 1];
            const conversion = nextStage && stage.count > 0
              ? Math.round((nextStage.count / stage.count) * 100)
              : null;

            return (
              <div key={stage.stage} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className="px-3 py-2 rounded-lg text-center min-w-[80px]"
                    style={{
                      backgroundColor: `${statusConfig[stage.stage]?.color || "#8B95A8"}15`,
                      border: `1px solid ${statusConfig[stage.stage]?.color || "#8B95A8"}30`,
                    }}
                  >
                    <p className="text-lg font-bold font-mono-data" style={{ color: statusConfig[stage.stage]?.color }}>
                      {stage.count}
                    </p>
                    <p className="text-xs text-[#8B95A8]">{stage.label}</p>
                  </div>
                  {conversion !== null && (
                    <span className="text-xs text-[#10B981] mt-1">{conversion}%</span>
                  )}
                </div>
                {i < (pipeline || []).length - 1 && (
                  <div className="w-6 h-px bg-[#1A2744]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders Table + Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Orders */}
        <div className="lg:col-span-3 bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold text-[#E8EDF5]">Orders</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0F1829] border border-[#1A2744] text-sm text-[#E8EDF5] placeholder-[#5A6680]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0F1829] border border-[#1A2744] text-sm text-[#E8EDF5]"
              >
                <option value="">All</option>
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A2744]">
                  <th className="text-left py-2 px-3 text-xs text-[#8B95A8]">Order</th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B95A8]">Customer</th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B95A8]">Gov</th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B95A8]">Amount</th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B95A8]">Status</th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B95A8]">Risk</th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B95A8]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(ordersData?.items || []).map((order) => (
                  <tr key={order.id} className="border-b border-[#1A2744]/50 hover:bg-[#0F1829]">
                    <td className="py-2 px-3 text-[#E8EDF5] font-mono-data text-xs">{order.orderNumber}</td>
                    <td className="py-2 px-3">
                      <p className="text-[#E8EDF5] text-xs">{order.customerName}</p>
                      <p className="text-[#5A6680] text-xs">{order.customerPhone}</p>
                    </td>
                    <td className="py-2 px-3 text-[#8B95A8] text-xs">{order.governorate}</td>
                    <td className="py-2 px-3 text-[#E8EDF5] font-mono-data text-xs">EGP {order.totalAmount}</td>
                    <td className="py-2 px-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          color: statusConfig[order.status || "new"]?.color,
                          backgroundColor: `${statusConfig[order.status || "new"]?.color}15`,
                        }}
                      >
                        {statusConfig[order.status || "new"]?.label}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[#1A2744]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${order.riskScore || 0}%`,
                              backgroundColor:
                                (order.riskScore || 0) > 70 ? "#EF4444" : (order.riskScore || 0) > 40 ? "#F59E0B" : "#10B981",
                            }}
                          />
                        </div>
                        <span className="text-xs text-[#8B95A8] font-mono-data">{order.riskScore}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-1">
                        <button className="p-1 rounded hover:bg-[#3B82F6]/10 text-[#3B82F6]" title="Send WhatsApp">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#10B981]/10 text-[#10B981]" title="Voice Confirm">
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#EF4444]/10 text-[#EF4444]" title="Flag Fake">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg bg-[#0F1829] text-[#8B95A8] text-xs disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-[#8B95A8]">Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 rounded-lg bg-[#0F1829] text-[#8B95A8] text-xs"
            >
              Next
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-[#3B82F6]" />
            <h3 className="text-sm font-semibold text-[#E8EDF5]">Message Templates</h3>
          </div>
          <div className="space-y-3">
            {(templates || []).map((tmpl) => (
              <div key={tmpl.id} className="p-3 rounded-lg bg-[#0F1829] border border-[#1A2744]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#E8EDF5]">{tmpl.name}</span>
                  <span className="text-xs text-[#8B95A8] capitalize">{tmpl.type}</span>
                </div>
                <p className="text-xs text-[#8B95A8] line-clamp-3">{tmpl.content}</p>
              </div>
            ))}
          </div>

          {/* Fake Order Detection */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#EF4444]" />
              <h3 className="text-sm font-semibold text-[#E8EDF5]">Fake Detection</h3>
            </div>
            <div className="p-4 rounded-lg bg-[#EF4444]/5 border border-[#EF4444]/20">
              <p className="text-2xl font-bold text-[#EF4444] font-mono-data">{stats?.fakeOrders || 20}</p>
              <p className="text-xs text-[#8B95A8]">orders flagged today</p>
              <p className="text-xs text-[#10B981] mt-2">96.2% accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
