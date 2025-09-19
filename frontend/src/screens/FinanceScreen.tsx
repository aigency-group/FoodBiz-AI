import React, { useMemo, useState } from 'react';
import {
  Landmark,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  ClipboardList,
  TimerReset,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { usePolicyData, PolicyProduct } from '../hooks/usePolicy';

const palette = {
  primary: '#1E4F9E',
  sky: '#6FADE8',
  teal: '#2AA5A0',
  lilac: '#B4C9FF',
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

const groupStyles: Record<string, { icon: any; accent: string; tone: string }> = {
  policy: { icon: ShieldCheck, accent: 'linear-gradient(135deg, rgba(0,85,160,0.12), rgba(0,85,160,0.03))', tone: palette.primary },
  loan: { icon: Building2, accent: 'linear-gradient(135deg, rgba(12,138,226,0.12), rgba(12,138,226,0.04))', tone: palette.primary },
  savings: { icon: PiggyBank, accent: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))', tone: palette.teal },
  card: { icon: CreditCard, accent: 'linear-gradient(135deg, rgba(245,164,90,0.12), rgba(245,164,90,0.04))', tone: palette.sky },
};

const signalStatus = {
  진행중: { color: palette.primary, background: 'rgba(30,79,158,0.12)' },
  승인: { color: palette.teal, background: 'rgba(42,165,160,0.14)' },
  보류: { color: '#F5A45A', background: 'rgba(245,164,90,0.16)' },
  거절: { color: '#C63A3A', background: 'rgba(198,58,58,0.16)' },
  마감: { color: '#64748B', background: 'rgba(100,116,139,0.16)' },
};

const highlightOrder = ['policy', 'loan', 'savings', 'card'];

const FinanceScreenComponent: React.FC = () => {
  const { recommendations, workflows, productGroups, productsLoading } = usePolicyData();
  const [activeTab, setActiveTab] = useState('Signal');

  const groupedProducts = useMemo(() => {
    const map: Record<string, PolicyProduct[]> = {};
    productGroups.forEach((group) => {
      map[group.group_name] = group.products ?? [];
    });
    return map;
  }, [productGroups]);

  const highlightProducts = useMemo(() => {
    return highlightOrder
      .map((id) => (
        groupedProducts[id] && groupedProducts[id].length > 0
          ? { group: id, product: groupedProducts[id][0] }
          : null
      ))
      .filter((item): item is { group: string; product: PolicyProduct } => Boolean(item));
  }, [groupedProducts]);

  const renderFeatureChips = (features?: string[]) => {
    if (!features || features.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {features.slice(0, 4).map((feature) => (
          <span
            key={feature}
            style={{
              fontSize: 11,
              padding: '4px 8px',
              borderRadius: 999,
              background: 'rgba(30,79,158,0.08)',
              color: palette.primary,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: '1px solid rgba(30,79,158,0.14)',
            }}
          >
            {feature}
          </span>
        ))}
      </div>
    );
  };

  const renderProductCard = (product: PolicyProduct, groupId: string, index: number) => {
    const style = groupStyles[groupId] || groupStyles['policy'];
    const IconComponent = style.icon;
    return (
      <Card
        key={`${product.id}-${index}`}
        style={{
          padding: 16,
          borderRadius: 18,
          border: '1px solid rgba(174,197,232,0.35)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(231,242,255,0.6))',
          display: 'grid',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: style.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {IconComponent && <IconComponent size={20} color={style.tone} />}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: palette.text,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.name}
              </h4>
            </div>
            <div style={{ fontSize: 12, color: palette.subtext, lineHeight: 1.4 }}>
              {product.term || '상담 시 협의'}
            </div>
          </div>
          <div
            style={{
              minWidth: 110,
              borderRadius: 12,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(30,79,158,0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 12, color: palette.text, fontWeight: 600 }}>{product.limit_amount || '상담 후 결정'}</div>
            <div style={{ fontSize: 13, color: '#10B981', fontWeight: 700 }}>{product.interest_rate || '-'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {product.eligibility && (
            <div style={{ fontSize: 12, color: palette.subtext, lineHeight: 1.6 }}>
              <strong style={{ color: palette.primary }}>자격</strong> {product.eligibility}
            </div>
          )}
          {renderFeatureChips(product.features)}
        </div>

        {product.application_method && (
          <div style={{ fontSize: 11, color: '#617EA3', lineHeight: 1.4 }}>
            신청 방법: {product.application_method}
          </div>
        )}
      </Card>
    );
  };

  const renderSkeleton = () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {[0, 1].map((key) => (
        <Card
          key={key}
          style={{
            height: 120,
            borderRadius: 16,
            background: 'linear-gradient(90deg, rgba(237,242,247,0.6), rgba(221,231,246,0.6))',
            animation: 'pulse 1.4s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );

  const renderGroupSection = (groupId: string) => {
    if (productsLoading) {
      return renderSkeleton();
    }
    const products = groupedProducts[groupId] ?? [];
    if (!products.length) {
      return (
        <Card
          style={{
            padding: 20,
            borderRadius: 18,
            border: '1px solid rgba(174,197,232,0.45)',
            background: 'linear-gradient(135deg, rgba(231,242,255,0.7), rgba(255,255,255,0.9))',
          }}
        >
          <div style={{ fontSize: 13, color: palette.subtext }}>아직 등록된 상품이 없습니다. 다른 분류를 확인하거나 담당자에게 최신 상품을 요청해 보세요.</div>
        </Card>
      );
    }
    return (
      <section style={{ display: 'grid', gap: 12 }}>
        {products.map((product, index) => renderProductCard(product, groupId, index))}
      </section>
    );
  };

  const renderSignalTab = () => (
    <section style={{ display: 'grid', gap: 20 }}>
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
        <div style={{ position: 'absolute', top: 20, right: 20, padding: '8px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,79,158,0.2)', fontSize: 12, fontWeight: 600, color: '#1E4F9E', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /> 실시간 링크 · 완료
        </div>
        <div style={{ display: 'grid', gap: 12, maxWidth: '95%' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1E4F9E', letterSpacing: 1 }}>SIGNAL FINANCE</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#123B70', lineHeight: 1.2 }}>개인사업자 솔루션</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <p style={{ fontSize: 14, color: '#123B70', lineHeight: 1.5, margin: 0 }}>매출·원가·리뷰 데이터를 바탕으로 대출과 수신 상품을 큐레이션합니다.</p>
            <p style={{ fontSize: 14, color: '#123B70', lineHeight: 1.5, margin: 0 }}>필요한 자금과 납입 계획을 시그널로 확인하세요.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {highlightProducts.map(({ group, product }) => (
            <Card key={product.id} style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(30,79,158,0.12)', boxShadow: '0 4px 12px rgba(30,79,158,0.06)', background: 'rgba(255,255,255,0.92)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: groupStyles[group]?.tone || palette.primary }}>{tabs.find((tab) => tab.id === group)?.label}</span>
              <strong style={{ fontSize: 16, color: palette.text, marginTop: 8, display: 'block' }}>{product.name}</strong>
              <div style={{ fontSize: 12, color: palette.subtext, marginTop: 4 }}>{product.limit_amount} · {product.interest_rate}</div>
            </Card>
          ))}
        </div>
      </Card>

      <section style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: palette.text }}>추천 상품</h3>
          <span style={{ fontSize: 12, color: palette.subtext }}>{recommendations.length}건</span>
        </div>
        {recommendations.length ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {recommendations.map((item, index) => (
              <Card key={item.policy_id || index} style={{ padding: 16, borderRadius: 18, background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(231,242,255,0.6))', border: '1px solid rgba(174,197,232,0.35)', display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: palette.text }}>{item.name}</h4>
                    <span style={{ fontSize: 12, color: palette.subtext }}>{item.limit_amount} · {item.interest_rate}</span>
                  </div>
                  {item.priority && (
                    <span style={{ fontSize: 11, color: '#1E4F9E', fontWeight: 600 }}>우선순위 {item.priority}</span>
                  )}
                </div>
                {item.eligibility && <div style={{ fontSize: 12, color: palette.subtext }}>자격: {item.eligibility}</div>}
                {renderFeatureChips(item.features)}
              </Card>
            ))}
          </div>
        ) : (
          renderSkeleton()
        )}
      </section>
    </section>
  );

  const renderContent = () => {
    if (activeTab === 'Signal') {
      return renderSignalTab();
    }
    return renderGroupSection(activeTab);
  };

  return (
    <div className="h-full" style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--app-white)', padding: '16px 20px 0', borderBottom: '1px solid rgba(174, 197, 232, 0.2)' }}>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
              }}
            >
              <span style={{ fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? '#000000' : '#8E8E93' }}>{tab.label}</span>
              {activeTab === tab.id && (
                <div style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)', width: '80%', height: 3, background: '#000000', borderRadius: 2 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <main style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {renderContent()}

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
                  <TimerReset size={16} /> 아직 진행 중인 금융 상품이 없어요.
                </div>
                <p style={{ fontSize: 12, color: palette.subtext, lineHeight: 1.6 }}>
                  추천 리스트에서 상품을 선택하면 SIGNAL이 서류 체크리스트와 진행 단계를 자동으로 업데이트합니다. 선택 즉시 초록/주황/빨강 신호로 상태를 알려드려요.
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
