// MarketingDetail.tsx
import React from "react";
import { ArrowLeft, Megaphone, Gift, Bell, Instagram } from "lucide-react";

type Props = { onBack?: () => void };

const Row: React.FC<{ left: string; right: string }> = ({ left, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0F2F5" }}>
    <span style={{ color: "#666", fontSize: 13 }}>{left}</span>
    <strong>{right}</strong>
  </div>
);

const Card: React.FC<React.PropsWithChildren<{ title: string; icon?: React.ReactNode }>> = ({ title, icon, children }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      {icon}
      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
    </div>
    {children}
  </div>
);

const MarketingDetail: React.FC<Props> = ({ onBack }) => {
  return (
    <div style={{ height: "100%", background: "#F0F2F5", display: "grid", gridTemplateRows: "48px 1fr" }}>
      <header style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", background: "#fff", borderBottom: "1px solid #E6E9EE" }}>
        <button onClick={onBack} style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 10, background: "#F6F8FA", border: "1px solid #E6E9EE" }}>
          <ArrowLeft size={18} />
        </button>
        <strong>마케팅 상세</strong>
      </header>

      <main style={{ overflowY: "auto", padding: 16, display: "grid", gap: 16 }}>
        <Card title="채널 퍼포먼스" icon={<Megaphone size={18} color="#0055A0" />}>
          <div style={{ height: 140, borderRadius: 12, border: "2px dashed #E6F0FA" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
            <Row left="인스타 업로드" right="주 3회" />
            <Row left="배달앱 노출" right="상위 20%" />
            <Row left="쿠폰 전환율" right="7.8%" />
          </div>
        </Card>

        <Card title="추천 액션">
          <div style={{ display: "grid", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, background: "#E6F0FA", border: "1px solid rgba(0,0,0,0.06)" }}>
              <Gift size={16} /> 단골 대상 ‘주말 10%’ 쿠폰 발송
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, background: "#E6F0FA", border: "1px solid rgba(0,0,0,0.06)" }}>
              <Bell size={16} /> 점심 피크 알림톡 예약
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, background: "#E6F0FA", border: "1px solid rgba(0,0,0,0.06)" }}>
              <Instagram size={16} /> 신메뉴(녹차) 릴스 15초 가이드
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MarketingDetail;
