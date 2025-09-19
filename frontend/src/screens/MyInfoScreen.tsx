import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

// shadcn/ui & lucide-react imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, LogOut, MapPin, Phone, Utensils, CreditCard, CheckCircle2, Smartphone } from 'lucide-react';

const palette = {
  primary: '#1E4F9E',
  sky: '#6FADE8',
  teal: '#2AA5A0',
  background: '#E7F2FF',
  surface: '#FFFFFF',
  text: '#123B70',
  subtext: '#42526E',
};

const ProfileDisplay = () => {
  const { currentUser, logout } = useAuth();
  const [syncStatus, setSyncStatus] = useState({ card: true, delivery: false, pos: false });

  if (!currentUser) {
    return <div>로그인된 사용자 정보가 없습니다.</div>;
  }

  const infoItems = [
    { icon: <Utensils size={18} />, label: "업종", value: currentUser.business_type ?? currentUser.industry },
    { icon: <MapPin size={18} />, label: "주소", value: currentUser.address },
    { icon: <Clock size={18} />, label: "영업시간", value: currentUser.business_hours },
    { icon: <Phone size={18} />, label: "전화번호", value: currentUser.phone_number },
  ];

  const SyncRow = ({ icon, title, description, isConnected, onToggle }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 20,
        background: '#FFFFFF',
        border: '1px solid rgba(174,197,232,0.4)',
        padding: 16,
        boxShadow: '0 10px 22px rgba(30,79,158,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: 12, borderRadius: 16, background: 'rgba(111,173,232,0.18)', color: palette.primary }}>{icon}</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: palette.text }}>{title}</p>
          <p style={{ fontSize: 11, color: palette.subtext }}>{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        style={{
          padding: '6px 12px',
          borderRadius: 12,
          border: isConnected ? '1px solid rgba(42,165,160,0.3)' : '1px solid rgba(30,79,158,0.2)',
          background: isConnected ? 'rgba(42,165,160,0.12)' : 'rgba(255,255,255,0.9)',
          color: isConnected ? palette.teal : '#1E4F9E',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          minWidth: 'fit-content',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isConnected ? 'rgba(42,165,160,0.2)' : 'rgba(30,79,158,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isConnected ? 'rgba(42,165,160,0.12)' : 'rgba(255,255,255,0.9)';
        }}
      >
        {isConnected ? (
          <>
            <CheckCircle2 className="w-4 h-4" /> 연동됨
          </>
        ) : (
          '연동하기'
        )}
      </button>
    </div>
  );

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Profile Card */}
      <div
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar className="w-16 h-16 border-2 border-white/70 shadow-lg">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.store_name}`} alt={currentUser.store_name} />
            <AvatarFallback className="text-xl">{(currentUser.store_name || ' ')[0]}</AvatarFallback>
          </Avatar>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: '#1E4F9E', fontWeight: 600, margin: 0 }}>사장님 프로필</p>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#123B70', margin: '4px 0 8px 0' }}>{currentUser.store_name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 12,
                padding: '4px 8px',
                borderRadius: 12,
                background: 'rgba(30,79,158,0.1)',
                color: '#1E4F9E',
                fontWeight: 600,
              }}>
                {currentUser.owner_name} 사장님
              </span>
              {currentUser.industry && (
                <span style={{
                  fontSize: 12,
                  padding: '4px 8px',
                  borderRadius: 12,
                  background: 'rgba(30,79,158,0.1)',
                  color: '#1E4F9E',
                  fontWeight: 600,
                }}>
                  {currentUser.industry}
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" style={{ color: '#1E4F9E' }} onClick={logout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ 
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(30,79,158,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 11, color: '#1E4F9E', fontWeight: 500, margin: '0 0 2px 0' }}>사업장 코드</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#123B70', margin: 0 }}>{currentUser.business_code || '연동 준비'}</p>
          </div>
          <div style={{ 
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(30,79,158,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 11, color: '#1E4F9E', fontWeight: 500, margin: '0 0 2px 0' }}>연결 상태</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#123B70', margin: 0 }}>{syncStatus.card ? '정상' : '확인 필요'}</p>
          </div>
          <div style={{ 
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(30,79,158,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 11, color: '#1E4F9E', fontWeight: 500, margin: '0 0 2px 0' }}>최근 로그인</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#123B70', margin: 0 }}>오늘</p>
          </div>
        </div>
      </div>


      {/* Tab Content */}
      <div style={{ display: 'grid', gap: 16 }}>
        {/* 가게 정보 섹션 */}
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#123B70' }}>기본 정보</h3>
            <span style={{ fontSize: 12, color: '#42526E' }}>SIGNAL이 분석에 활용하는 사업장 정보입니다.</span>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {infoItems.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(231,242,255,0.9), rgba(214,236,255,0.55))',
                  padding: '16px 20px',
                  border: '1px solid rgba(174,197,232,0.45)',
                  boxShadow: '0 4px 12px rgba(30,79,158,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: '#1E4F9E' }}>{item.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#123B70' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#123B70', maxWidth: '55%', textAlign: 'right' }}>
                  {item.value || '등록되지 않았습니다.'}
                </span>
              </div>
            ))}
          </div>
          <button
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(30,79,158,0.2)',
              color: '#1E4F9E',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30,79,158,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
            }}
          >
            가게 정보 수정
          </button>
        </div>

        {/* 데이터 연동 섹션 */}
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#123B70' }}>데이터 연동 현황</h3>
              <span style={{ fontSize: 12, color: '#42526E', marginTop: 4 }}>
                주요 채널을 연동하면 최신 데이터를 빠르게 확인할 수 있어요.
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <SyncRow
              icon={<CreditCard size={20} />}
              title="카드 매출"
              description="여신금융협회 API를 통해 매출 연동"
              isConnected={syncStatus.card}
              onToggle={() => setSyncStatus((s) => ({ ...s, card: !s.card }))}
            />
            <SyncRow
              icon={<Smartphone size={20} />}
              title="배달앱 매출"
              description="배달의민족, 요기요 등 채널을 일괄 연동"
              isConnected={syncStatus.delivery}
              onToggle={() => setSyncStatus((s) => ({ ...s, delivery: !s.delivery }))}
            />
            <SyncRow
              icon={<Building size={20} />}
              title="POS/키오스크"
              description="POS사 실시간 매출 연동"
              isConnected={syncStatus.pos}
              onToggle={() => setSyncStatus((s) => ({ ...s, pos: !s.pos }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyInfoScreen: React.FC = () => {
  return (
    <div
      className="h-full"
      style={{
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* Main Content */}
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
        <ProfileDisplay />
      </main>
    </div>
  );
};
