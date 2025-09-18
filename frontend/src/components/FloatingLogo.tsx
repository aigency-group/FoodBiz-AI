import React from "react";

const circleStyle = (color: string) => ({
  width: 18,
  height: 18,
  borderRadius: "50%",
  background: color,
  boxShadow: `0 0 12px ${color}55`,
  border: "1px solid rgba(255,255,255,0.35)",
});

export const FloatingLogo: React.FC = () => {
  return (
    <div
      style={{
        width: 124,
        height: 124,
        borderRadius: 28,
        background: "linear-gradient(135deg, #FFD4B2, #F5E6DA)",
        padding: 12,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: 22,
          background: "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(229,231,235,0.25))",
          border: "1px solid rgba(229,231,235,0.7)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 20px 24px rgba(244,177,131,0.22)",
          backdropFilter: "blur(18px)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 22,
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, rgba(255,255,255,0.55), rgba(229,231,235,0.35))",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: "0 8px 20px rgba(255,107,107,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <span style={circleStyle("#FF4C4C")} />
          <span style={circleStyle("#FFB800")} />
          <span style={circleStyle("#4CAF50")} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              height: 3,
              width: 48,
              borderRadius: 999,
              background: "linear-gradient(90deg, rgba(255,107,107,0.7), rgba(255,180,128,0.7))",
              boxShadow: "0 0 12px rgba(255,141,141,0.6)",
            }}
          />
          <span
            style={{
              fontSize: 20,
              letterSpacing: 3,
              fontWeight: 800,
              color: "#FF6B6B",
              textTransform: "uppercase",
              fontFamily: "'Pretendard', 'Segoe UI', sans-serif",
              padding: "4px 10px",
              borderRadius: 12,
              background: "linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,107,107,0.12))",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            SIGNAL
          </span>
        </div>
      </div>
    </div>
  );
};
