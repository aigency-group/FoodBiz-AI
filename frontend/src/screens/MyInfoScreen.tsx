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

  const SyncRow = ({ icon, title, description, isConnected, onConnect }) => (
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
      {isConnected ? (
        <Badge
          variant="secondary"
          style={{
            background: 'rgba(42,165,160,0.12)',
            color: palette.teal,
            borderColor: 'rgba(42,165,160,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 className="w-4 h-4" /> 연동됨
        </Badge>
      ) : (
        <Button variant="outline" size="sm" onClick={onConnect} className="border-slate-200 text-blue-600">
          연동하기
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div
        className="relative overflow-hidden rounded-3xl shadow-xl"
        style={{
          background: 'linear-gradient(140deg, rgba(30,79,158,0.92), rgba(111,173,232,0.72))',
          color: '#fff',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top, rgba(255,255,255,0.25), transparent 55%)' }} />
        <div className="relative flex flex-col gap-5 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/70 shadow-lg">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.store_name}`} alt={currentUser.store_name} />
              <AvatarFallback className="text-xl">{(currentUser.store_name || ' ')[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm opacity-90">사장님 프로필</p>
              <h2 className="text-2xl font-bold">{currentUser.store_name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="border-white/40 bg-white/20 text-white">
                  {currentUser.owner_name} 사장님
                </Badge>
                {currentUser.industry && <Badge className="border-white/30 bg-white/15 text-white">{currentUser.industry}</Badge>}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 16, padding: '12px 16px' }}>
              <p className="opacity-90">사업장 코드</p>
              <p className="text-lg font-semibold">{currentUser.business_code || '연동 준비'}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 16, padding: '12px 16px' }}>
              <p className="opacity-90">연결 상태</p>
              <p className="text-lg font-semibold">{syncStatus.card ? '정상' : '확인 필요'}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 16, padding: '12px 16px' }}>
              <p className="opacity-90">최근 로그인</p>
              <p className="text-lg font-semibold">오늘</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 h-auto rounded-xl" style={{ background: 'rgba(174,197,232,0.3)' }}>
          <TabsTrigger value="info" className="rounded-lg text-sm font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600">가게 정보</TabsTrigger>
          <TabsTrigger value="sync" className="rounded-lg text-sm font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600">데이터 연동</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-4">
          <Card className="shadow-md border border-blue-100" style={{ background: '#FFFFFF' }}>
            <CardHeader className="pb-2">
              <CardTitle style={{ color: palette.text }}>기본 정보</CardTitle>
              <CardDescription style={{ color: palette.subtext }}>SIGNAL이 분석에 활용하는 사업장 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 18,
                    background: palette.background,
                    padding: '12px 16px',
                    border: '1px solid rgba(174,197,232,0.4)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: palette.subtext }}>
                    <div style={{ color: palette.primary }}>{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: palette.text, maxWidth: '55%', textAlign: 'right' }}>
                    {item.value || '등록되지 않았습니다.'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full mt-4 bg-white shadow-sm">가게 정보 수정</Button>
        </TabsContent>
        <TabsContent value="sync" className="mt-4">
          <Card className="shadow-md border border-blue-100" style={{ background: '#FFFFFF' }}>
            <CardHeader>
              <CardTitle style={{ color: palette.text }}>데이터 연동 현황</CardTitle>
              <CardDescription style={{ color: palette.subtext }}>주요 채널을 연동하면 홈택스 지연이 있어도 최신 데이터를 빠르게 확인할 수 있어요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SyncRow
                icon={<CreditCard size={20} />}
                title="카드 매출"
                description="여신금융협회 API를 통해 일별 매출을 수집합니다"
                isConnected={syncStatus.card}
                onConnect={() => setSyncStatus((s) => ({ ...s, card: true }))}
              />
              <SyncRow
                icon={<Smartphone size={20} />}
                title="배달앱 매출"
                description="배달의민족, 요기요 등 채널을 한 번에 연동합니다"
                isConnected={syncStatus.delivery}
                onConnect={() => setSyncStatus((s) => ({ ...s, delivery: true }))}
              />
              <SyncRow
                icon={<Building size={20} />}
                title="POS/키오스크"
                description="POS사 실시간 매출을 자동으로 불러옵니다"
                isConnected={syncStatus.pos}
                onConnect={() => setSyncStatus((s) => ({ ...s, pos: true }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const MyInfoScreen: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: palette.background, paddingBottom: 80 }}>
      <div style={{ background: '#FFFFFF', boxShadow: '0 6px 18px rgba(30,79,158,0.08)', borderBottom: '1px solid rgba(174,197,232,0.35)' }}>
        <div className="px-6 py-4 flex justify-center relative">
          <h1 style={{ fontSize: 18, fontWeight: 700, color: palette.text }}>내 정보</h1>
        </div>
      </div>
      <main className="p-4">
        <ProfileDisplay />
      </main>
    </div>
  );
};
