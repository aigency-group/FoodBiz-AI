-- Seed data for three demo users/businesses

-- Business records
insert into public.businesses (id, owner_id, name, business_code, industry, region)
values
  ('11111111-1111-1111-1111-111111111111', null, '딴딴 본점', 'RED-001', '중식당', '서울'),
  ('22222222-2222-2222-2222-222222222222', null, '역전할머님맥주 보정점', 'YEL-001', '주점', '용인'),
  ('33333333-3333-3333-3333-333333333333', null, '제육대가 수지점', 'GRN-001', '한식', '수지')
  on conflict (business_code) do nothing;

-- Example metrics (replace owner_id once auth.users rows exist)
insert into public.metrics_daily (business_id, metric_date, gross_sales, net_sales, cost_of_goods, tax_amount, settlement_delay_count)
values
  ('11111111-1111-1111-1111-111111111111', current_date - interval '3 days', 2500000, 2100000, 1300000, 150000, 4),
  ('11111111-1111-1111-1111-111111111111', current_date - interval '2 days', 2700000, 2300000, 1400000, 160000, 5),
  ('11111111-1111-1111-1111-111111111111', current_date - interval '1 days', 1900000, 1600000, 1200000, 120000, 6),
  ('22222222-2222-2222-2222-222222222222', current_date - interval '3 days', 1800000, 1500000, 900000, 100000, 1),
  ('22222222-2222-2222-2222-222222222222', current_date - interval '2 days', 2000000, 1700000, 950000, 110000, 2),
  ('22222222-2222-2222-2222-222222222222', current_date - interval '1 days', 2100000, 1800000, 980000, 110000, 2),
  ('33333333-3333-3333-3333-333333333333', current_date - interval '3 days', 3200000, 2900000, 1500000, 200000, 0),
  ('33333333-3333-3333-3333-333333333333', current_date - interval '2 days', 3400000, 3000000, 1550000, 210000, 0),
  ('33333333-3333-3333-3333-333333333333', current_date - interval '1 days', 3600000, 3200000, 1600000, 220000, 0)
  on conflict do nothing;

-- Sample reviews
insert into public.reviews (business_id, rating, content, source, reviewed_at)
values
  ('11111111-1111-1111-1111-111111111111', 1.0, '소스도 없고 배달이 너무 늦어요.', '배달앱', now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111111', 4.0, '맛은 좋은데 대기가 길어요.', '배달앱', now() - interval '2 days'),
  ('22222222-2222-2222-2222-222222222222', 5.0, '친절하고 안주가 신선합니다.', '배달앱', now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', 2.0, '고구마가 상해서 아쉬웠어요.', '배달앱', now() - interval '3 days'),
  ('33333333-3333-3333-3333-333333333333', 5.0, '불맛 최고! 재주문 의사 100%', '배달앱', now() - interval '1 day')
  on conflict do nothing;

-- Policy product examples
insert into public.policy_products (id, name, group_name, limit_amount, interest_rate, term, eligibility, documents, application_method)
values
  ('44444444-4444-4444-4444-444444444444', '우리 사잇돌 중금리대출', '우리은행 상품 그룹', '최대 2천만원', '연 6.0% ~ 9.0%', '최장 5년', '연소득 1,500만원 이상, NICE 475점 이상', '신분증, 소득금액증명, 4대보험 가입내역', '영업점 방문 → 보증 연계'),
  ('55555555-5555-5555-5555-555555555555', '위비 SOHO 모바일 신용대출', '우리은행 상품 그룹', '최대 3천만원', '연 5.5% ~ 8.5%', '최장 5년', '비씨카드 가맹점 1년 이상', '모바일 전자동의, 가맹점 매출 내역', 'WON뱅킹 즉시 실행'),
  ('66666666-6666-6666-6666-666666666666', '소상공인 정책자금', '정책자금 그룹', '최대 7천만원', '연 1.8% 고정', '최장 5년', '창업 7년 이내 소상공인', '사업계획서, 매출증빙', '정책자금 시스템 신청')
  on conflict (id) do nothing;

-- Recommendations & workflow samples
insert into public.policy_recommendations (business_id, policy_id, rationale, priority)
values
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '배달 매출 감소에 따른 운영자금 보강 필요', 1),
  ('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '모바일 간편 대출로 야간 영업 재료비 확보', 2),
  ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '확장 오픈을 위한 시설자금 검토', 1)
  on conflict do nothing;

insert into public.policy_applications (business_id, policy_id, status, notes)
values
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '보류', '보증심사 대기 중'),
  ('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '진행중', '서류 검토 중'),
  ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '승인', '시설 확장자금 집행 준비')
  on conflict do nothing;

