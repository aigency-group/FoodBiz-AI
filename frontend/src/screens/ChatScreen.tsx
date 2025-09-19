
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TrendingUp, AlertTriangle, Sparkles, ArrowRight, Landmark } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../auth/AuthContext';
import { useMetrics } from '../hooks/useMetrics';
import { useReviews } from '../hooks/useReviews';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type HybridSource = {
  type: 'sql' | 'doc';
  name: string;
  meta?: Record<string, any>;
};

type HybridChartSeries = {
  name: string;
  data: { x: string; y: number }[];
};

type HybridChart = {
  type: 'timeseries';
  series: HybridChartSeries[];
};

type HybridCalculations = Record<string, number | null>;

type Msg = {
  from: 'bot' | 'me';
  text: string;
  sources?: HybridSource[];
  charts?: HybridChart[];
  calculations?: HybridCalculations;
};

const formatCurrency = (value: number) => `${Math.round(value).toLocaleString()}원`;
const CALC_LABEL_MAP: Record<string, string> = {
  moving_avg_7: '7일 이동평균',
  pct_change_7d: '7일 전 대비 증감률',
};

const TimeseriesChartCard: React.FC<{ chart: HybridChart }> = ({ chart }) => {
  if (chart.type !== 'timeseries' || !chart.series?.length) {
    return null;
  }
  const primarySeries = chart.series[0];
  if (!primarySeries?.data?.length) {
    return null;
  }
  return (
    <div
      style={{
        marginTop: 12,
        background: '#FFFFFF',
        borderRadius: 14,
        padding: 12,
        boxShadow: '0 8px 20px rgba(30,79,158,0.12)',
      }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={primarySeries.data}>
          <CartesianGrid stroke="#E6E9EE" strokeDasharray="3 3" />
          <XAxis dataKey="x" tick={{ fontSize: 11, fill: '#6B7280' }} tickMargin={8} />
          <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 10000)}만`} tick={{ fontSize: 11, fill: '#6B7280' }} width={48} />
          <Tooltip
            formatter={(value: number) => [formatCurrency(Number(value)), '매출']}
            labelFormatter={(label: string) => label}
          />
          <Line type="monotone" dataKey="y" stroke="#1E4F9E" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

type SignalTone = 'green' | 'amber' | 'red';

const badgeTheme = {
  primary: { background: 'rgba(111,175,235,0.18)', color: '#1E4F9E' },
  success: { background: 'rgba(86,204,179,0.18)', color: '#0E7C86' },
  warning: { background: 'rgba(246,139,104,0.18)', color: '#C63A3A' },
};

const WelcomeBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  metric: string;
  tone: keyof typeof badgeTheme;
}> = ({ icon, label, metric, tone }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      background: '#ffffff',
      borderRadius: 14,
      padding: '10px 12px',
      boxShadow: '0 8px 20px rgba(30,79,158,0.08)',
      border: '1px solid rgba(174,197,232,0.45)',
      minWidth: 120,
      flex: 1,
    }}
  >
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        padding: '4px 8px',
        ...badgeTheme[tone],
        fontSize: 11,
        fontWeight: 600,
        width: 'fit-content',
      }}
    >
      {icon}
      {label}
    </span>
    <strong style={{ fontSize: 14, color: '#123B70' }}>{metric}</strong>
  </div>
);

const SuggestionRow: React.FC<{ icon?: React.ReactNode; title: string; description: string }> = ({
  icon = <Sparkles size={14} color="#1E4F9E" />,
  title,
  description,
}) => (
  <div
    style={{
      display: 'grid',
      gap: 3,
      background: 'rgba(255,255,255,0.82)',
      borderRadius: 12,
      padding: '9px 11px',
      border: '1px solid rgba(174,197,232,0.6)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#1E4F9E', fontWeight: 600 }}>
      {icon}
      {title}
    </div>
    <p style={{ 
      fontSize: 11, 
      color: '#42526E', 
      lineHeight: 1.4,
      wordBreak: 'keep-all',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'normal'
    }}>{description}</p>
  </div>
);

const CtaButton: React.FC<{ label: string; onClick: () => void; accent: string }> = ({
  label,
  onClick,
  accent,
}) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      minWidth: 100,
      borderRadius: 12,
      padding: '9px 11px',
      background: accent,
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
      border: 'none',
      boxShadow: '0 10px 18px rgba(30,79,158,0.16)',
    }}
  >
    <span>{label}</span>
    <ArrowRight size={15} />
  </button>
);

const Bubble: React.FC<{ from: 'bot' | 'me'; children?: React.ReactNode }> = ({ from, children }) => {
  const isMe = from === 'me';
  return (
    <div
      style={{
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        background: isMe ? 'var(--app-primary)' : '#ffffff',
        color: isMe ? '#fff' : 'var(--app-text-primary)',
        borderRadius: 16,
        padding: 11,
        maxWidth: '78%',
        fontSize: 13,
        boxShadow: '0 3px 12px rgba(11,44,94,0.08)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
};

function resolveSignalTone({ profit, sales, negativeRate }: { profit: number; sales: number; negativeRate: number }): SignalTone {
  const margin = sales > 0 ? profit / sales : 0;
  if (margin >= 0.2 && negativeRate <= 0.1) return 'green';
  if (margin >= 0.1 && negativeRate <= 0.25) return 'amber';
  return 'red';
}

export function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const { currentUser, token } = useAuth();
  const { summary: metricsSummary } = useMetrics();
  const { summary: reviewSummary } = useReviews();

  const renderCalculations = useCallback(
    (calculations?: HybridCalculations) => {
      if (!calculations) return null;
      const entries = Object.entries(calculations).filter(
        ([, value]) => value !== null && value !== undefined,
      );
      if (!entries.length) return null;
      return (
        <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
          {entries.map(([key, value]) => {
            const label = CALC_LABEL_MAP[key] ?? key;
            const numeric = Number(value);
            const displayValue = key.includes('pct')
              ? `${(numeric * 100).toFixed(2)}%`
              : formatCurrency(numeric);
            return (
              <div
                key={key}
                style={{
                  padding: '6px 8px',
                  background: 'rgba(30,79,158,0.08)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#123B70',
                  fontWeight: 600,
                }}
              >
                {label}: {displayValue}
              </div>
            );
          })}
        </div>
      );
    },
    [],
  );

  const renderSources = useCallback((sources?: HybridSource[]) => {
    if (!sources?.length) return null;
    const metaLabel: Record<string, string> = {
      from: '시작일',
      to: '종료일',
      suggested_range: '제안 범위',
      uploaded_at: '업로드',
      score: '유사도',
    };
    return (
      <div style={{ marginTop: 12, borderTop: '1px solid rgba(18,59,112,0.12)', paddingTop: 8 }}>
        <p style={{ fontSize: 10, color: '#42526E', marginBottom: 6 }}>출처</p>
        {sources.map((source, index) => {
          const entries = Object.entries(source.meta ?? {})
            .filter(([key]) => key !== 'business_id')
            .map(([key, value]) => `${metaLabel[key] ?? key}: ${value}`)
            .join(' · ');
          const badge = source.type === 'sql' ? '데이터' : '문서';
          return (
            <div
              key={`${source.name}-${index}`}
              style={{
                display: 'grid',
                gap: 4,
                marginBottom: 8,
                fontSize: 11,
                color: '#42526E',
              }}
            >
              <span style={{ fontWeight: 600, color: '#123B70' }}>
                [{badge}] {source.name}
              </span>
              {entries && <span>{entries}</span>}
            </div>
          );
        })}
      </div>
    );
  }, []);

  const renderCharts = (charts?: HybridChart[]) => {
    if (!charts?.length) return null;
    return charts.map((chart, index) => (
      <TimeseriesChartCard chart={chart} key={`${chart.type}-${index}`} />
    ));
  };

  const signalTone = useMemo<SignalTone>(() => {
    if (!currentUser) return 'amber';
    const email = currentUser.sub || currentUser.id || '';
    if (email === 'woori03@wooribank.com') return 'green';
    if (email === 'woori02@wooribank.com') return 'amber';
    if (email === 'woori01@wooribank.com') return 'red';
    const sales = metricsSummary?.net_sales ?? 0;
    const profit = metricsSummary?.profit ?? 0;
    const negativeRate = reviewSummary && reviewSummary.review_count
      ? reviewSummary.negative_count / reviewSummary.review_count
      : 0.2;
    return resolveSignalTone({ profit, sales, negativeRate });
  }, [currentUser, metricsSummary, reviewSummary]);

  const welcomeScript = useMemo(() => {
    const owner = currentUser?.owner_name ? `${currentUser.owner_name} 사장님` : '사장님';
    if (signalTone === 'green') {
      return `안녕하세요, ${owner}! 초록 신호예요. 오늘은 성장 코칭으로 고객 확보 아이디어를 준비했습니다.`;
    }
    if (signalTone === 'amber') {
      return `안녕하세요, ${owner}. 주황 신호입니다. 리뷰 키워드 기반 개선 팁을 함께 점검해볼까요?`;
    }
    return `안녕하세요, ${owner}. 빨강 신호가 켜졌어요. 정책자금과 긴급 대응 플랜부터 정리해드릴게요.`;
  }, [currentUser?.owner_name, signalTone]);

  useEffect(() => {
    if (!messages.length) {
      setMessages([{ from: 'bot', text: welcomeScript }]);
    }
  }, [messages.length, welcomeScript]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const sendQuery = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((m) => [...m, { from: 'me', text }]);
    setShowWelcomeCard(false);
    setInput('');
    setIsLoading(true);

    try {
      const bizId = currentUser?.business_id;
      const qs = bizId ? `?business_id=${encodeURIComponent(bizId)}` : '';
      const response = await fetch(`${API_URL}/rag/query${qs}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query: text, ...(bizId ? { business_id: bizId } : {}) }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const hybridMessage: Msg = {
        from: 'bot',
        text: data.answer || '답변을 생성하지 못했습니다.',
        sources: data.sources || [],
        charts: data.charts || [],
        calculations: data.calculations || {},
      };
      setMessages((m) => [...m, hybridMessage]);
    } catch (error) {
      console.error('Failed to fetch RAG query', error);
      setMessages((m) => [
        ...m,
        {
          from: 'bot',
          text: '죄송합니다. 답변을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          sources: [],
          charts: [],
          calculations: {},
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCta = (type: 'metrics' | 'reviews' | 'finance') => {
    setShowWelcomeCard(false);
    if (type === 'metrics') {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: '매출 추이 상세 화면을 열었어요. 대시보드에서 최근 흐름을 확인해보세요.' },
      ]);
      (window as any).__goPage?.('metrics');
    } else if (type === 'reviews') {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: '최근 리뷰 키워드를 분석 중입니다. 대응 우선순위를 정해볼까요?' },
      ]);
      if (currentUser?.business_id) {
        (window as any).__openReviewDetail?.(currentUser.business_id);
      } else {
        (window as any).__goPage?.('reviews');
      }
    } else {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: '금융 탭으로 이동했어요. 채널별 현금흐름과 추천 상품을 같이 점검해볼까요?' },
      ]);
      (window as any).__goTab?.('finance');
    }
  };

  const negativeRate = reviewSummary && reviewSummary.review_count
    ? reviewSummary.negative_count / reviewSummary.review_count
    : 0;

  const signalLabel = signalTone === 'green' ? '성장 코칭 준비 완료' : signalTone === 'amber' ? '개선 플랜 점검' : '긴급 대응 필요';
  const signalColor = signalTone === 'green' ? '#2AA5A0' : signalTone === 'amber' ? '#F5A45A' : '#C63A3A';

  return (
    <div className="h-full flex flex-col" style={{ background: '#FFFFFF' }}>
      <div
        ref={listRef}
        className="flex-1"
        style={{ overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {showWelcomeCard && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(229,240,255,0.97), rgba(255,255,255,0.92))',
              borderRadius: 18,
              padding: 12,
              display: 'grid',
              gap: 10,
              boxShadow: '0 12px 30px rgba(30,79,158,0.12)',
              border: '1px solid rgba(174,197,232,0.65)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: signalColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Landmark size={12} /> {signalLabel}
                </span>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#123B70' }}>오늘의 핵심 시그널</h3>
              </div>
              <button
                onClick={() => setShowWelcomeCard(false)}
                style={{ fontSize: 10, color: '#1E4F9E', background: 'transparent', border: 'none' }}
              >
                숨기기
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <WelcomeBadge
                icon={<TrendingUp size={13} />}
                label="매출"
                metric={metricsSummary ? `${(metricsSummary.net_sales / 10000).toFixed(1)}만` : '연동 대기'}
                tone="primary"
              />
              <WelcomeBadge
                icon={<AlertTriangle size={13} />}
                label="리뷰"
                metric={reviewSummary ? `부정 ${reviewSummary.negative_count}건` : '데이터 없음'}
                tone={negativeRate > 0.2 ? 'warning' : 'success'}
              />
            </div>
            <div style={{ display: 'grid', gap: 7 }}>
              <SuggestionRow
                title="매출 속도"
                description={metricsSummary
                  ? `최근 30일 순매출 ${ (metricsSummary.net_sales / 10000).toFixed(1) }만 원 · 마진 ${(metricsSummary.net_sales ? ((metricsSummary.profit || 0) / metricsSummary.net_sales * 100).toFixed(1) : '0.0')}%`
                  : 'POS/배달 데이터를 연동하면 순매출 흐름을 안내해드려요.'}
              />
              <SuggestionRow
                title="리뷰 & 금융 케어"
                description={reviewSummary && reviewSummary.review_count
                  ? `부정 리뷰 비중 ${(negativeRate * 100).toFixed(0)}%. 금융 탭에서 대응 자금과 쿠폰 전략을 함께 확인하세요.`
                  : '리뷰 데이터를 연결하고 금융 탭에서 우리은행 개인사업자 상품을 확인해보세요.'}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <CtaButton label="매출 추이" onClick={() => handleCta('metrics')} accent="#1E4F9E" />
              <CtaButton label="리뷰 현황" onClick={() => handleCta('reviews')} accent="#2AA5A0" />
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} from={m.from}>
            {m.text}
            {renderCharts(m.charts)}
            {renderCalculations(m.calculations)}
            {renderSources(m.sources)}
          </Bubble>
        ))}
        {isLoading && <Bubble from="bot">답변을 준비하고 있어요...</Bubble>}
      </div>

      <div
        className="border-t"
        style={{ display: 'flex', gap: 8, padding: 12, background: '#ffffff', borderColor: '#D7E0F0' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendQuery()}
          placeholder="메시지를 입력하세요"
          style={{
            flex: 1,
            padding: '11px 12px',
            borderRadius: 12,
            border: '1px solid #D7E0F0',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 13,
            background: '#F7FAFF',
          }}
          disabled={isLoading}
        />
        <button
          onClick={sendQuery}
          style={{
            padding: '0 16px',
            borderRadius: 12,
            color: '#fff',
            background: 'var(--app-primary)',
            border: 'none',
            fontWeight: 600,
            fontSize: 13,
          }}
          disabled={isLoading}
        >
          전송
        </button>
      </div>
    </div>
  );
}
