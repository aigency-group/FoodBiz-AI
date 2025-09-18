
import React from 'react';
import { Alerts } from "../Alerts";

export const PhoneFrame: React.FC<{ children: React.ReactNode; title?: string; headerRight?: React.ReactNode }> = ({ children, title = "", headerRight }) => {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "var(--app-background)" }}
    >
      <div
        className="shadow-2xl border overflow-hidden relative"
        style={{
          width: 393,
          height: 852,
          background: "var(--app-white)",
          borderColor: "#E6E9EE",
          borderRadius: 28,
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* 노치 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 2,
            width: 112,
            height: 20,
            borderRadius: 10,
            background: "rgba(0,0,0,0.06)",
            zIndex: 0,
          }}
        />

        {/* 헤더 */}
        <header
          className="flex items-center justify-center border-b"
          style={{
            position: "relative",
            zIndex: 1,
            height: 48,
            fontWeight: 700,
            fontSize: "var(--fs-h2)",
            background: "var(--app-white)",
            borderColor: "#E6E9EE",
            padding: "0 16px",
          }}
        >
          <div style={{ flex: 1 }}></div>
          <div style={{ flex: 1, textAlign: "center" }}>{title}</div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>{headerRight}</div>
        </header>

        {/* 컨텐츠 */}
        <div style={{ height: "calc(100% - 48px)", overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
