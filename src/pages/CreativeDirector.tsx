import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  Palette,
  Sparkles,
  Facebook,
  Instagram,
  Play,
  Globe,
  Save,
  Trash2,
  Wand2,
  Copy,
} from "lucide-react";

const typeColors: Record<string, string> = {
  ad_creative: "#8B5CF6",
  ad_copy: "#22D3EE",
  ugc_script: "#F59E0B",
  hook: "#10B981",
};

const typeLabels: Record<string, string> = {
  ad_creative: "Ad Creative",
  ad_copy: "Ad Copy",
  ugc_script: "UGC Script",
  hook: "Hook",
};

export default function CreativeDirector() {
  const [selectedType, setSelectedType] = useState<"ad_creative" | "ad_copy" | "ugc_script" | "hook">("ad_copy");
  const [tone, setTone] = useState("problem_solution");
  const [language, setLanguage] = useState("arabic");
  const [platform, setPlatform] = useState("facebook");
  const [generating, setGenerating] = useState(false);

  const { data: creativesList } = trpc.creative.list.useQuery({ type: selectedType, limit: 20 });
  const utils = trpc.useUtils();

  const generateCreative = trpc.creative.generate.useMutation({
    onMutate: () => setGenerating(true),
    onSettled: () => {
      setGenerating(false);
      utils.creative.list.invalidate();
    },
  });

  const saveCreative = trpc.creative.save.useMutation({
    onSuccess: () => utils.creative.list.invalidate(),
  });

  const handleGenerate = () => {
    generateCreative.mutate({
      productId: 1,
      type: selectedType,
      title: `Generated ${typeLabels[selectedType]}`,
      tone: tone as "urgent" | "lifestyle" | "problem_solution" | "social_proof" | "fomo",
      language: language as "arabic" | "english" | "mixed",
      platform: platform as "facebook" | "instagram" | "tiktok" | "universal",
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center">
          <Palette className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#E8EDF5]">Creative Director</h2>
          <p className="text-sm text-[#8B95A8]">AI-Powered Ad Creative Generation</p>
        </div>
      </div>

      {/* Creative Brief Panel */}
      <div className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744]">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="text-sm font-semibold text-[#E8EDF5]">Creative Brief</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-[#8B95A8] mb-1.5 block">Content Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1829] border border-[#1A2744] text-sm text-[#E8EDF5] focus:outline-none focus:border-[#8B5CF6]/50"
            >
              <option value="ad_copy">Ad Copy</option>
              <option value="ad_creative">Ad Creative</option>
              <option value="ugc_script">UGC Script</option>
              <option value="hook">Hook Ideas</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#8B95A8] mb-1.5 block">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1829] border border-[#1A2744] text-sm text-[#E8EDF5] focus:outline-none"
            >
              <option value="urgent">Urgent</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="problem_solution">Problem-Solution</option>
              <option value="social_proof">Social Proof</option>
              <option value="fomo">FOMO</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#8B95A8] mb-1.5 block">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1829] border border-[#1A2744] text-sm text-[#E8EDF5] focus:outline-none"
            >
              <option value="arabic">Arabic</option>
              <option value="english">English</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#8B95A8] mb-1.5 block">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0F1829] border border-[#1A2744] text-sm text-[#E8EDF5] focus:outline-none"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="universal">Universal</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#8B5CF6] text-[#050A14] text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? "Generating..." : "Generate Creative"}
        </button>
      </div>

      {/* Generated Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(creativesList || []).map((creative) => {
          const content = creative.content ? JSON.parse(creative.content as string) : {};
          return (
            <div
              key={creative.id}
              className="bg-[#0A1120] rounded-xl p-5 border border-[#1A2744] card-glow hover:card-glow-hover transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      color: typeColors[creative.type],
                      backgroundColor: `${typeColors[creative.type]}15`,
                    }}
                  >
                    {typeLabels[creative.type]}
                  </span>
                  <span className="text-xs text-[#8B95A8]">{creative.platform}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => saveCreative.mutate({ id: creative.id })}
                    className="p-1.5 rounded-lg hover:bg-white/[0.04] text-[#8B95A8] hover:text-[#10B981] transition-all"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-[#8B95A8] hover:text-[#EF4444] transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-[#E8EDF5] mb-3">{creative.title}</h4>

              {/* Content based on type */}
              {creative.type === "ad_copy" && content && (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#0F1829] border border-[#1A2744]">
                    <p className="text-xs text-[#8B95A8] mb-1">Headline</p>
                    <p className="text-sm text-[#E8EDF5] font-medium">{content.headline}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0F1829] border border-[#1A2744]">
                    <p className="text-xs text-[#8B95A8] mb-1">Body</p>
                    <p className="text-sm text-[#8B95A8]">{content.body}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/20">
                    <p className="text-xs text-[#8B5CF6] mb-1">CTA</p>
                    <p className="text-sm text-[#E8EDF5] font-medium">{content.cta}</p>
                  </div>
                </div>
              )}

              {creative.type === "ad_creative" && content && (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#0F1829]">
                    <p className="text-xs text-[#8B95A8]">Concept: {content.concept}</p>
                    <p className="text-xs text-[#8B95A8]">Visual: {content.visual}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#8B5CF6]/10 to-[#22D3EE]/10 border border-[#8B5CF6]/20 text-center">
                    <p className="text-lg font-bold text-[#E8EDF5]">{content.headline}</p>
                    <p className="text-sm text-[#22D3EE] mt-2">{content.cta}</p>
                  </div>
                </div>
              )}

              {creative.type === "ugc_script" && content && (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#0F1829]">
                    <p className="text-xs text-[#F59E0B] mb-1">Hook</p>
                    <p className="text-sm text-[#E8EDF5]">{content.hook}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0F1829] border border-[#1A2744]">
                    <p className="text-xs text-[#8B95A8] mb-1">Script</p>
                    <p className="text-sm text-[#8B95A8] leading-relaxed whitespace-pre-line">{content.script}</p>
                  </div>
                  {content.broll && (
                    <p className="text-xs text-[#8B95A8]">B-roll: {content.broll}</p>
                  )}
                </div>
              )}

              {creative.type === "hook" && content && (
                <div className="space-y-2">
                  {(content.hooks || []).map((hook: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-[#0F1829]">
                      <span className="text-xs text-[#10B981] font-bold">#{i + 1}</span>
                      <p className="text-sm text-[#E8EDF5] flex-1">{hook}</p>
                      <button className="p-1 hover:bg-white/[0.04] rounded text-[#8B95A8]">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#1A2744]">
                {creative.predictedCtr && (
                  <span className="text-xs text-[#22D3EE]">
                    Predicted CTR: {creative.predictedCtr}%
                  </span>
                )}
                {creative.engagementScore && (
                  <span className="text-xs text-[#8B5CF6]">
                    Engagement: {creative.engagementScore}/100
                  </span>
                )}
                <span className="text-xs text-[#8B95A8] capitalize">{creative.tone?.replace("_", "-")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
