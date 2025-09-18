import React from 'react';
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
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from "@/components/ui/badge";
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

const heroInsights = [
  {
    title: '유동성 버퍼',
    metric: '운영자금 D+1',
    description: '필요 자금이 생기면 하루 안에 전환할 수 있는 한도를 확인하세요.',
  },
  {
    title: '금리 혜택',
    metric: '최저 연 1.8%',
    description: '보증 및 정책 상품 금리를 비교해 유리한 조건을 선택하세요.',
  },
  {
    title: 'SIGNAL 케어',
    metric: '서류 자동작성',
    description: '필수 제출 서류를 계정 정보로 미리 채워 편하게 제출할 수 있습니다.',
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
        term: '최장 5년 (거치 1년)',
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

  return (
    <div
      className="h-full"
      style={{
        background: 'var(--app-background)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <section style={{ display: 'grid', gap: 16 }}>
          <Card
            style={{
              position: 'relative',
              padding: 20,
              display: 'grid',
              gap: 20,
              borderRadius: 24,
              background: 'linear-gradient(150deg, rgba(231,242,255,0.95), rgba(111,173,232,0.65))',
              border: '1px solid rgba(174,197,232,0.65)',
              boxShadow: '0 20px 42px rgba(30,79,158,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: palette.primary, letterSpacing: 2 }}>Finance overview</span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: palette.text }}>
                  오늘 확인할 주요 금융 정보
                </h2>
                <p style={{ fontSize: 12, color: palette.subtext, lineHeight: 1.5 }}>
                  최근 매출·리뷰 지표를 기준으로 추천 상품과 진행 현황을 한곳에서 정리했습니다.
                </p>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  color: palette.primary,
                  fontWeight: 700,
                  border: '1px solid rgba(174,197,232,0.5)',
                }}
              >
                <Sparkles size={14} /> 최신 데이터 반영됨
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
              {heroInsights.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(174,197,232,0.6)',
                    boxShadow: '0 12px 24px rgba(30,79,158,0.12)',
                    display: 'grid',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 11, color: palette.primary, fontWeight: 600 }}>{item.title}</span>
                  <strong style={{ fontSize: 16, color: palette.text }}>{item.metric}</strong>
                  <span style={{ fontSize: 11, color: palette.subtext }}>{item.description}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: palette.text }}>SIGNAL 추천 금융 상품</h3>
            <span style={{ fontSize: 12, color: palette.subtext }}>데이터 기반 맞춤 큐레이션</span>
          </div>

          {recommendations.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {recommendations.map((item) => (
                <Card
                  key={item.policy_id}
                  style={{
                    display: 'grid',
                    gap: 12,
                    padding: 18,
                    borderRadius: 20,
                    border: '1px solid rgba(174,197,232,0.6)',
                    background: 'linear-gradient(135deg, rgba(231,242,255,0.85), rgba(214,236,255,0.65))',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <span style={{ fontSize: 12, color: palette.primary, fontWeight: 600 }}>{item.group_name}</span>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: palette.text }}>{item.name}</h4>
                      <span style={{ fontSize: 12, color: palette.subtext }}>{item.rationale}</span>
                    </div>
                    <div style={{ display: 'grid', gap: 4, textAlign: 'right', fontSize: 12, color: palette.text }}>
                      <strong>{item.limit_amount}</strong>
                      <span>{item.interest_rate}</span>
                      <span>우선순위 {item.priority}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 6, fontSize: 12, color: palette.subtext, lineHeight: 1.6 }}>
                    <div><strong>대출 기간</strong>: {item.term}</div>
                    <div><strong>신청 조건</strong>: {item.eligibility}</div>
                    <div><strong>필요 서류</strong>: {item.documents}</div>
                    <div><strong>신청 방법</strong>: {item.application_method}</div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: palette.primary }}>
                    <ArrowRightCircle size={14} />
                    지금 서류 작성 진행하기
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {curatedFinanceProducts.map((group) => (
                <Card
                  key={group.category}
                  style={{
                    display: 'grid',
                    gap: 14,
                    padding: 20,
                    borderRadius: 22,
                    background: group.accent,
                    border: '1px solid rgba(174,197,232,0.55)',
                    boxShadow: '0 16px 36px rgba(30,79,158,0.14)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        background: 'rgba(255,255,255,0.75)',
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 12px 22px rgba(30,79,158,0.08)'
                      }}
                    >
                      {React.createElement(group.icon, { size: 24, color: group.tone })}
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: group.tone }}>{group.category}</span>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: palette.text }}>{group.headline}</h4>
                      <p style={{ fontSize: 12, color: palette.subtext, lineHeight: 1.5 }}>{group.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {group.products.map((product) => (
                      <div
                        key={product.name}
                        style={{
                          padding: 14,
                          borderRadius: 16,
                          background: 'rgba(255,255,255,0.78)',
                          border: '1px solid rgba(174,197,232,0.5)',
                          display: 'grid',
                          gap: 10,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                          <div>
                            <h5 style={{ fontSize: 15, fontWeight: 700, color: palette.text }}>{product.name}</h5>
                            <div style={{ fontSize: 12, color: palette.subtext, display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                              <span>한도 {product.limit}</span>
                              <span>금리 {product.rate}</span>
                              <span>{product.term}</span>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            style={{
                              background: 'rgba(255,255,255,0.9)',
                              color: group.tone,
                              borderColor: 'rgba(174,197,232,0.5)',
                            }}
                          >
                            {product.signal}
                          </Badge>
                        </div>
                        <div style={{ display: 'grid', gap: 6 }}>
                          {product.features.map((feature) => (
                            <div key={feature} style={{ fontSize: 12, color: palette.subtext, display: 'flex', gap: 6 }}>
                              <ShieldCheck size={14} color={group.tone} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardList size={18} color={palette.primary} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.text }}>진행 현황 · Workflow</h3>
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
                      border: '1px solid rgba(174,197,232,0.6)',
                      background: 'linear-gradient(135deg, rgba(231,242,255,0.9), rgba(214,236,255,0.5))',
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
                borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(231,242,255,0.85), rgba(214,236,255,0.5))',
                border: '1px solid rgba(174,197,232,0.55)',
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
      </main>
    </div>
  );
};

export const FinanceScreen = FinanceScreenComponent;
