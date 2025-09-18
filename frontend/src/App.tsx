import React, { useState, useEffect, Suspense, useCallback } from "react";
import { MessageCircle, BarChart2, Landmark, User } from "lucide-react";

import { ThemeRoot } from "./components/layout/ThemeRoot";
import { PhoneFrame } from "./components/layout/PhoneFrame";
import { ChatWidget } from "./components/ChatWidget";
import { Alerts } from "./components/Alerts";
import { useAuth, AuthProvider } from './auth/AuthContext';

// Lazy load Screens
const ChatScreen = React.lazy(() => import('./screens/ChatScreen').then(m => ({ default: m.ChatScreen })));
const DashboardScreen = React.lazy(() => import('./screens/DashboardScreen').then(m => ({ default: m.DashboardScreen })));
const FinanceScreen = React.lazy(() => import('./screens/FinanceScreen').then(m => ({ default: m.FinanceScreen })));
const MyInfoScreen = React.lazy(() => import('./screens/MyInfoScreen').then(m => ({ default: m.MyInfoScreen })));
const LoginScreen = React.lazy(() => import('./screens/LoginScreen').then(m => ({ default: m.LoginScreen })));

// Lazy load Detail Pages
const MetricsDetail = React.lazy(() => import('./MetricsDetail'));
const MarketingDetail = React.lazy(() => import('./MarketingDetail'));
const ReviewsDetail = React.lazy(() => import('./ReviewsDetail'));

type TabKey = "chat" | "dashboard" | "finance" | "profile";
type PageKey = "none" | "metrics" | "marketing" | "reviews";

const TabButton: React.FC<{ active: boolean; label: string; icon: React.ReactNode; onClick: () => void }> =
({ active, label, icon, onClick }) => (
  <button onClick={onClick} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0" }}>
    <div style={{ padding: 8, borderRadius: 12, background: active ? "var(--app-light-blue)" : "transparent", color: active ? "var(--app-primary)" : "var(--app-text-secondary)" }}>
      {icon}
    </div>
    <span style={{ fontSize: 11, color: active ? "var(--app-primary)" : "var(--app-text-secondary)" }}>{label}</span>
  </button>
);

const MainApp = () => {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState<TabKey>("chat"); // Default to chat tab after login
  const [page, setPage] = useState<PageKey>("none");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [pageOriginTab, setPageOriginTab] = useState<TabKey | null>(null);

  const closeOverlay = useCallback(() => {
    setPage("none");
    setSelectedBusinessId(null);
    if (pageOriginTab) {
      setTab(pageOriginTab);
    }
    setPageOriginTab(null);
  }, [pageOriginTab]);

  const openPage = useCallback(
    (nextPage: PageKey, businessId?: string) => {
      if (nextPage === "none") {
        closeOverlay();
        return;
      }

      if (nextPage === "reviews") {
        const resolvedBusinessId = businessId ?? currentUser?.business_id ?? null;
        if (!resolvedBusinessId) {
          console.warn("리뷰 상세 정보를 열 수 없습니다. businessId가 없습니다.");
          return;
        }
        setSelectedBusinessId(resolvedBusinessId);
      } else {
        setSelectedBusinessId(null);
      }

      setPageOriginTab(tab);
      setPage(nextPage);
    },
    [closeOverlay, currentUser?.business_id, tab]
  );

  const openReviewDetail = useCallback(
    (businessId?: string) => {
      const resolvedBusinessId = businessId ?? currentUser?.business_id ?? null;
      if (!resolvedBusinessId) {
        console.warn("리뷰 상세 페이지 이동에 필요한 businessId가 없습니다.");
        return;
      }
      setSelectedBusinessId(resolvedBusinessId);
      setPageOriginTab(tab);
      setPage("reviews");
    },
    [currentUser?.business_id, tab]
  );

  useEffect(() => {
    (window as any).__goTab = setTab;
    (window as any).__goPage = (p: PageKey, businessId?: string) => openPage(p, businessId);
    (window as any).__openReviewDetail = (businessId?: string) => openReviewDetail(businessId);
    (window as any).__backPage = () => closeOverlay();

    return () => {
      delete (window as any).__goTab;
      delete (window as any).__goPage;
      delete (window as any).__openReviewDetail;
      delete (window as any).__backPage;
    };
  }, [closeOverlay, openPage, openReviewDetail]);

  if (!currentUser) {
    return (
      <PhoneFrame title="로그인">
        <Suspense fallback={<div style={{ padding: 16 }}>로딩 중...</div>}>
          <LoginScreen />
        </Suspense>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame
      title={
        tab === "chat" ? "챗봇" : tab === "dashboard" ? "대시보드" : tab === "finance" ? "금융" : "내정보"
      }
      headerRight={<Alerts />}
    >
      <div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr 64px" }}>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <Suspense fallback={<div style={{padding: 16}}>로딩 중...</div>}>
            {tab === "chat" && <ChatScreen />}
            {tab === "dashboard" && <DashboardScreen />}
            {tab === "finance" && <FinanceScreen />}
            {tab === "profile" && <MyInfoScreen />}
          
            {page !== "none" && (
              <div style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 20 }}>
                {page === "metrics" && <MetricsDetail onBack={(window as any).__backPage} />}
                {page === "marketing" && <MarketingDetail onBack={(window as any).__backPage} />}
                {page === "reviews" && selectedBusinessId && (
                  <ReviewsDetail
                    onBack={(window as any).__backPage}
                    businessId={selectedBusinessId}
                  />
                )}
              </div>
            )}
          </Suspense>
        </div>
        <nav className="border-t" style={{ display: "flex", background: "var(--app-white)", borderColor: "#E6E9EE" }}>
            <TabButton active={tab === "chat"} label="챗봇" icon={<MessageCircle size={18} />} onClick={() => setTab("chat")} />
            <TabButton active={tab === "dashboard"} label="대시보드" icon={<BarChart2 size={18} />} onClick={() => setTab("dashboard")} />
            <TabButton active={tab === "finance"} label="금융" icon={<Landmark size={18} />} onClick={() => setTab("finance")} />
            <TabButton active={tab === "profile"} label="내정보" icon={<User size={18} />} onClick={() => setTab("profile")} />
        </nav>
      </div>
      <ChatWidget />
    </PhoneFrame>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeRoot>
        <MainApp />
      </ThemeRoot>
    </AuthProvider>
  );
}

export default App;
