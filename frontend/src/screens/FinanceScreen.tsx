import React, { useState } from 'react';
import {
  Landmark,
  PiggyBank,
  Wallet,
  LineChart,
  ShieldCheck,
  Sparkles,
  ArrowRightCircle,
  ClipboardList,
  TimerReset,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { usePolicyData } from '../hooks/usePolicy';

const palette = {
  primary: '#1E4F9E',
  sky: '#6FADE8',
  teal: '#2AA5A0',
  lilac: '#B4C9FF',
  ice: '#E7F2FF',
  text: '#123B70',
  subtext: '#42526E',
};

const tabs = [
  { id: 'Signal', label: 'Signal', icon: Sparkles },
  { id: 'policy', label: '정책자금', icon: Landmark },
  { id: 'loan', label: '대출', icon: Building2 },
  { id: 'savings', label: '예·적금', icon: PiggyBank },
  { id: 'card', label: '카드', icon: CreditCard },
];

const financeProducts = {
  policy: [
    {
      name: '신용보증기금 정책자금',
      limit: '최대 3억원',
      rate: '연 2.2% ~ 3.5%',
      term: '최장 7년',
      features: ['서울보증보험증권 발급 가능', '대출 실행 수수료 면제', '정부 보증 기반 안정성'],
      icon: ShieldCheck,
      accent: 'linear-gradient(135deg, rgba(0,85,160,0.12), rgba(0,85,160,0.03))',
    },
    {
      name: '중소벤처기업부 정책자금',
      limit: '최대 1억원',
      rate: '연 1.8% 고정',
      term: '최장 5년',
      features: ['창업 7년 이내 소상공인', '정책자금 온라인 시스템 등록', '우대금리 적용'],
      icon: Landmark,
      accent: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
    },
    {
      name: '지자체 정책자금',
      limit: '최대 5천만원',
      rate: '연 1.0%',
      term: '최장 4년',
      features: ['관내 사업 영위 6개월 이상', '지방세 체납 없음', '지자체 이자 보전'],
      icon: Landmark,
      accent: 'linear-gradient(135deg, rgba(42,165,160,0.12), rgba(42,165,160,0.04))',
    },
    {
      name: '소상공인 정책자금',
      limit: '최대 7천만원',
      rate: '연 2.5% ~ 4.0%',
      term: '최장 6년',
      features: ['중소벤처기업부', '신용보증기금 연계', '다양한 용도 지원'],
      icon: ShieldCheck,
      accent: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
    },
    {
      name: 'K-뉴딜 정책자금',
      limit: '최대 2억원',
      rate: '연 1.5% ~ 2.8%',
      term: '최장 8년',
      features: ['디지털 전환 지원', '친환경 사업 우대', 'K-뉴딜 정책 연계'],
      icon: Sparkles,
      accent: 'linear-gradient(135deg, rgba(245,164,90,0.12), rgba(245,164,90,0.04))',
    },
  ],
  loan: [
    {
      name: '우리 사잇돌 중금리대출',
      limit: '최대 2천만원',
      rate: '연 6.0% ~ 9.0%',
      term: '최장 5년',
      features: ['서울보증보험증권 발급 가능', '대출 실행 수수료 면제', '중금리 대출'],
      icon: ShieldCheck,
      accent: 'linear-gradient(135deg, rgba(0,85,160,0.12), rgba(0,85,160,0.03))',
    },
    {
      name: '위비 SOHO 모바일 신용대출',
      limit: '최대 3천만원',
      rate: '연 5.5% ~ 8.5%',
      term: '최장 5년',
      features: ['비씨가맹점 1년 이상', '모바일 간편 실행', '비대면 전용'],
      icon: Building2,
      accent: 'linear-gradient(135deg, rgba(12,138,226,0.12), rgba(12,138,226,0.04))',
    },
    {
      name: '우리은행 특별 대출상품',
      limit: '업종별 맞춤 한도',
      rate: '연 4.8% ~ 6.2%',
      term: '최장 6년',
      features: ['소상공인 전용', '이자 지원 프로모션', '업종별 맞춤'],
      icon: Building2,
      accent: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
    },
    {
      name: '음식점업 대출',
      limit: '최대 6천만원',
      rate: '연 4.2% ~ 6.0%',
      term: '최장 5년',
      features: ['배달/홀 매출 월 800만원 이상', '위생등급 양호', '업종별 특화'],
      icon: Building2,
      accent: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
    },
    {
      name: '소매업 대출',
      limit: '최대 5천만원',
      rate: '연 4.5% ~ 6.8%',
      term: '최장 4년',
      features: ['온·오프라인 합산 월 매출 600만원 이상', '재고회전율 6회 이상', '소매업 특화'],
      icon: Building2,
      accent: 'linear-gradient(135deg, rgba(42,165,160,0.12), rgba(42,165,160,0.04))',
    },
  ],
  savings: [
    {
      name: '우리 사장님 플러스 적금',
      limit: '월 최대 200만원',
      rate: '연 3.8% ~ 4.5%',
      term: '6/12/24개월',
      features: ['매출 연동 자동 증액 기능', 'SNS 프로모션 실적 연계 우대금리', '휴일 자동이체 지원'],
      icon: PiggyBank,
      accent: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
    },
    {
      name: '우리 프라임 정기예금',
      limit: '최대 3억원',
      rate: '연 3.2% ~ 3.9%',
      term: '1/3/6/12개월',
      features: ['만기 자동 재예치/분할 지급', '우리 WON+ 전용 특판 금리', '거치 중 중도해지 우대율 적용'],
      icon: PiggyBank,
      accent: 'linear-gradient(135deg, rgba(0,85,160,0.12), rgba(0,85,160,0.03))',
    },
    {
      name: '우리 사장님 통장',
      limit: '최대 1억원',
      rate: '평균 연 1.8% 우대',
      term: '자유입출금',
      features: ['매출·원가 태깅 후 순이익 그래프 제공', '우리 WON 알림으로 입금 즉시 알려드림', 'API 연동으로 회계프로그램 자동 조회'],
      icon: Wallet,
      accent: 'linear-gradient(135deg, rgba(180,201,255,0.25), rgba(231,242,255,0.85))',
    },
    {
      name: '소상공인 전용 적금',
      limit: '월 100만원',
      rate: '연 3.5% ~ 4.2%',
      term: '12/24/36개월',
      features: ['우대금리', '자동이체', '소상공인 전용'],
      icon: PiggyBank,
      accent: 'linear-gradient(135deg, rgba(12,138,226,0.12), rgba(12,138,226,0.04))',
    },
    {
      name: '정기예금 특별상품',
      limit: '최대 1억원',
      rate: '연 3.0% ~ 3.7%',
      term: '3/6/12개월',
      features: ['고금리', '안정성', '단기 운용'],
      icon: LineChart,
      accent: 'linear-gradient(135deg, rgba(42,165,160,0.18), rgba(195,233,231,0.75))',
    },
  ],
  card: [
    {
      name: '소상공인 전용 카드',
      limit: '월 한도 500만원',
      rate: '연 15.9%',
      term: '무이자 할부 2~6개월',
      features: ['현금서비스', '할인혜택', '소상공인 전용'],
      icon: CreditCard,
      accent: 'linear-gradient(135deg, rgba(12,138,226,0.12), rgba(12,138,226,0.04))',
    },
    {
      name: '비즈니스 체크카드',
      limit: '일 한도 1천만원',
      rate: '수수료 면제',
      term: '사업용 전용',
      features: ['사업용', '수수료 면제', '비즈니스 전용'],
      icon: CreditCard,
      accent: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
    },
    {
      name: '우리 WON+ 카드',
      limit: '월 한도 300만원',
      rate: '연 16.9%',
      term: '무이자 할부 2~5개월',
      features: ['WON+ 앱 연동', '스마트 혜택', '무이자 할부'],
      icon: CreditCard,
      accent: 'linear-gradient(135deg, rgba(0,85,160,0.12), rgba(0,85,160,0.03))',
    },
    {
      name: '위비 SOHO 카드',
      limit: '월 한도 200만원',
      rate: '연 17.9%',
      term: '무이자 할부 2~3개월',
      features: ['SOHO 전용', '사업용 지출 최적화', '간편 결제'],
      icon: CreditCard,
      accent: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
    },
    {
      name: '우리 프리미엄 카드',
      limit: '월 한도 1천만원',
      rate: '연 15.9%',
      term: '무이자 할부 2~12개월',
      features: ['프리미엄 혜택', '높은 한도', '긴 무이자 할부'],
      icon: CreditCard,
      accent: 'linear-gradient(135deg, rgba(245,164,90,0.12), rgba(245,164,90,0.04))',
    },
  ],
};

const heroInsights = [
  {
    title: '유동성 버퍼',
    metric: '운영자금 D+1',
    description: '우리은행 위비 WON과 연동해 심사 완료 즉시 실행',
  },
  {
    title: '금리 혜택',
    metric: '최저 연 1.8%',
    description: '보증·정책 연계 금리 자동 비교',
  },
  {
    title: 'SIGNAL 케어',
    metric: '서류 자동작성',
    description: '필수 제출 서류를 계정별로 채워주는 LLM 워크플로',
  },
];

const curatedFinanceProducts = [
  {
    category: '대출',
    icon: Landmark,
    accent: 'linear-gradient(135deg, rgba(30,79,158,0.16), rgba(111,173,232,0.7))',
    tone: palette.primary,
    headline: '운영비, 시설자금까지 한 번에 조달',
    description: 'POS 매출과 카드 매입 데이터를 연결해 업종 평균 대비 과부족을 즉시 알려드립니다.',
    products: [
      {
        name: '우리 소상공인 희망대출',
        limit: '최대 8천만원',
        rate: '연 4.2% ~ 6.0%',
        term: '최장 5년',
        signal: '주황 → 초록 전환 목표',
        features: ['서울신용보증재단·신보 보증 연계', '카드 매출 기반 자동 한도 산정', '중도상환 수수료 면제 구간 운영'],
      },
      {
        name: '위비 SOHO 빠른대출',
        limit: '최대 5천만원',
        rate: '연 5.1% ~ 7.9%',
        term: '최장 5년',
        signal: '당일 실행',
        features: ['모바일 간편 서류 제출', '최근 3개월 매출 기반 즉시 한도', 'AI 심사 완료 알림 제공'],
      },
    ],
  },
  {
    category: '적금',
    icon: PiggyBank,
    accent: 'linear-gradient(135deg, rgba(111,173,232,0.18), rgba(231,242,255,0.88))',
    tone: palette.sky,
    headline: '매출 비수기 대비 목돈 만들기',
    description: '주요 성수기 이후 적립 강도를 높여주는 SIGNAL 자동 납입 플랜을 제공합니다.',
    products: [
      {
        name: '우리 사장님 플러스 적금',
        limit: '월 최대 200만원',
        rate: '연 3.8% ~ 4.5%',
        term: '6/12/24개월',
        signal: '초록 유지',
        features: ['매출 연동 자동 증액 기능', 'SNS 프로모션 실적 연계 우대금리', '휴일 자동이체 지원'],
      },
    ],
  },
  {
    category: '예금',
    icon: LineChart,
    accent: 'linear-gradient(135deg, rgba(42,165,160,0.18), rgba(195,233,231,0.75))',
    tone: palette.teal,
    headline: '단기 자금 운용에 적합한 정기예금',
    description: '납품 결제 대비 일정 금액을 안전하게 예치해 이자 수익을 확보하세요.',
    products: [
      {
        name: '우리 프라임 정기예금',
        limit: '최대 3억원',
        rate: '연 3.2% ~ 3.9%',
        term: '1/3/6/12개월',
        signal: '안정 장치',
        features: ['만기 자동 재예치/분할 지급', '우리 WON+ 전용 특판 금리', '거치 중 중도해지 우대율 적용'],
      },
    ],
  },
  {
    category: '자유입출금통장',
    icon: Wallet,
    accent: 'linear-gradient(135deg, rgba(180,201,255,0.25), rgba(231,242,255,0.85))',
    tone: palette.lilac,
    headline: '세무/원가 분리를 위한 전용 계좌',
    description: '매입/매출 흐름을 자동 태깅하고, 부가세·인건비를 안전하게 분리 보관합니다.',
    products: [
      {
        name: '우리 사장님 통장',
        limit: '일 거래 1억원',
        rate: '평균 연 1.8% 우대',
        term: '자유입출금',
        signal: '실시간 캐시플로우',
        features: ['매출·원가 태깅 후 순이익 그래프 제공', '우리 WON 알림으로 입금 즉시 알려드림', 'API 연동으로 회계프로그램 자동 조회'],
      },
    ],
  },
];

const signalStatus = {
  진행중: { color: palette.primary, background: 'rgba(30,79,158,0.12)' },
  승인: { color: palette.teal, background: 'rgba(42,165,160,0.14)' },
  보류: { color: '#F5A45A', background: 'rgba(245,164,90,0.16)' },
  거절: { color: '#C63A3A', background: 'rgba(198,58,58,0.16)' },
  마감: { color: '#64748B', background: 'rgba(100,116,139,0.16)' },
};

const FinanceScreenComponent: React.FC = () => {
  const { recommendations, workflows } = usePolicyData();
  const [activeTab, setActiveTab] = useState('Signal');

  const renderTabContent = () => {
    const currentProducts = financeProducts[activeTab as keyof typeof financeProducts] || [];
    
    if (activeTab === 'Signal') {
      return (
        <section style={{ display: 'grid', gap: 20 }}>
          {/* SIGNAL FINANCE Hero Section */}
          <Card
            style={{
              position: 'relative',
              padding: 24,
              display: 'grid',
              gap: 20,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #E7F2FF, #F0F8FF)',
              border: '1px solid rgba(174,197,232,0.2)',
              boxShadow: '0 8px 24px rgba(30,79,158,0.08)',
            }}
          >
            {/* 실시간 링크 완료 배지 */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                padding: '8px 16px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(30,79,158,0.2)',
                fontSize: 12,
                fontWeight: 600,
                color: '#1E4F9E',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10B981',
                }}
              />
              실시간 링크 · 완료
            </div>

            <div style={{ display: 'grid', gap: 12, maxWidth: '95%' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1E4F9E', letterSpacing: 1 }}>
                SIGNAL FINANCE
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#123B70', lineHeight: 1.2 }}>
                개인사업자 솔루션
              </h2>
              <div style={{ display: 'grid', gap: 8 }}>
                <p style={{ fontSize: 14, color: '#123B70', lineHeight: 1.5, margin: 0 }}>
                  매출·원가·리뷰 데이터를 바탕으로 개인사업자 대출과 수신 상품을 큐레이션했어요.
                </p>
                <p style={{ fontSize: 14, color: '#123B70', lineHeight: 1.5, margin: 0 }}>
                  필요한 자금과 납입 계획을 시그널로 확인하세요.
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <button
                onClick={() => {
                  setActiveTab('policy');
                  // 스크롤을 더 아래로 이동
                  setTimeout(() => {
                    const element = document.querySelector('[data-product="소상공인 정책자금"]');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                      });
                    }
                  }, 100);
                }}
                style={{
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(30,79,158,0.1)',
                  boxShadow: '0 4px 12px rgba(30,79,158,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(30,79,158,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,79,158,0.05)';
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(16,185,129,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Landmark size={20} color="#10B981" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                  <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>AI 추천 상품</span>
                  <strong style={{ fontSize: 16, color: '#123B70', fontWeight: 700 }}>소상공인 정책자금</strong>
                  <span style={{ fontSize: 11, color: '#42526E', lineHeight: 1.3 }}>
                    최대 7천만원 · 연 2.5%<br />정부 보증 기반 안정성
                  </span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <ArrowRightCircle size={16} color="#10B981" />
                </div>
              </button>

              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(30,79,158,0.1)',
                  boxShadow: '0 4px 12px rgba(30,79,158,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(30,79,158,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Landmark size={20} color="#1E4F9E" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: '#1E4F9E', fontWeight: 600 }}>금리 혜택</span>
                  <strong style={{ fontSize: 16, color: '#123B70', fontWeight: 700 }}>최저 연 1.8%</strong>
                  <span style={{ fontSize: 11, color: '#42526E', lineHeight: 1.3 }}>
                    보증·정책 연계 금리 자동 비교해드려요
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(30,79,158,0.1)',
                  boxShadow: '0 4px 12px rgba(30,79,158,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(30,79,158,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={20} color="#1E4F9E" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: '#1E4F9E', fontWeight: 600 }}>SIGNAL 케어</span>
                  <strong style={{ fontSize: 16, color: '#123B70', fontWeight: 700 }}>서류 자동작성</strong>
                  <span style={{ fontSize: 11, color: '#42526E', lineHeight: 1.3 }}>
                    필수 제출 서류를 계정별로 작성해줘요
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      );
    }
    
    if (activeTab === 'card') {
      return (
        <section style={{ display: 'grid', gap: 12 }}>
          {/* Header with title and count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: palette.text }}>
              {tabs.find(tab => tab.id === activeTab)?.label} 상품
            </h3>
            <span style={{ fontSize: 12, color: palette.subtext }}>총 {currentProducts.length}개 상품</span>
          </div>
      
          {/* Card List */}
          <div style={{ display: 'grid', gap: 12 }}>
            {currentProducts.slice(0, 5).map((product, index) => (
              <Card
                key={product.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  borderRadius: 16,
                  background: product.accent,
                  border: '1px solid rgba(174,197,232,0.45)',
                  boxShadow: '0 4px 12px rgba(30,79,158,0.06)',
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 32,
                    borderRadius: 6,
                    background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 
                               index === 1 ? 'linear-gradient(135deg, #007AFF, #5AC8FA)' :
                               index === 2 ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)' :
                               index === 3 ? 'linear-gradient(135deg, #4ECDC4, #44A08D)' :
                               'linear-gradient(135deg, #8E44AD, #9B59B6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  {index === 0
                    ? '우리'
                    : index === 1
                    ? 'Business'
                    : index === 2
                    ? 'WON+'
                    : index === 3
                    ? 'SOHO'
                    : index === 4
                    ? 'Premium'
                    : ''}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#000000', margin: 0 }}>
                      {product.name}
                    </h4>
                    {index === 0 && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 12,
                          background: '#007AFF',
                          color: '#FFFFFF',
                          fontWeight: 600,
                        }}
                      >
                        인기
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: '#8E8E93', margin: 0 }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#007AFF' }}>
                      {product.rate}
                    </span>
                    <span style={{ fontSize: 14, color: '#8E8E93' }}>
                      {product.limit}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </section>
      );
    }
    
    return (
      <section style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: palette.text }}>
            {tabs.find(tab => tab.id === activeTab)?.label} 상품
          </h3>
          <span style={{ fontSize: 12, color: palette.subtext }}>총 {currentProducts.length}개 상품</span>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          {currentProducts.slice(0, 5).map((product) => (
            <Card
              key={product.name}
              data-product={product.name}
              style={{
                display: 'grid',
                gap: 16,
                padding: 20,
                borderRadius: 18,
                border: product.name === '소상공인 정책자금' ? '2px solid #10B981' : '1px solid rgba(174,197,232,0.45)',
                background: product.name === '소상공인 정책자금' ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))' : product.accent,
                boxShadow: product.name === '소상공인 정책자금' ? '0 6px 16px rgba(16,185,129,0.2)' : '0 4px 12px rgba(30,79,158,0.06)',
                position: 'relative',
                width: '100%',
              }}
            >
              {/* 메인 콘텐츠 영역 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                {activeTab === 'card' ? (
                  // 카드 상품 레이아웃
                  <>
                    {/* 왼쪽: 아이콘 + 상품명 + 기간 */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 16,
                          background: 'rgba(255,255,255,0.9)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          boxShadow: '0 8px 16px rgba(30,79,158,0.1)',
                        }}
                      >
                        {React.createElement(product.icon, { size: 24, color: palette.primary })}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
                          <h4 style={{ 
                            fontSize: 16, 
                            fontWeight: 700, 
                            color: palette.text, 
                            margin: 0,
                            wordBreak: 'keep-all',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {product.name}
                          </h4>
                          {product.name === '소상공인 정책자금' && (
                            <span
                              style={{
                                fontSize: 10,
                                padding: '2px 6px',
                                borderRadius: 8,
                                background: '#10B981',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              AI 추천
                            </span>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: 12, 
                          color: palette.subtext,
                          wordBreak: 'keep-all',
                          lineHeight: 1.4
                        }}>
                          {product.term}
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽: 한도, 금리 정보 */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 4, 
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(30,79,158,0.15)',
                      flexShrink: 0,
                      minWidth: 120,
                      textAlign: 'center'
                    }}>
                      <div style={{ 
                        fontSize: 13, 
                        fontWeight: 700, 
                        color: palette.text,
                        wordBreak: 'keep-all',
                        lineHeight: 1.2
                      }}>
                        {product.limit}
                      </div>
                      <div style={{ 
                        fontSize: 14, 
                        fontWeight: 600, 
                        color: '#10B981',
                        wordBreak: 'keep-all',
                        lineHeight: 1.2
                      }}>
                        {product.rate}
                      </div>
                    </div>
                  </>
                ) : (
                  // 정책자금, 대출, 예적금 레이아웃
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
                    {/* 상품명 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
                      <h4 style={{ 
                        fontSize: 16, 
                        fontWeight: 700, 
                        color: palette.text, 
                        margin: 0,
                        wordBreak: 'keep-all',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {product.name}
                      </h4>
                      {product.name === '소상공인 정책자금' && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 8,
                            background: '#10B981',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          AI 추천
                        </span>
                      )}
                    </div>

                    {/* limit / rate / term 한 줄 표시 */}
                    <div style={{ 
                      fontSize: 15, 
                      color: '#000000',
                      fontWeight: 600,
                      wordBreak: 'keep-all',
                      lineHeight: 1.4
                    }}>
                      {product.limit} / {product.rate} / {product.term}
                    </div>
                  </div>
                )}
              </div>


              {/* 조건/자격 요건 블록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: palette.primary,
                  marginBottom: 4 
                }}>
                  조건/자격 요건
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      style={{
                        fontSize: 11,
                        padding: '4px 8px',
                        borderRadius: 999,
                        background: 'rgba(30,79,158,0.1)',
                        color: palette.primary,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        border: '1px solid rgba(30,79,158,0.2)',
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div
      className="h-full"
      style={{
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tab Navigation */}
      <div
        style={{
          background: 'var(--app-white)',
          padding: '16px 20px 0',
          borderBottom: '1px solid rgba(174, 197, 232, 0.2)',
        }}
      >
        
        <div
          style={{
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
            paddingBottom: '12px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#000000' : '#8E8E93',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: 3,
                    background: '#000000',
                    borderRadius: '2px',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >


        {renderTabContent()}

        {activeTab === 'Signal' && (
          <section style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={18} color={palette.primary} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.text }}>진행 현황 </h3>
            </div>
            {workflows.length > 0 ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {workflows.map((workflow) => {
                  const statusColor = signalStatus[workflow.status as keyof typeof signalStatus];
                  return (
                    <Card
                      key={workflow.policy_id}
                      style={{
                        display: 'grid',
                        gap: 8,
                        padding: 16,
                        borderRadius: 18,
                        border: '1px solid rgba(174,197,232,0.45)',
                        background: 'linear-gradient(135deg, rgba(231,242,255,0.9), rgba(214,236,255,0.55))',
                        boxShadow: '0 4px 12px rgba(30,79,158,0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: palette.text }}>{workflow.product?.name}</h4>
                          <span style={{ fontSize: 12, color: palette.subtext }}>{workflow.product?.limit_amount} · {workflow.product?.interest_rate}</span>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: statusColor?.color ?? palette.text,
                            background: statusColor?.background ?? 'rgba(18,59,112,0.14)',
                            borderRadius: 999,
                            padding: '4px 10px',
                          }}
                        >
                          {workflow.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: palette.subtext }}>{workflow.notes || '추가 메모가 없어요. 필요 서류만 점검하세요.'}</p>
                      <div style={{ fontSize: 11, color: '#617EA3' }}>업데이트: {workflow.updated_at ? new Date(workflow.updated_at).toLocaleString() : '-'}</div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(231,242,255,0.9), rgba(214,236,255,0.55))',
                  border: '1px solid rgba(174,197,232,0.45)',
                  boxShadow: '0 4px 12px rgba(30,79,158,0.06)',
                  display: 'grid',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: palette.text, fontWeight: 600 }}>
                  <TimerReset size={16} />
                  아직 진행 중인 금융 상품이 없어요.
                </div>
                <p style={{ fontSize: 12, color: palette.subtext, lineHeight: 1.6 }}>
                  추천 리스트에서 마음에 드는 상품을 선택하면 SIGNAL이 서류 준비 체크리스트와 진행 단계를 자동으로 업데이트합니다. 선택 즉시 초록/주황/빨강 신호로 상태를 알려드릴게요.
                </p>
              </Card>
            )}
          </section>
        )}
      </main>

    </div>
  );
};

export const FinanceScreen = FinanceScreenComponent;
