# FoodBiz-AI v0.1.0

소상공인 상생 AI 금융 서비스 웹앱

## 🎉 Release Status

**현재 버전:** v0.1.0 (Initial Release)  
**배포 상태:** Production Ready  
**마지막 업데이트:** 2025-09-08

### 주요 기능
- 🤖 **AI 챗봇**: RAG 기반 정책 정보 조회 및 상담
- 📊 **대시보드**: KPI 시각화 및 시그널 인덱스
- 🔔 **실시간 알림**: SSE 기반 중요 이벤트 알림
- 📱 **모바일 최적화**: iOS Safari 포함 반응형 디자인
- 🔐 **보안**: Supabase 기반 인증 및 JWT 토큰

## Project Structure

- `frontend/`: Vite + React (TypeScript) frontend application.
- `backend/`: FastAPI (Python) backend application.
- `docs/`: Project documentation, organized by development phase.
- `data/`: Data for the AI RAG service.

## Getting Started

### Prerequisites

- Node.js and npm (for frontend)
- Python 3.9+ and pip (for backend)

### 1. Environment Variables

This project uses `.env` files to manage environment variables.

1.  **Backend:** Create a `.env` file in the `backend/` directory by copying the example file:
    ```bash
    cp backend/.env.example backend/.env
    ```
    Update `backend/.env` with your Supabase and OpenAI API keys.

2.  **Frontend:** Create a `.env` file in the `frontend/` directory:
    ```bash
    cp frontend/.env.example frontend/.env
    ```
    The default `VITE_API_URL` is `http://localhost:8000`, which should work with the default backend setup.

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the development server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running at `http://localhost:8000`.

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173` (or another port if 5173 is busy).

## 📚 Documentation

### Phase별 산출물
- **Phase 1**: 환경 설정 및 기반 구축 (`docs/phase-1/`)
- **Phase 2**: API 계약 및 인증 (`docs/phase-2/`)
- **Phase 3**: RAG 파이프라인 (`docs/phase-3/`)
- **Phase 4**: 실시간 채팅 및 알림 (`docs/phase-4/`)
- **Phase 5**: 대시보드 및 시그널 (`docs/phase-5/`)
- **Phase 6**: QA 및 테스트 (`docs/phase-6/`)
- **Phase 7**: 릴리즈 및 운영 (`docs/phase-7/`)

### 주요 문서
- [릴리즈노트](docs/phase-7/release-notes.md) - v0.1.0 기능 및 변경사항
- [운영 체크리스트](docs/phase-7/ops-checklist.md) - 배포 및 운영 가이드
- [API 문서](http://localhost:8000/docs) - FastAPI 자동 생성 문서 (개발 서버 실행 시)

## 🧪 Testing

### 백엔드 테스트
```bash
cd backend
source venv/bin/activate
PYTHONPATH=/path/to/project python -m pytest tests/ -v
```

### 테스트 커버리지
- ✅ 인증 시스템 (회원가입, 로그인, JWT)
- ✅ RAG 쿼리 처리 (정상, 에러, 경계값)
- ✅ WebSocket 연결 (스트리밍, 재연결)
- ✅ SSE 알림 (실시간 이벤트)

## 🚀 Quick Start

1. **환경 변수 설정**
   ```bash
   # backend/.env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

2. **백엔드 실행**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```

3. **프론트엔드 실행**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **접속**
   - 프론트엔드: http://localhost:5173
   - 백엔드 API: http://localhost:8000
   - API 문서: http://localhost:8000/docs

## 📞 Support

- **문서**: `/docs` 폴더 참조
- **이슈**: GitHub Issues를 통한 버그 리포트
- **기술 지원**: 개발팀 문의
