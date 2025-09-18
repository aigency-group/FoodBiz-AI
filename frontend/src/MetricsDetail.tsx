// MetricsDetail.tsx
import React from "react";
import { ArrowLeft, TrendingUp, BarChart2 } from "lucide-react";

type Props = { onBack?: () => void };

const Section: React.FC<React.PropsWithChildren<{ title: string; icon?: React.ReactNode }>> = ({ title, icon, children }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      {icon}
      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Chip: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button style={{ padding: "8px 12px", borderRadius: 999, fontSize: 12, border: `1px solid ${active ? "#0055A0" : "rgba(0,0,0,0.08)"}`, background: active ? "#E6F0FA" : "#fff", color: active ? "#0055A0" : "#222" }}>
    {label}
  </button>
);

const MetricsDetail: React.FC<Props> = ({ onBack }) => {
  return (
    <div style={{ height: "100%", background: "#F0F2F5", display: "grid", gridTemplateRows: "48px 1fr" }}>
      {/* Header */}
      <header style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", background: "#fff", borderBottom: "1px solid #E6E9EE" }}>
        <button onClick={onBack} style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 10, background: "#F6F8FA", border: "1px solid #E6E9EE" }}>
          <ArrowLeft size={18} />
        </button>
        <strong>경영지표 상세</strong>
      </header>

      {/* Body */}
      <main style={{ overflowY: "auto", padding: 16, display: "grid", gap: 16 }}>
        <Section title="기간 선택" icon={<BarChart2 size={18} color="#0055A0" />}>
          <div style={{ display: "flex", gap: 8 }}>
            {["최근 7일", "최근 4주", "최근 6개월"].map((l, i) => (
              <Chip key={l} label={l} active={i === 1} />
            ))}
          </div>
        </Section>

        <Section title="매출·원가·순이익 추이" icon={<TrendingUp size={18} color="#0055A0" />}>
          <div style={{ height: 160, borderRadius: 12, border: "2px dashed #E6F0FA" }} />
          <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>업종 평균 대비 +8.4% (동종 50퍼센타일 상위)</p>
        </Section>

        <Section title="항목별 상세 지표">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "총매출", value: "58.4백만", delta: "+7.2%" },
              { label: "원가", value: "31.7백만", delta: "-2.1%" },
              { label: "순이익", value: "22.6백만", delta: "+5.4%" },
              { label: "원가율", value: "54%", delta: "-1.5pt" },
            ].map((k) => (
              <div key={k.label} style={{ padding: 12, borderRadius: 12, background: "#E6F0FA" }}>
                <div style={{ fontSize: 12, color: "#666" }}>{k.label}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{k.value}</div>
                <div style={{ fontSize: 12, color: k.delta.startsWith("+") ? "#28A745" : "#E02D2D" }}>{k.delta}</div>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
};

export default MetricsDetail;
