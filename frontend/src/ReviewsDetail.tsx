import React from "react";
import {
  ArrowLeft,
  PieChart as PieIcon,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import { useReviews } from "./hooks/useReviews";
import { useReviewDetail } from "./hooks/useReviewDetail";

const COLORS = ["#2EAE4F", "#1D4ED8", "#F59E0B", "#9CA3AF"];

const Pill: React.FC<{ tone: "positive" | "negative"; label: string }> = ({ tone, label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 12,
      background: tone === "positive" ? "rgba(46,174,79,0.14)" : "rgba(217,45,32,0.12)",
      color: tone === "positive" ? "#2EAE4F" : "#D92D20",
    }}
  >
    {tone === "positive" ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
    {label}
  </span>
);

type Props = {
  onBack?: () => void;
  businessId: string;
};

export const ReviewsDetail: React.FC<Props> = ({ onBack, businessId }) => {
  const { summary } = useReviews(businessId);
  const { allReviews, sources, keywords } = useReviewDetail(businessId);

  const sourceData = sources.map((item, index) => ({
    name: item.source,
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div
      style={{
        height: "100%",
        background: "#F0F4F8",
        display: "grid",
        gridTemplateRows: "56px 1fr",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          background: "#fff",
          borderBottom: "1px solid #E6E9EE",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#F6F8FA",
            border: "1px solid #E6E9EE",
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <strong>리뷰 데이터 상세</strong>
          {summary && (
            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              최근 리뷰 {summary.review_count}건 · 평균 평점 {summary.average_rating.toFixed(2)}점
            </p>
          )}
        </div>
      </header>

      <main
        style={{
          overflowY: "auto",
          padding: 16,
          display: "grid",
          gap: 16,
          alignContent: "start",
        }}
      >
        <section
          style={{
            background: "linear-gradient(135deg, rgba(0,118,208,0.1), rgba(46,174,79,0.08))",
            borderRadius: 20,
            padding: 20,
            display: "grid",
            gap: 16,
            boxShadow: "0 12px 36px rgba(15,23,42,0.12)",
          }}
        >
          {summary ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Star size={20} color="#F59E0B" />
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>최근 30일 리뷰 스냅샷</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: 16 }}>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>평균 평점</p>
                  <p style={{ fontSize: 28, fontWeight: 700 }}>{summary.average_rating.toFixed(2)}</p>
                  <span style={{ fontSize: 12, color: "#2563EB" }}>긍정 {summary.positive_count}건</span>
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: 16 }}>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>중립 리뷰</p>
                  <p style={{ fontSize: 28, fontWeight: 700 }}>{summary.neutral_count}</p>
                  <span style={{ fontSize: 12, color: "#F59E0B" }}>키워드 확인</span>
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: 16 }}>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>부정 리뷰</p>
                  <p style={{ fontSize: 28, fontWeight: 700 }}>{summary.negative_count}</p>
                  <span style={{ fontSize: 12, color: "#D92D20" }}>즉각 대응 필요</span>
                </div>
              </div>
            </div>
          ) : (
            <p>리뷰 데이터를 불러오는 중입니다...</p>
          )}
        </section>

        <section
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            display: "grid",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PieIcon size={18} color="#2563EB" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>채널별 리뷰 분포</h3>
          </div>
          {sourceData.length ? (
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ flex: 1, minHeight: 180 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie dataKey="value" data={sourceData} innerRadius={50} outerRadius={70}>
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ReTooltip formatter={(value: any) => `${value}건`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {sourceData.map((entry) => (
                  <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: entry.fill }} />
                    <span>{entry.name}</span>
                    <span style={{ marginLeft: "auto", fontWeight: 600 }}>{entry.value}건</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#94A3B8" }}>채널별 데이터가 아직 수집되지 않았습니다.</p>
          )}
        </section>

        <section
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            display: "grid",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MessageSquare size={18} color="#2563EB" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>핵심 키워드</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {keywords.positive.slice(0, 6).map((word) => (
              <Pill key={`pos-${word}`} tone="positive" label={word} />
            ))}
            {keywords.negative.slice(0, 6).map((word) => (
              <Pill key={`neg-${word}`} tone="negative" label={word} />
            ))}
            {!keywords.positive.length && !keywords.negative.length && (
              <span style={{ fontSize: 12, color: "#94A3B8" }}>분석할 키워드가 충분하지 않습니다.</span>
            )}
          </div>
        </section>

        <section
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            display: "grid",
            gap: 12,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>리뷰 타임라인</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {allReviews.slice(0, 30).map((review, index) => (
              <div
                key={index}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "#F6F8FA",
                  border: "1px solid rgba(15,23,42,0.08)",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: review.rating >= 4 ? "#2EAE4F" : review.rating <= 2 ? "#D92D20" : "#475467", fontWeight: 600 }}>
                    ★ {review.rating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{new Date(review.reviewed_at).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: 13, color: "#344054", lineHeight: 1.5 }}>{review.content}</p>
                <span style={{ fontSize: 11, color: "#2563EB" }}>{review.source}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReviewsDetail;
