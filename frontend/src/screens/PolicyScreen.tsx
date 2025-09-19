import React from 'react';
import {
  Building2,
  Landmark,
  ShieldCheck,
  Rocket,
  Workflow,
  ArrowRightCircle,
  ClipboardList,
  TimerReset,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { usePolicyData } from '../hooks/usePolicy';

const highlightCards = [
  {
    title: '우리 사잇돌 중금리대출',
    limit: '최대 2천만원',
    badges: ['서울보증보험증권 발급 가능', '대출 실행 수수료 면제'],
    description: '중·저신용 소상공인의 자금 운용을 지원하는 보증 연계 중금리 상품입니다.',
    icon: ShieldCheck,
    accent: 'linear-gradient(135deg, rgba(0,85,160,0.12), rgba(0,85,160,0.03))',
  },
  {
    title: '위비 SOHO 모바일 신용대출',
    limit: '최대 3천만원',
    badges: ['비씨가맹점 1년 이상', '모바일 간편 실행'],
    description: '영업점 방문 없이 모바일로 한도 조회부터 실행까지 가능한 비대면 전용 상품입니다.',
    icon: Rocket,
    accent: 'linear-gradient(135deg, rgba(12,138,226,0.12), rgba(12,138,226,0.04))',
  },
  {
    title: '소상공인 정책자금',
    limit: '최대 7천만원',
    badges: ['중소벤처기업부', '신용보증기금 연계'],
    description: '운영자금, 시설자금, 긴급자금 등 정부 보증 기반의 정책 금융을 한 번에 비교할 수 있습니다.',
    icon: Landmark,
    accent: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
  },
  {
    title: '우리은행 특별 대출상품',
    limit: '업종별 맞춤 한도',
    badges: ['소상공인 전용', '이자 지원 프로모션'],
    description: '우리은행 PB센터 상담을 통해 업종별 데이터 기반 맞춤 금리를 제공합니다.',
    icon: Building2,
    accent: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
  },
];

const workflowColors: Record<string, { color: string; background: string }> = {
  진행중: { color: '#1D4ED8', background: 'rgba(29,78,216,0.12)' },
  승인: { color: '#15803D', background: 'rgba(21,128,61,0.12)' },
  거절: { color: '#DC2626', background: 'rgba(220,38,38,0.12)' },
  마감: { color: '#737373', background: 'rgba(115,115,115,0.12)' },
  보류: { color: '#F59E0B', background: 'rgba(245,158,11,0.18)' },
};

const policyGroups = [
  {
    title: '정책자금 그룹',
    description: '정부 · 보증기관이 지원하는 저금리·장기 상환 상품',
    items: [
      {
        name: '신용보증기금 정책자금',
        limit: '최대 3억원',
        rate: '연 2.2% ~ 3.5%',
        term: '최장 7년 (거치 2년 포함)',
        eligibility: '전년도 매출 120억원 이하 소상공인, 부채비율 300% 이하',
        documents: '사업자등록증, 부가세과세표준증명, 매출증빙, 재무제표',
        application: '지역본부 상담 후 보증서 발급 → 협약은행 실행',
        status: '진행중',
      },
      {
        name: '중소벤처기업부 정책자금',
        limit: '최대 1억원',
        rate: '연 1.8% 고정',
        term: '최장 5년 (거치 1년)',
        eligibility: '창업 7년 이내 소상공인, 정책자금 온라인 시스템 등록',
        documents: '사업계획서, 매출증빙, 4대보험 완납증명, 재무제표',
        application: '소상공인 정책자금 시스템 → 지역센터 현장평가',
        status: '승인',
      },
      {
        name: '지자체 정책자금',
        limit: '최대 5천만원',
        rate: '연 1.0% (지자체 이자 보전)',
        term: '최장 4년',
        eligibility: '관내 사업 영위 6개월 이상, 지방세 체납 없음',
        documents: '지자체 신청서, 임대차계약서, 납세증명',
        application: '지자체 경제과 방문 접수 → 은행 동행 심사',
        status: '마감',
      },
    ],
  },
  {
    title: '우리은행 상품 그룹',
    description: '우리은행 전용 우대금리 및 보증 연계 대출',
    items: [
      {
        name: '우리 사잇돌 중금리대출',
        limit: '최대 2천만원',
        rate: '연 6.0% ~ 9.0%',
        term: '최장 5년',
        eligibility: '연소득 1,500만원 이상, NICE 475점 이상, 서울보증보험 증권 발급 가능',
        documents: '신분증, 소득금액증명, 4대보험 가입내역, 임대차계약서',
        application: '영업점 방문 상담 → SGI 보증심사 → 대출 실행',
        status: '보류',
      },
      {
        name: '위비 SOHO 모바일 신용대출',
        limit: '최대 3천만원',
        rate: '연 5.5% ~ 8.5%',
        term: '최장 5년 (거치 1년)',
        eligibility: '비씨카드 가맹점 1년 이상, 월 매출 500만원 이상',
        documents: '모바일 전자동의, 가맹점 매출 내역, 통장 거래내역',
        application: '위비 WON뱅킹 → 신용평가 → 즉시 실행',
        status: '진행중',
      },
      {
        name: '소상공인 특별 대출',
        limit: '최대 8천만원',
        rate: '연 4.8% ~ 6.2%',
        term: '최장 6년 (거치 2년)',
        eligibility: '업력 1년 이상, 최근 3개월 카드 매출 300만원 이상',
        documents: '사업자등록증, 카드매출내역, 임대차계약서, 신용정보조회 동의',
        application: '우리은행 기업센터 사전 상담 → 심사 서류 접수',
        status: '승인',
      },
    ],
  },
  {
    title: '업종별 특화 그룹',
    description: '업종 데이터 기반 한도·금리 차등 적용 상품',
    items: [
      {
        name: '음식점업 대출',
        limit: '최대 6천만원',
        rate: '연 4.2% ~ 6.0%',
        term: '최장 5년 (거치 6개월)',
        eligibility: '배달/홀 매출 월 800만원 이상, 위생등급 양호',
        documents: 'POS 매출내역, 위생등급증명, 식자재 납품계약서',
        application: '전문 상담원 현장 방문 → 업종 데이터 분석 보고 → 실행',
        status: '진행중',
      },
      {
        name: '소매업 대출',
        limit: '최대 5천만원',
        rate: '연 4.5% ~ 6.8%',
        term: '최장 4년 (거치 1년)',
        eligibility: '온·오프라인 합산 월 매출 600만원 이상, 재고회전율 6회 이상',
        documents: '매출증빙, 재고리스트, 임대차계약서',
        application: '우리은행 데이터스퀘어 → 본부 심사 연계',
        status: '보류',
      },
      {
        name: '서비스업 대출',
        limit: '최대 4천만원',
        rate: '연 4.9% ~ 7.2%',
        term: '최장 4년',
        eligibility: '고객 재방문율 30% 이상, 카드 매출 꾸준',
        documents: '회원관리DB, 카드매출내역, 소득금액증명',
        application: '비대면 서류 업로드 → 본점 심사 → 약정 체결',
        status: '거절',
      },
    ],
  },
];

const PolicyScreenComponent: React.FC = () => {
  const { recommendations, workflows } = usePolicyData();

  const groupedRecommendations = recommendations.reduce<Record<string, typeof recommendations>>((acc, item) => {
    const key = item.group_name;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

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
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: '700px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)' }}>
          추천 정책자금
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {recommendations.length === 0 && highlightCards.map((card) => (
            <Card
              key={card.title}
              style={{
                background: card.accent,
                borderColor: 'rgba(0,85,160,0.12)',
                boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: 'rgba(15,23,42,0.05)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {React.createElement(card.icon, { size: 24, color: '#0055A0' })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{card.title}</h3>
                      <p style={{ 
                        fontSize: 12, 
                        color: 'var(--app-text-secondary)',
                        wordBreak: 'keep-all',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        lineHeight: 1.5,
                        margin: 0
                      }}>{card.description}</p>
                    </div>
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      color: '#0055A0',
                      flexShrink: 0,
                      textAlign: 'right'
                    }}>{card.limit}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {card.badges.map((badge) => (
                      <span
                        key={badge}
                        style={{
                          fontSize: 11,
                          padding: '4px 8px',
                          borderRadius: 999,
                          background: 'rgba(255,255,255,0.8)',
                          color: '#0055A0',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {recommendations.length > 0 && Object.entries(groupedRecommendations).map(([groupName, items]) => (
            <Card key={groupName} style={{ display: 'grid', gap: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{groupName}</h3>
              {items.map((item) => (
                <div key={item.policy_id} style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{item.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--app-text-secondary)', margin: 0 }}>{item.limit_amount} · {item.interest_rate}</p>
                    </div>
                    <span style={{ 
                      fontSize: 12, 
                      color: '#2563EB',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>우선순위 {item.priority}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#475467', lineHeight: 1.5 }}>{item.rationale}</p>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    <div><strong>대출 기간</strong>: {item.term}</div>
                    <div><strong>신청 조건</strong>: {item.eligibility}</div>
                    <div><strong>필요 서류</strong>: {item.documents}</div>
                    <div><strong>신청 방법</strong>: {item.application_method}</div>
                  </div>
                </div>
              ))}
            </Card>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Workflow size={18} color="#0055A0" />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>상품 비교 · Workflow</h2>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          {workflows.length === 0 && policyGroups.map((group) => (
            <div key={group.title} style={{ display: 'grid', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{group.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--app-text-secondary)' }}>{group.description}</p>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {group.items.map((item) => {
                  const color = workflowColors[item.status];
                  return (
                    <Card
                      key={item.name}
                      style={{
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: 'rgba(15,23,42,0.05)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ClipboardList size={20} color="#0F172A" />
                        </div>
                        <div style={{ flex: 1, display: 'grid', gap: 4, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{item.name}</h4>
                              <span style={{ fontSize: 12, color: 'var(--app-text-secondary)' }}>{item.limit} · {item.rate}</span>
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: color?.color ?? '#334155',
                                background: color?.background ?? 'rgba(148,163,184,0.16)',
                                borderRadius: 999,
                                padding: '4px 10px',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div style={{ display: 'grid', gap: 6, fontSize: 12, color: '#475467', lineHeight: 1.5 }}>
                            <div><strong>대출 기간</strong>: {item.term}</div>
                            <div><strong>신청 조건</strong>: {item.eligibility}</div>
                            <div><strong>필요 서류</strong>: {item.documents}</div>
                            <div><strong>신청 방법</strong>: {item.application}</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#0F172A' }}>
                        <TimerReset size={14} />
                        <span>한도/금리 업데이트는 매주 목요일에 동기화됩니다.</span>
                        <ArrowRightCircle size={14} color="#0055A0" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
          {workflows.length > 0 && (
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>진행 현황</h3>
                <p style={{ fontSize: 12, color: 'var(--app-text-secondary)' }}>Supabase 데이터 기준으로 자동 동기화됩니다.</p>
              </div>
              {workflows.map((workflow) => (
                <Card key={workflow.policy_id} style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{workflow.product?.name}</h4>
                      <span style={{ fontSize: 12, color: 'var(--app-text-secondary)' }}>{workflow.product?.limit_amount} · {workflow.product?.interest_rate}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: workflow.status_color,
                        background: `${workflow.status_color}22`,
                        borderRadius: 999,
                        padding: '4px 10px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {workflow.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#475467' }}>{workflow.notes || '메모 없음'}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>업데이트: {workflow.updated_at ? new Date(workflow.updated_at).toLocaleDateString() : '-'}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  </div>
  );
};

export const PolicyScreen = PolicyScreenComponent;
