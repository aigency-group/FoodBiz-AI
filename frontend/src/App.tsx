import React, { useState, useEffect, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
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
  <button 
    onClick={onClick} 
    style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      padding: "8px 12px",
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
  >
    <div 
      style={{ 
        width: 32,
        height: 32,
        borderRadius: active ? '50%' : '8px',
        background: active ? 'rgba(0,122,255,0.1)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: active ? '#007AFF' : '#8E8E93'
      }}
    >
      {icon}
    </div>
    <span 
      style={{ 
        fontSize: 12, 
        fontWeight: active ? 600 : 500,
        color: active ? '#000000' : '#8E8E93',
        marginTop: 4,
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </span>
  </button>
);

// ReviewsDetail 래퍼 컴포넌트 (URL 파라미터에서 businessId 추출)
const ReviewsDetailWrapper: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  return (
    <ReviewsDetail
      onBack={() => navigate(-1)}
      businessId={businessId || ""}
    />
  );
};

const MainApp = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<TabKey>("chat"); // Default to chat tab after login
  const [page, setPage] = useState<PageKey>("none");
  const [, setSelectedBusinessId] = useState<string | null>(null);

  const goTab = useCallback((nextTab: TabKey) => {
    setTab(nextTab);
    const path =
      nextTab === "chat"
        ? "/chat"
        : nextTab === "dashboard"
        ? "/dashboard"
        : nextTab === "finance"
        ? "/finance"
        : "/profile";
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    // 전역 함수들을 React Router 네비게이션으로 브리지
    (window as any).__goTab = goTab;
    (window as any).__goPage = (p: PageKey, businessId?: string) => {
      if (p === "reviews") {
        const targetBusinessId = businessId || currentUser?.business_id;
        if (targetBusinessId) {
          navigate(`/reviews/${targetBusinessId}`);
        } else {
          navigate('/reviews');
        }
      } else {
        setPage(p);
      }
    };
    (window as any).__openReviewDetail = (businessId: string) => {
      navigate(`/reviews/${businessId}`);
    };
    (window as any).__backPage = () => {
      setPage("none");
      setSelectedBusinessId(null);
      navigate(-1); // 브라우저 히스토리에서 뒤로 가기
    };
  }, [currentUser?.business_id, goTab, navigate]);

  useEffect(() => {
    const path = location.pathname;
    let nextTab: TabKey | null = null;
    if (path === "/" || path.startsWith("/chat")) {
      nextTab = "chat";
    } else if (path.startsWith("/dashboard")) {
      nextTab = "dashboard";
    } else if (path.startsWith("/finance")) {
      nextTab = "finance";
    } else if (path.startsWith("/profile")) {
      nextTab = "profile";
    }

    if (nextTab && nextTab !== tab) {
      setTab(nextTab);
    }
  }, [location.pathname, tab]);

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
            <Routes>
              {/* 메인 탭 라우트들 */}
              <Route path="/" element={
                tab === "chat" ? <ChatScreen /> :
                tab === "dashboard" ? <DashboardScreen /> :
                tab === "finance" ? <FinanceScreen /> :
                <MyInfoScreen />
              } />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/finance" element={<FinanceScreen />} />
              <Route path="/profile" element={<MyInfoScreen />} />
              
              {/* 상세 페이지 라우트들 */}
              <Route path="/metrics" element={<MetricsDetail onBack={() => navigate(-1)} />} />
              <Route path="/marketing" element={<MarketingDetail onBack={() => navigate(-1)} />} />
              <Route path="/reviews" element={<ReviewsDetail onBack={() => navigate(-1)} businessId={currentUser?.business_id || ""} />} />
              <Route path="/reviews/:businessId" element={<ReviewsDetailWrapper />} />
            </Routes>
            
            {/* 기존 오버레이 방식 (metrics, marketing만) */}
            {page !== "none" && page !== "reviews" && (
              <div style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 20 }}>
                {page === "metrics" && <MetricsDetail onBack={(window as any).__backPage} />}
                {page === "marketing" && <MarketingDetail onBack={(window as any).__backPage} />}
              </div>
            )}
          </Suspense>
        </div>
        <nav 
          style={{ 
            display: "flex", 
            background: "#FFFFFF", 
            borderTop: "1px solid rgba(0,0,0,0.1)",
            padding: "12px 0 20px",
            borderRadius: "16px 16px 0 0",
            margin: "0 16px",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.05)"
          }}
        >
            <TabButton active={tab === "chat"} label="챗봇" icon={<MessageCircle size={18} />} onClick={() => goTab("chat")} />
            <TabButton active={tab === "dashboard"} label="대시보드" icon={<BarChart2 size={18} />} onClick={() => goTab("dashboard")} />
            <TabButton active={tab === "finance"} label="금융" icon={<Landmark size={18} />} onClick={() => goTab("finance")} />
            <TabButton active={tab === "profile"} label="내정보" icon={<User size={18} />} onClick={() => goTab("profile")} />
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
        <Router>
          <MainApp />
        </Router>
      </ThemeRoot>
    </AuthProvider>
  );
}

export default App;
