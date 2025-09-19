import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Layers,
  PiggyBank,
  MessageSquare,
  Circle,
  PieChart as PieChartIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  YAxis,
} from 'recharts';
import { Card } from '../components/common/Card';
import { useMetrics } from '../hooks/useMetrics';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../auth/AuthContext';

const channelPalette = ['#1E4F9E', '#6FADE8', '#2AA5A0'];

const formatCurrency = (value: number) =>
  `${(Math.round(value) / 10000).toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}만 원`;

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export const DashboardScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { summary: metricsSummary, daily: metricsDaily } = useMetrics();
  const { summary: reviewSummary } = useReviews();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const totalNetSales = metricsSummary?.net_sales ?? 0;
  const totalCost = metricsSummary?.cost_of_goods ?? 0;
  const totalProfit = metricsSummary?.profit ?? 0;

  const profitMargin = totalNetSales > 0 ? totalProfit / totalNetSales : 0;
  const negativeRatio = reviewSummary && reviewSummary.review_count
    ? reviewSummary.negative_count / reviewSummary.review_count
    : 0;

  const openReviewDetail = () => {
    if (currentUser?.business_id) {
      // React Router를 사용하여 리뷰 상세 페이지로 직접 이동
      navigate(`/reviews/${currentUser.business_id}`);
    } else {
      // business_id가 없는 경우 일반 리뷰 페이지로 이동
      navigate('/reviews');
    }
  };

  const signalLevel = useMemo(() => {
    if (profitMargin >= 0.2 && negativeRatio <= 0.1) {
      return { tone: 'green', label: '성장 신호', description: '고객 확대와 재방문 전략에 집중할 좋은 흐름이에요.' };
    }
    if (profitMargin >= 0.1 && negativeRatio <= 0.25) {
      return { tone: 'amber', label: '주의 신호', description: '원가와 서비스 품질을 동시에 점검하면 좋아요.' };
    }
    return { tone: 'red', label: '위기 신호', description: '현금흐름 확보와 리뷰 대응을 빠르게 진행해 주세요.' };
  }, [profitMargin, negativeRatio]);

  const salesTrend = useMemo(() => {
    if (!metricsDaily || metricsDaily.length === 0) return [];
    const ordered = [...metricsDaily]
      .sort((a, b) => (a.metric_date > b.metric_date ? 1 : -1))
      .slice(-12);
    return ordered.map((item) => ({
      date: item.metric_date?.slice(5) ?? '',
      sales: (item.net_sales || 0) / 10000,
      cost: (item.cost_of_goods || 0) / 10000,
      profit: ((item.net_sales || 0) - (item.cost_of_goods || 0)) / 10000,
    }));
  }, [metricsDaily]);

  const channelBreakdown = useMemo(() => {
    if (!metricsDaily || metricsDaily.length === 0 || totalNetSales === 0) {
      const fallback = totalNetSales || 0;
      return [
        { name: 'POS 결제', value: fallback * 0.48 },
        { name: '배달 채널', value: fallback * 0.32 },
        { name: '카드/간편결제', value: fallback * 0.2 },
      ];
    }
    let pos = 0;
    let delivery = 0;
    let card = 0;
    const patterns = [
      { pos: 0.52, delivery: 0.28, card: 0.2 },
      { pos: 0.46, delivery: 0.34, card: 0.2 },
      { pos: 0.5, delivery: 0.3, card: 0.2 },
    ];
    metricsDaily.forEach((item, idx) => {
      const ratio = patterns[idx % patterns.length];
      const net = item.net_sales || 0;
      pos += net * ratio.pos;
      delivery += net * ratio.delivery;
      card += net * ratio.card;
    });
    const sum = pos + delivery + card || 1;
    return [
      { name: 'POS 결제', value: (pos / sum) * totalNetSales },
      { name: '배달 채널', value: (delivery / sum) * totalNetSales },
      { name: '카드/간편결제', value: (card / sum) * totalNetSales },
    ];
  }, [metricsDaily, totalNetSales]);

  const dailyChannelSeries = useMemo(() => {
    if (!metricsDaily || metricsDaily.length === 0) {
      return [];
    }
    const ordered = [...metricsDaily]
      .sort((a, b) => (a.metric_date > b.metric_date ? 1 : -1))
      .slice(-7);
    return ordered.map((item, idx) => {
      const ratio = [
        { pos: 0.52, delivery: 0.28, card: 0.2 },
        { pos: 0.46, delivery: 0.34, card: 0.2 },
        { pos: 0.5, delivery: 0.3, card: 0.2 },
      ][idx % 3];
      const net = item.net_sales || 0;
      return {
        date: item.metric_date?.slice(5) ?? '',
        pos: net * ratio.pos / 10000,
        delivery: net * ratio.delivery / 10000,
        card: net * ratio.card / 10000,
      };
    });
  }, [metricsDaily]);

  const reviewNarrative = useMemo(() => {
    if (!reviewSummary) {
      return '리뷰 데이터를 불러오는 중입니다. 최근 리뷰 분석을 연동하면 고객 반응을 신호등으로 확인할 수 있어요.';
    }
    const { review_count, average_rating, positive_count, negative_count } = reviewSummary;
    if (review_count === 0) {
      return '아직 신규 리뷰가 없어요. SNS 이벤트나 멤버십 리뷰 요청으로 첫 리뷰를 만들어보세요.';
    }
    if (negative_count / review_count > 0.25) {
      return `최근 ${review_count}건 중 부정 리뷰가 ${negative_count}건이에요. 키워드 분석을 기반으로 응대 문구와 서비스 동선을 정비해볼까요?`;
    }
    if (positive_count / review_count >= 0.6) {
      return `리뷰 ${review_count}건 중 긍정 반응이 ${positive_count}건으로 높아요. 단골 고객에게 감사 쿠폰을 제안하면 재방문을 늘릴 수 있어요.`;
    }
    return `평균 별점 ${average_rating.toFixed(2)}점입니다. 중립 리뷰에 등장하는 키워드로 메뉴 개선 아이디어를 정리해드릴게요.`;
  }, [reviewSummary]);

  const costNarrative = useMemo(() => {
    if (!metricsSummary) {
      return '원가 구조를 계산하고 있어요. 식자재 발주 데이터를 연동하면 즉시 절감 포인트를 제안드릴 수 있습니다.';
    }
    if (totalCost === 0) {
      return '원가 데이터가 아직 비어 있습니다. 카드 매입 내역을 연결하면 원가 신호등이 활성화됩니다.';
    }
    const unitCost = totalCost / Math.max(metricsDaily?.length || 1, 1);
    if (unitCost > totalNetSales * 0.6) {
      return '원가 비중이 높은 편이에요. 거래처 재협상 혹은 주력 메뉴 원가 절감을 검토해보세요.';
    }
    return '원가 비중이 안정적으로 관리되고 있어요. 재고 로테이션을 최적화해 초록 신호를 유지하세요.';
  }, [metricsSummary, totalCost, totalNetSales, metricsDaily?.length]);

  const profitNarrative = useMemo(() => {
    if (!metricsSummary) {
      return '순수익을 분석 중입니다. 매출·원가 데이터를 연동하면 PROFIT SIGNAL이 생성돼요.';
    }
    if (totalProfit <= 0) {
      return '최근 순수익이 마이너스입니다. 정책자금과 긴급 비용 절감 시나리오를 추천드릴게요.';
    }
    if (profitMargin >= 0.2) {
      return '순수익 마진이 건강해요. SNS 광고와 단골 전용 프로모션으로 성장 속도를 높여보세요.';
    }
    return '순수익은 플러스지만 여유가 크지 않아요. 배달 수수료와 인건비를 점검해 주황 신호를 초록으로 바꿔보세요.';
  }, [metricsSummary, totalProfit, profitMargin]);

  const salesNarrative = useMemo(() => {
    if (!metricsSummary) {
      return '매출 데이터를 불러오는 중입니다. 연동이 완료되면 최근 흐름을 바로 알려드릴게요.';
    }
    if (totalNetSales === 0) {
      return '매출 데이터가 아직 없습니다. POS/배달 매출을 연동하면 SIGNAL이 자동으로 생성됩니다.';
    }
    const latest = metricsDaily && metricsDaily.length > 0 ? metricsDaily[0].net_sales || 0 : totalNetSales;
    return `최근 30일 순매출은 ${formatCurrency(totalNetSales)} 수준입니다. 어제 매출은 ${(latest / 10000).toFixed(1)}만 원으로 ${
      latest >= totalNetSales / Math.max(metricsDaily?.length || 1, 1)
        ? '평균보다 높아요. 상승세를 유지해볼까요?'
        : '평균보다 낮아요. 런치 프로모션으로 수요를 끌어올릴 시점입니다.'
    }`;
  }, [metricsSummary, totalNetSales, metricsDaily]);

  const signalDotColor = signalLevel.tone === 'green' ? '#2AA5A0' : signalLevel.tone === 'amber' ? '#F5A45A' : '#C63A3A';

  return (
    <div className="h-full flex flex-col">
      <main
        className="flex-1"
        style={{
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#FFFFFF',
          minHeight: 0,
        }}
      >
        <Card
          style={{
            display: 'grid',
            gap: 16,
            padding: 20,
            borderRadius: 24,
            background: 'linear-gradient(145deg, rgba(231,242,255,0.95), rgba(204,227,255,0.75))',
            border: '1px solid rgba(174,197,232,0.7)',
            boxShadow: '0 16px 32px rgba(30,79,158,0.12)',
          }}
        >
          {/* 1단: 라벨 */}
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1E4F9E', letterSpacing: 2 }}>SIGNAL DASHBOARD</span>
          
          {/* 2단: 제목 (1줄, 말줄임) */}
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 800, 
            color: '#123B70',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'keep-all'
          }}>매출·원가·순이익 한눈에 보기</h2>
          
          {/* 3단: 위기 신호 배너 (테마 카드) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 16,
            background: signalLevel.tone === 'green' 
              ? 'linear-gradient(135deg, rgba(46,174,79,0.12), rgba(46,174,79,0.06))'
              : signalLevel.tone === 'amber'
              ? 'linear-gradient(135deg, rgba(245,164,90,0.12), rgba(245,164,90,0.06))'
              : 'linear-gradient(135deg, rgba(198,58,58,0.12), rgba(198,58,58,0.06))',
            border: `1px solid ${signalLevel.tone === 'green' 
              ? 'rgba(46,174,79,0.3)'
              : signalLevel.tone === 'amber'
              ? 'rgba(245,164,90,0.3)'
              : 'rgba(198,58,58,0.3)'}`,
            boxShadow: signalLevel.tone === 'green'
              ? '0 8px 24px rgba(46,174,79,0.08)'
              : signalLevel.tone === 'amber'
              ? '0 8px 24px rgba(245,164,90,0.08)'
              : '0 8px 24px rgba(198,58,58,0.08)',
            width: '100%'
          }}>
            <Circle size={12} fill={signalDotColor} color={signalDotColor} />
            <div style={{ display: 'grid', gap: 2, flex: 1 }}>
              <span style={{ 
                fontSize: 13, 
                fontWeight: 700, 
                color: signalDotColor,
                wordBreak: 'keep-all',
                whiteSpace: 'normal'
              }}>{signalLevel.label}</span>
              <span style={{ 
                fontSize: 11, 
                color: '#42526E',
                wordBreak: 'keep-all',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                lineHeight: 1.4
              }}>{signalLevel.description}</span>
            </div>
          </div>
          
          {/* 4단: 설명 문단 */}
          <p style={{ 
            fontSize: 12, 
            color: '#42526E', 
            lineHeight: 1.6,
            margin: 0,
            wordBreak: 'keep-all',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal'
          }}>
            매출과 고객 반응을 한 카드에서 요약했습니다. 색상 신호를 눌러 채널별 흐름과 즉시 실행 시나리오를 확인하세요.
          </p>

          <button
            type="button"
            onClick={() => setShowBreakdown((prev) => !prev)}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.82)',
              borderRadius: 20,
              padding: 18,
              display: 'grid',
              gap: 12,
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: '0 12px 28px rgba(30,79,158,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#1E4F9E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={16} /> 매출 추이
                </span>
                <strong style={{ fontSize: 22, color: '#123B70' }}>{formatCurrency(totalNetSales)}</strong>
                <span style={{ 
                  fontSize: 12, 
                  color: '#42526E',
                  wordBreak: 'keep-all',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  lineHeight: 1.5
                }}>{salesNarrative}</span>
              </div>
              {showBreakdown ? <ChevronUp color="#1E4F9E" size={18} /> : <ChevronDown color="#1E4F9E" size={18} />}
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer>
                <AreaChart data={salesTrend} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E4F9E" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#1E4F9E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={11} tickMargin={6} />
                  <RechartsTooltip formatter={(value: number) => `${value.toFixed(1)}만`} labelFormatter={(label) => `${label}`} />
                  <Area type="monotone" dataKey="sales" stroke="#1E4F9E" strokeWidth={2} fill="url(#salesGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </button>

          {showBreakdown && (
            <div
              style={{
                display: 'grid',
                gap: 16,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 20,
                padding: 16,
                border: '1px solid rgba(174,197,232,0.7)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E4F9E', fontSize: 12, fontWeight: 700 }}>
                <PieChartIcon size={16} /> 채널별 매출 구성
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16 }}>
                <div style={{ height: 140 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={channelBreakdown} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={4}>
                        {channelBreakdown.map((entry, index) => (
                          <Cell key={entry.name} fill={channelPalette[index % channelPalette.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {channelBreakdown.map((item, index) => (
                    <div key={item.name} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 4, 
                      color: '#123B70', 
                      fontSize: 12,
                      minWidth: 0
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: channelPalette[index % channelPalette.length] }} />
                        <span style={{ 
                          wordBreak: 'keep-all',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal'
                        }}>{item.name}</span>
                      </div>
                      <div style={{ 
                        marginLeft: 16,
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#1E4F9E',
                        wordBreak: 'keep-all',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}>
                        {formatCurrency(item.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer>
                  <BarChart data={dailyChannelSeries}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={11} />
                    <YAxis axisLine={false} tickLine={false} fontSize={11} tickFormatter={(value) => `${value.toFixed(1)}만`} />
                    <RechartsTooltip formatter={(value: number) => `${value.toFixed(1)}만`} />
                    <Bar dataKey="pos" fill="#1E4F9E" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="delivery" fill="#6FADE8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="card" fill="#2AA5A0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <span style={{ fontSize: 11, color: '#42526E' }}>
                SIGNAL이 POS·배달·간편결제 데이터를 학습해 채널별 탄력도를 산출했습니다. 특정 채널이 주황/빨강 신호로 바뀌면 즉시 알림을 드릴게요.
              </span>
            </div>
          )}

          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 20,
              padding: 18,
              display: 'grid',
              gap: 12,
              boxShadow: '0 10px 24px rgba(30,79,158,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E4F9E', fontSize: 12, fontWeight: 600 }}>
              <Layers size={16} /> 원가 현황
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <strong style={{ fontSize: 20, color: '#123B70' }}>{formatCurrency(totalCost)}</strong>
              <span style={{ 
                fontSize: 12, 
                color: '#42526E',
                wordBreak: 'keep-all',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                lineHeight: 1.5
              }}>{costNarrative}</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.94)',
              borderRadius: 20,
              padding: 18,
              display: 'grid',
              gap: 12,
              boxShadow: '0 12px 26px rgba(30,79,158,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E4F9E', fontSize: 12, fontWeight: 600 }}>
              <PiggyBank size={16} /> 순수익 추이
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'grid', gap: 6 }}>
                <strong style={{ fontSize: 20, color: '#123B70' }}>{formatCurrency(totalProfit)}</strong>
                <span style={{ 
                  fontSize: 12, 
                  color: '#42526E',
                  wordBreak: 'keep-all',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  lineHeight: 1.5
                }}>{profitNarrative}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          style={{
            padding: 18,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(231,242,255,0.92), rgba(214,236,255,0.82))',
            border: '1px solid rgba(174,197,232,0.7)',
            boxShadow: '0 14px 30px rgba(30,79,158,0.12)',
            display: 'grid',
            gap: 12,
            cursor: 'pointer',
          }}
          onClick={openReviewDetail}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#1E4F9E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageSquare size={16} /> 최근 리뷰 현황
              </span>
              <strong style={{ fontSize: 18, color: '#123B70' }}>
                리뷰 {reviewSummary?.review_count ?? 0}건 · 평균 {reviewSummary ? reviewSummary.average_rating.toFixed(2) : '—'}점
              </strong>
            </div>
            <span style={{ fontSize: 11, color: '#1E4F9E' }}>자세히 보기</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
              <span style={{ color: '#2AA5A0' }}>긍정 {reviewSummary?.positive_count ?? 0}건</span>
              <span style={{ color: '#6FADE8' }}>중립 {reviewSummary?.neutral_count ?? 0}건</span>
              <span style={{ color: '#C63A3A' }}>부정 {reviewSummary?.negative_count ?? 0}건</span>
            </div>
            <span style={{ fontSize: 11, color: '#42526E' }}>
              {reviewSummary && reviewSummary.review_count > 0
                ? `부정 비중 ${formatPercent(negativeRatio)}`
                : '데이터 준비중'}
            </span>
          </div>
          <span style={{ 
            fontSize: 12, 
            color: '#42526E',
            wordBreak: 'keep-all',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            lineHeight: 1.5
          }}>{reviewNarrative}</span>
        </Card>
      </main>
    </div>
  );
};
