export type ReviewSentimentLevel = "critical" | "caution" | "healthy";

export type ReviewProfile = {
  id: "red" | "yellow" | "green";
  label: string;
  title: string;
  sentiment: ReviewSentimentLevel;
  highlightColor: string;
  accentGradient: string;
  averageRating: number;
  reviewCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
  summary: string;
  action: string;
  supabaseUser?: string;
  sampleReviews: {
    rating: number;
    content: string;
    date?: string | null;
  }[];
};

export const reviewProfiles: ReviewProfile[] = [
  {
    id: "red",
    label: "빨강 유저",
    title: "딴딴 본점",
    sentiment: "critical",
    highlightColor: "#D92D20",
    accentGradient: "linear-gradient(135deg, rgba(217,45,32,0.12), rgba(217,45,32,0.04))",
    averageRating: 2.6,
    reviewCount: 25,
    positiveCount: 9,
    neutralCount: 2,
    negativeCount: 14,
    positiveKeywords: ["소스가", "탕수육", "가지튀김", "감사합니다"],
    negativeKeywords: ["소스도", "없고", "맛도", "맛이"],
    summary: "최근 한 달간 저평가 리뷰가 56%로 높습니다. 배달 품질과 소스 구성 관련 불만이 반복적으로 제기되고 있어 빠른 원인 파악이 필요합니다.",
    action: "문제 리뷰를 확인하고 조리 프로세스와 배달 파트너를 점검하세요.",
    sampleReviews: [
      {
        rating: 1,
        content:
          "왼쪽이 전에 시켜먹었던 거고 오른쪽이 이번에 시킨 거임. 매장에서 먹었던 거랑 다르게 너무 실망스러웠음.. 소스도 별로 없고 튀김옷은 다 젖어서 축축한데 느끼하기까지...",
        date: "지난 주, 알뜰배달, 수정됨",
      },
      {
        rating: 1,
        content: "지점마다 맛이 다르군요..ㅠㅠ",
        date: "지난 달, 알뜰배달",
      },
      {
        rating: 1,
        content:
          "정말 맛이없고 내용물이 국물빼고 들은게 없고 이렇게 맛없는 음식을 배달하다니 충격적이에요. 짬뽕이 짬뽕이 아니에요.",
        date: "지난 달, 알뜰배달",
      },
      {
        rating: 4,
        content:
          "내가 먹어본 유니짜장 중 고기가 제일 많이 들어있음. 탕수육 튀김옷이 얇아서 내 스타일인데 배달이 너무 늦음. 배달만 빨리오면 만점임.",
        date: "지난 달, 한집배달",
      },
      {
        rating: 1,
        content:
          "양도 무척 적고 서비스 기대 안했는데 탕수육 소스도 없고 단무지도 없네요. 이사집에 사준 건데 난감했어요.",
        date: "지난 달, 알뜰배달",
      },
    ],
  },
  {
    id: "yellow",
    label: "노랑 유저",
    title: "역전할머님맥주 보정점",
    sentiment: "caution",
    highlightColor: "#F5A623",
    accentGradient: "linear-gradient(135deg, rgba(245,166,35,0.16), rgba(245,166,35,0.06))",
    averageRating: 4.27,
    reviewCount: 30,
    positiveCount: 24,
    neutralCount: 1,
    negativeCount: 5,
    positiveKeywords: ["맛있게", "소스", "청양고추", "가격"],
    negativeKeywords: ["고구마", "냄새가", "상한", "하면서"],
    summary: "전반적으로 평가는 높지만 간헐적 품질 이슈(고구마 품질, 냄새)로 낮은 평점이 발생합니다. 반품 대응은 긍정적으로 평가받고 있습니다.",
    action: "문제 메뉴를 분류하고 원재료 입고 로트를 확인하세요.",
    sampleReviews: [
      {
        rating: 1,
        content: "덜 구워진건지… 색도 희여멀건하고 이상한 냄새가 너무 심해서 손도 못댔어요.",
        date: "지난 주, 알뜰배달",
      },
      {
        rating: 5,
        content: "바지락 해감이 조금 덜되서 아쉬웠어요. 먹태는 맛있습니다.",
        date: "지난 달, 한집배달",
      },
      {
        rating: 2,
        content:
          "고구마가 일부 상해서 쓴맛이 나요. 치킨은 오래된 군내가 납니다.",
        date: "지난 달, 알뜰배달, 수정됨",
      },
      {
        rating: 5,
        content:
          "문제 있었는데 빠르게 잘 처리해주시고 친절했어요. 맛있게 먹고 기분 좋은 저녁을 보냈습니다~",
        date: "지난 달, 한집배달",
      },
      {
        rating: 5,
        content: "서비스가 꼼꼼하고 청양고추 추가가 최고예요!",
        date: "지난 달, 한집배달",
      },
    ],
  },
  {
    id: "green",
    label: "초록 유저",
    title: "제육대가 수지점",
    sentiment: "healthy",
    highlightColor: "#2EAE4F",
    accentGradient: "linear-gradient(135deg, rgba(46,174,79,0.16), rgba(46,174,79,0.04))",
    averageRating: 4.98,
    reviewCount: 50,
    positiveCount: 50,
    neutralCount: 0,
    negativeCount: 0,
    positiveKeywords: ["맛있어요", "맛있게", "제육", "맛있습니다"],
    negativeKeywords: [],
    summary: "모든 리뷰가 5점 만점입니다. 불맛과 도착 속도에 대한 칭찬이 지속적으로 누적되고 있어 강점 유지 전략이 필요합니다.",
    action: "단골 확보를 위해 세트메뉴 업셀링 메시지를 자동 발송해보세요.",
    supabaseUser: "jin1ib@naver.com",
    sampleReviews: [
      {
        rating: 5,
        content: "불맛에 맵기도 적당하고 맛있어요! 쌈채소 추가해서 먹으니 더 좋아요.",
        date: "이번 주, 한집배달",
      },
      {
        rating: 5,
        content:
          "아기 때문에 배달로 주문했는데 14분 만에 왔어요. 따뜻하게 불맛 가득 제육볶음 먹었습니다.",
        date: "이번 주, 한집배달",
      },
      {
        rating: 5,
        content: "달큰하고 살짝 매워서 밥에 올려 먹으면 천국...",
        date: "지난 주, 알뜰배달",
      },
      {
        rating: 5,
        content: "분당점에서 먹다가 수지에서 시켰는데 역시 맛있습니다. 언제나 번창하세요!",
        date: "지난 달, 한집배달",
      },
      {
        rating: 5,
        content:
          "폭풍먹방하다가 리뷰 남겨요. 남편이 가게 이름 알려달라네요. 애들도 젓가락 쉴새 없이!",
        date: "지난 달, 가게배달",
      },
    ],
  },
];

export const reviewProfileMap = reviewProfiles.reduce<Record<string, ReviewProfile>>(
  (acc, profile) => {
    acc[profile.id] = profile;
    return acc;
  },
  {}
);
