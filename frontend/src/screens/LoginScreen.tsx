import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingLogo } from "../components/FloatingLogo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LoginForm = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(email, password);
    if (!success) {
      setError("이메일 또는 비밀번호가 올바르지 않거나, 이메일 인증이 필요합니다.");
    }
    // On success, the parent component will handle the redirect
  };

  return (
    <Card className="border-none shadow-none w-full max-w-sm">
      <CardHeader><CardTitle className="text-center text-2xl">로그인</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required className="p-3 bg-gray-100 rounded-lg border-none w-full" />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required className="p-3 bg-gray-100 rounded-lg border-none w-full" />
          <Button type="submit" size="lg" className="mt-2">로그인</Button>
          {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          <p className="text-sm text-center mt-4 text-gray-600">
            계정이 없으신가요? <button type="button" onClick={onSwitchToRegister} className="text-blue-600 font-semibold hover:underline">회원가입</button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    owner_name: '',
    store_name: '',
    business_code: '',
    industry: '',
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          profile: {
            owner_name: formData.owner_name,
            store_name: formData.store_name,
            business_code: formData.business_code,
            industry: formData.industry,
          }
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "회원가입 실패");
      setMessage("회원가입 성공! 이메일 인증 후 로그인해주세요.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="border-none shadow-none w-full max-w-sm">
      <CardHeader><CardTitle className="text-center text-2xl">회원가입</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <input name="email" type="email" placeholder="이메일" onChange={handleChange} required className="p-3 bg-gray-100 rounded-lg border-none" />
            <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required className="p-3 bg-gray-100 rounded-lg border-none" />
            <input name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} required className="p-3 bg-gray-100 rounded-lg border-none" />
            <input name="owner_name" placeholder="사장님 이름" onChange={handleChange} required className="p-3 bg-gray-100 rounded-lg border-none" />
            <input name="store_name" placeholder="가게 상호" onChange={handleChange} required className="p-3 bg-gray-100 rounded-lg border-none" />
            <input name="business_code" placeholder="사업장 코드" onChange={handleChange} required className="p-3 bg-gray-100 rounded-lg border-none" />
            <input name="industry" placeholder="업종" onChange={handleChange} className="p-3 bg-gray-100 rounded-lg border-none" />
            <Button type="submit" size="lg" className="mt-2">회원가입</Button>
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
            {message && <p className="text-green-500 text-xs mt-2 text-center">{message}</p>}
            <p className="text-sm text-center mt-4 text-gray-600">
              이미 계정이 있으신가요? <button type="button" onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline">로그인</button>
            </p>
        </form>
      </CardContent>
    </Card>
  );
};

export const LoginScreen: React.FC = () => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    return (
        <div
          className="w-full h-full flex flex-col items-center"
          style={{
            background: "linear-gradient(180deg, rgba(30,79,158,0.12) 0%, rgba(231,242,255,0.9) 45%, #FFFFFF 100%)",
            position: "relative",
            padding: 24,
          }}
        >
            <div style={{ position: "absolute", top: 56 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "18px 26px",
                  borderRadius: 28,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(231,242,255,0.52))",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 20px 46px rgba(30, 79, 158, 0.18)",
                }}
              >
                <FloatingLogo />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 16, color: "var(--app-primary)", fontWeight: 800, letterSpacing: 1 }}>우리은행 SIGNAL</span>
                  <span style={{ fontSize: 13, color: "var(--app-text-primary)", fontWeight: 600 }}>소상공인 경영 시그널 허브</span>
                  <span style={{ fontSize: 11, color: "var(--app-text-secondary)" }}>우리은행 파스텔 무드에서 매출과 리뷰 흐름을 한눈에 받아보세요.</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 220, width: "100%", display: "flex", justifyContent: "center" }}>
              {authMode === 'login' ? (
                  <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
              ) : (
                  <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
        </div>
    )
}
