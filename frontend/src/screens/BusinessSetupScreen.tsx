import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type Props = {
  onComplete?: () => void;
};

export const BusinessSetupScreen: React.FC<Props> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const [storeName, setStoreName] = useState(currentUser?.store_name || "");
  const [businessCode, setBusinessCode] = useState("");
  const [industry, setIndustry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser?.id) {
      setMessage('로그인 정보가 확인되지 않았습니다. 다시 로그인해 주세요.');
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_URL}/business/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_id: currentUser.id, store_name: storeName, business_code: businessCode, industry }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || '사업장 정보를 저장하지 못했습니다.');
      }
      setMessage('사업장 정보가 저장되었습니다. 데이터 동기화까지 최대 1~2일 소요될 수 있어요.');
      onComplete?.();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-sm">
        <h1 className="text-xl font-bold text-center">사업장 정보 등록</h1>
        <p className="text-sm text-gray-500 text-center">
          홈택스 데이터는 1~2일 지연되어 반영될 수 있어요. 기본 사업장 정보를 입력해 주세요.
        </p>
        <input
          value={storeName}
          onChange={(event) => setStoreName(event.target.value)}
          placeholder="가게 상호"
          required
          className="w-full p-3 bg-gray-100 rounded-lg"
        />
        <input
          value={businessCode}
          onChange={(event) => setBusinessCode(event.target.value)}
          placeholder="사업장 코드"
          required
          className="w-full p-3 bg-gray-100 rounded-lg"
        />
        <input
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          placeholder="업종"
          className="w-full p-3 bg-gray-100 rounded-lg"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold"
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '사업장 연결하기'}
        </button>
        {message && <p className="text-sm text-center text-blue-600">{message}</p>}
      </form>
    </div>
  );
};
