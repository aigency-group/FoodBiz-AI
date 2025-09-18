export interface User {
  id: number;
  email: string;
  password; // WARNING: Do not use in production. This is for hardcoded example only.
  name: string;
  propensity: 'marketing' | 'reviews' | 'metrics';
  prompt: string;
}

export const users: User[] = [
  {
    id: 1,
    email: 'marketer@foodbiz.ai',
    password: 'password1',
    name: '김마케터',
    propensity: 'marketing',
    prompt: '고객 리뷰를 기반으로 감성적인 마케팅 문구를 생성해줘. 할인 행사와 연결하면 좋겠어.',
  },
  {
    id: 2,
    email: 'reviewer@foodbiz.ai',
    password: 'password2',
    name: '박리뷰',
    propensity: 'reviews',
    prompt: '최근 부정적인 리뷰들을 요약하고, 가장 시급하게 개선해야 할 점 3가지를 알려줘.',
  },
  {
    id: 3,
    email: 'analyzer@foodbiz.ai',
    password: 'password3',
    name: '이분석',
    propensity: 'metrics',
    prompt: '지난 주 대비 방문자 수, 주문 수, 평균 주문 금액의 변화를 분석하고, 특이사항이 있다면 보고해줘.',
  },
];
