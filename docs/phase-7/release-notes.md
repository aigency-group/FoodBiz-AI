# Release Notes v0.1.0

**Release Date:** 2025-09-08  
**Version:** 0.1.0  
**Status:** Initial Release

## 🎉 Overview

FoodBiz-AI v0.1.0은 소상공인을 위한 AI 기반 금융 서비스 웹 애플리케이션의 첫 번째 릴리즈입니다. 이 버전에서는 핵심 기능들이 구현되어 사용자가 AI 챗봇을 통해 정책 정보를 조회하고, 실시간 알림을 받으며, 대시보드를 통해 비즈니스 지표를 모니터링할 수 있습니다.

## ✨ New Features

### 🔐 Authentication & Security
- **Supabase 기반 사용자 인증**: 이메일/비밀번호 회원가입 및 로그인
- **JWT 토큰 기반 세션 관리**: 안전한 API 접근 제어
- **CORS 설정**: 프론트엔드와의 안전한 통신

### 🤖 AI Chat & RAG System
- **실시간 AI 챗봇**: WebSocket을 통한 스트리밍 응답
- **RAG (Retrieval-Augmented Generation)**: 정책 문서 기반 정확한 답변 제공
- **출처 정보 제공**: 답변의 신뢰성을 높이는 소스 문서 표시
- **LangChain 기반**: OpenAI GPT-4 모델 활용

### 📊 Dashboard & Monitoring
- **KPI 대시보드**: 매출, 원가, 순이익 등 핵심 지표 시각화
- **시그널 인덱스**: 초록/주황/빨강 신호로 비즈니스 상태 표시
- **업종 평균 비교**: 업계 대비 성과 분석

### 🔔 Real-time Alerts
- **SSE (Server-Sent Events)**: 실시간 알림 수신
- **인앱 알림함**: 중요 이벤트 및 경고 메시지 표시

### 📱 Mobile-First Design
- **반응형 UI**: 모바일 우선 설계
- **iOS Safari 최적화**: 키보드 및 safe-area 대응
- **Tailwind CSS**: 현대적이고 일관된 디자인 시스템

## 🛠 Technical Stack

### Backend
- **FastAPI**: 고성능 Python 웹 프레임워크
- **Supabase**: 인증, 데이터베이스, 스토리지
- **LangChain**: RAG 파이프라인 구현
- **WebSocket**: 실시간 통신
- **OpenAI GPT-4**: AI 모델

### Frontend
- **React 18**: 사용자 인터페이스
- **Vite**: 빠른 개발 및 빌드 도구
- **TypeScript**: 타입 안전성
- **Radix UI**: 접근성 우선 컴포넌트
- **Recharts**: 데이터 시각화

## 📋 API Endpoints

### Authentication
- `POST /auth/signup` - 사용자 회원가입
- `POST /auth/token` - 로그인 및 토큰 발급

### Core Services
- `GET /health` - 서비스 상태 확인
- `POST /rag/query` - AI 챗봇 질의응답
- `WebSocket /ws/chat` - 실시간 채팅
- `GET /alerts/sse` - 실시간 알림 스트림

## 🗄 Database Schema

### Core Tables
- `users` - 사용자 정보
- `documents` - 업로드된 문서 메타데이터
- `document_chunks` - RAG용 문서 청크
- `daily_sales` - 일일 매출 데이터
- `daily_costs` - 일일 원가 데이터
- `settlement_delays` - 정산 지연 추적

## 🔧 Configuration

### Environment Variables
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Server
CORS_ORIGINS=http://localhost:5173
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase 계정
- OpenAI API 키

### Installation

1. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Frontend Setup**
```bash
cd frontend
npm install
```

3. **Environment Configuration**
```bash
# backend/.env 파일 생성
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. **Run Development Servers**
```bash
# Backend (Terminal 1)
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate
PYTHONPATH=/path/to/project python -m pytest tests/ -v
```

### Test Coverage
- ✅ Authentication flows
- ✅ RAG query processing
- ✅ WebSocket connections
- ✅ SSE alert streams
- ✅ Error handling

## 📈 Performance Metrics

- **API Response Time**: < 500ms (평균)
- **WebSocket Latency**: < 100ms
- **SSE Event Delivery**: < 200ms
- **Bundle Size**: < 2MB (프론트엔드)

## 🔒 Security Features

- JWT 토큰 기반 인증
- CORS 정책 적용
- PII 데이터 마스킹
- 레이트 리미팅 (구현 예정)
- 입력 검증 및 샌이타이제이션

## 🐛 Known Issues

1. **WebSocket 재연결**: 네트워크 끊김 시 자동 재연결 로직 개선 필요
2. **에러 메시지**: 일부 에러 상황에서 사용자 친화적 메시지 개선 필요
3. **모바일 키보드**: iOS에서 키보드 팝업 시 레이아웃 조정 개선 필요

## 🚧 Roadmap

### v0.2.0 (예정)
- [ ] 고급 분석 대시보드
- [ ] 정책 추천 엔진
- [ ] 데이터 내보내기 기능
- [ ] 다국어 지원

### v0.3.0 (예정)
- [ ] 모바일 앱 (React Native)
- [ ] 오프라인 모드
- [ ] 고급 알림 설정
- [ ] 사용자 권한 관리

## 👥 Team

- **PM**: 프로젝트 오케스트레이션 및 문서화
- **Frontend Engineer**: React UI/UX 개발
- **Backend Engineer**: FastAPI 서버 개발
- **Data Scientist**: KPI 및 시그널 로직 설계
- **AI Engineer**: RAG 파이프라인 구현
- **QA Engineer**: 테스트 시나리오 및 품질 보증

## 📞 Support

- **Documentation**: `/docs` 폴더 참조
- **API Docs**: `http://localhost:8000/docs` (개발 서버 실행 시)
- **Issues**: GitHub Issues를 통한 버그 리포트

---

**FoodBiz-AI v0.1.0** - 소상공인의 성공을 위한 AI 파트너
