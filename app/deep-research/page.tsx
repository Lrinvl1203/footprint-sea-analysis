'use client';
import { useState } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────
// 2026년 제조업 통용 환율 (Manufacturing Consensus)
// ─────────────────────────────────────────────────────────────
const FX = { KRW: 1380, MXN: 19.5, VND: 25500, THB: 34.5, IDR: 16500, INR: 84 };

// ─────────────────────────────────────────────────────────────
// 국가 데이터
// ─────────────────────────────────────────────────────────────
const COUNTRIES_DR = [
  {
    code: 'KR', flag: '🇰🇷', nameKo: '한국', city: '창원 / 울산', color: '#ef4444',
    zone: '창원국가산업단지 / 울산미포국가산업단지',
    cityReason: '창원: 한국 최대 기계·중공업 클러스터(기업 4,000+). 두산밥캣, LS일렉트릭, 현대로템 등 집적. 울산: 현대중공업·현대자동차 메가클러스터, 항만(울산항) 인접.',
    labor: {
      minMonthly: '₩2,096,270', minHourly: '$7.27', actualMfgHourly: '$11.09',
      welderSkilled: '$14–18/hr', welderPremium: '55–65% over min', welderDifficulty: '🔴 매우 어려움',
      mfgWorkerDifficulty: '🔴 어려움', painterDifficulty: '🔴 어려움',
      fringe: '11.6%', supervisorUSD: '$2,754/mo', plantMgrUSD: '$6,522/mo',
      notes: '숙련 용접공 평균 연령 52세. 외국인(E-9) 의존도 증가. 창원 기계산업 특성상 숙련공 프리미엄 50% 이상.',
    },
    infra: {
      electricityUSD: '$0.126/kWh', waterUSD: '$0.565/m³', gasUSD: '$20.29/MMBtu',
      powerStability: '✅ 최우수 (정전 연 10시간 미만)',
      electricitySource: 'KEPCO 산업용(을류) TOU 요금제',
    },
    port: { name: '부산 신항 (Busan New Port)', distanceKm: 55, transportUSD: '$28.9/편도', stability: '9.5/10', teu: '연간 2,330만 TEU (2024)' },
    land: { leaseUSD: '$13.0/m²/yr', constructionUSD: '$471/m²', leaseTerm: '국가산단 20년 장기임대' },
    permits: {
      months: 18, difficulty: '중', wbRank: '#5',
      incentives: ['외투지역 법인세 5년 100% + 3년 50% 감면', '스마트팩토리 설비투자 세액공제 10–15%', '창원·울산 지자체 고용보조금', 'KEPCO 산업용 심야전력 요금 할인'],
      risks: ['EIA(환경영향평가) 5만m² 이상 필수 → 6–12개월 추가', 'CFE 동등 이슈 없음. 전력 연결 3–6개월', '외국인 토지 취득 절차 (산업부 신고)'],
      lcrRequirement: '없음',
    },
    steel: { availability: '✅ 매우 좋음', price: '$565/ton', lead: '5일', producers: ['POSCO (포항/광양, 3,800만t/yr)', 'Hyundai Steel (당진/인천)', 'Dongkuk (인천/부산)'] },
    competitors: [
      { name: '두산밥캣 지게차', city: '군산', capacity: '3.5만대/yr', automation: '고 (FANUC 로봇용접, AGV)' },
      { name: '현대두산인프라코어 지게차', city: '군산', capacity: '4.5만대/yr', automation: '고 (스마트팩토리 인증)' },
      { name: '클락 MHC 창원', city: '창원', capacity: '3만대/yr', automation: '중' },
    ],
    manufacturingCostUSD: 18500,
    overallScore: '★★★☆☆',
    opportunity: '세계 최고 수준 공급망·기술 인프라·전기지게차 전환 리더십',
    risk: '최고 노무비·대지비·극심한 인력난',
    sources: [
      { org: 'Minimum Wage Council, Korea', url: 'https://www.minimumwage.go.kr/english/', quote: 'The minimum hourly wage for 2025 is KRW 10,030.' },
      { org: 'KEPCO', url: 'https://home.kepco.co.kr/kepco/EF/main.do', quote: 'Industrial electricity rates (을류) apply TOU structure.' },
      { org: 'KOTRA InvestKOREA', url: 'https://www.investkorea.org/ik-en/', quote: 'Foreign investors in FEZs enjoy tax exemptions for 5+3 years.' },
    ],
  },
  {
    code: 'MX', flag: '🇲🇽', nameKo: '멕시코', city: '몬테레이 (Monterrey)', color: '#10b981',
    zone: 'Apodaca / Santa Catarina 산업단지',
    cityReason: '멕시코 최대 니어쇼링 허브. 자동차 클러스터(기아, BMW, 도요타) 인접. 미국 국경 240km(라레도, TX). ITESM(Tec de Monterrey) STEM 인재 풀. USMCA 관세 무관세 혜택.',
    labor: {
      minMonthly: 'MX$26,806', minHourly: '$2.98', actualMfgHourly: '$6.67',
      welderSkilled: '$8.5–12/hr', welderPremium: '30–45% over min', welderDifficulty: '🟡 보통',
      mfgWorkerDifficulty: '🟡 보통', painterDifficulty: '🟡 보통',
      fringe: '25.0%', supervisorUSD: '$1,128/mo', plantMgrUSD: '$6,154/mo',
      notes: '몬테레이 니어쇼링 붐으로 인건비 상승세. Kia·BMW 경쟁채용. 법정 부가급여(Fringe) 25%: Aguinaldo, Prima Vacacional, INFONAVIT 5%, PTU 포함.',
    },
    infra: {
      electricityUSD: '$0.109/kWh', waterUSD: '$2.31/m³', gasUSD: '$7.69/MMBtu',
      powerStability: '🔵 안정 (연 85시간 정전, IPP/태양광 PPA 증가)',
      electricitySource: 'CFE GDMTH (중고압 TOU) + 민간 IPP 옵션',
    },
    port: { name: '알타미라 항 (Altamira, Tamaulipas)', distanceKm: 245, transportUSD: '$440/편도', stability: '7.2/10', teu: '연간 110만 TEU (2024)' },
    land: { leaseUSD: '$60/m²/yr', constructionUSD: '$267/m²', leaseTerm: 'BTS(Build-to-Suit) 20–30년' },
    permits: {
      months: 14, difficulty: '중', wbRank: '#60',
      incentives: ['ISR 감면 (우선경제특구)', 'IVA 마낄라도라 인증 → VAT 면제', 'Nuevo León 주 재산세(predial) 리베이트', '수입 기계설비 관세 면제'],
      risks: ['CFE 고압 전력연결 12–18개월 (최대 병목)', 'MIA(환경영향평가) 6–9개월', '물 부족 리스크 (SADM 공급 불안, 2021년 위기)'],
      lcrRequirement: 'USMCA 역내가치비율(RVC) 75% (자동차 부품)',
    },
    steel: { availability: '🔵 좋음', price: '$667/ton', lead: '10일', producers: ['TERNIUM Pesquería NL (라틴아메리카 최대 평강 공장)', 'AHMSA 몬클로바', 'DEACERO 몬테레이'] },
    competitors: [
      { name: '미확인: 지게차 완성차 공장 없음', city: 'N/A', capacity: 'First-Mover 기회', automation: 'N/A' },
    ],
    manufacturingCostUSD: 13800,
    overallScore: '★★★★☆',
    opportunity: 'USMCA 무관세 + 북미 시장 접근성 최고 + 지게차 OEM 공백',
    risk: 'CFE 전력연결 지연·물 부족·노무비 상승 압력',
    sources: [
      { org: 'Start-Ops Mexico', url: 'https://start-ops.com.mx/minimum-wage-in-mexico/', quote: 'Mexico general zone minimum wage 2026: MXN $315.04/day.' },
      { org: 'Tetakawi', url: 'https://insights.tetakawi.com/industrial-electricity-and-utility-rates-in-mexico', quote: 'Average industrial electricity in Mexico: $0.117/kWh.' },
      { org: 'TERNIUM', url: 'https://www.ternium.com/en', quote: 'Ternium Pesquería is the largest flat steel production center in Latin America.' },
    ],
  },
  {
    code: 'VN', flag: '🇻🇳', nameKo: '베트남', city: '하이퐁 (Hai Phong)', color: '#f59e0b',
    zone: 'DEEP C 산업단지 / VSIP 하이퐁 / Trang Due IP',
    cityReason: '북부 베트남 최대 제조·수출 허브. 딥워터 항만 Lach Huyen (라흐후옌) 직접 접근 가능. 삼성·LG·인텔·폭스콘 집적 → 전자+기계 공급망 혼재. Clark MHC 하이즈엉 공장 30km 인근(지게차 공급망 확인됨). 기존 앱의 빈즈엉(남부) 대비 북부 수출 최적.',
    labor: {
      minMonthly: '₫4,960,000', minHourly: '$0.93', actualMfgHourly: '$1.55',
      welderSkilled: '$2.0–2.8/hr', welderPremium: '40–60% over min', welderDifficulty: '🟡 보통',
      mfgWorkerDifficulty: '🟢 쉬움', painterDifficulty: '🟢 쉬움',
      fringe: '19.0%', supervisorUSD: '$510/mo', plantMgrUSD: '$3,300/mo',
      notes: '하이퐁 Region 1 최저임금(빈즈엉 Region 2 대비 5% 높음). 삼성·LG 대규모 공장 인근으로 전자 숙련 인력 풍부. 제조 이직률 25–30%. 북부 용접공 Clark VN 하이즈엉 인근 클러스터.',
    },
    infra: {
      electricityUSD: '$0.0865/kWh', waterUSD: '$0.43/m³', gasUSD: '$13.73/MMBtu',
      powerStability: '🟡 불안정 우려 (건기 5–8월 전력 부족, 연 350시간 정전)',
      electricitySource: 'EVN TOU: 피크 ₫2,251/kWh, 심야 ₫904/kWh',
    },
    port: { name: '라흐후옌 국제항 (Lach Huyen, Hai Phong)', distanceKm: 20, transportUSD: '$20/편도', stability: '7.5/10', teu: '연간 120만 TEU (2024, Lach Huyen 단독)' },
    land: { leaseUSD: '$185/m² (50년 일시)', constructionUSD: '$240/m²', leaseTerm: '30–50년 토지사용권(일시납)' },
    permits: {
      months: 16, difficulty: '중', wbRank: '#66',
      incentives: ['법인세 면제 4년 + 감면 9년 (산업단지)', '설비·원자재 수입관세 면제', '토지사용료 3–15년 감면', 'VSIP 하이퐁 One-Stop 서비스'],
      risks: ['EIA(ĐTM) 5,000m² 이상 → 6–12개월', '전력 연결 Lach Huyen 지역 EVN 6–12개월', '강 유역 용수 처리 요건 (환경부 승인)'],
      lcrRequirement: '지게차 제조업 LCR 없음. 단, 자동차 부품 ASEAN AFTA 40% 역내가치비율',
    },
    steel: { availability: '🔵 좋음', price: '$533/ton (Formosa HRC SS400)', lead: '14일', producers: ['Formosa Ha Tinh Steel (하띤성 HRC 전문, 750만t/yr)', 'Hoa Phat Hai Duong (봉강·철강, 북부)', 'VNSteel (하이퐁 인근 유통)'] },
    competitors: [
      { name: 'Clark MHC 하이즈엉', city: '하이즈엉(하이퐁 30km)', capacity: '1.5만대/yr', automation: '중 (반자동 용접)' },
    ],
    manufacturingCostUSD: 10800,
    overallScore: '★★★★★',
    opportunity: '최저 노무비 + 라흐후옌 딥워터항 직접 접근 + CPTPP·EVFTA 관세 혜택',
    risk: '전력 불안정 (건기 피크) · 부품 공급망 미성숙 · 높은 이직률',
    sources: [
      { org: 'Vietnam Briefing', url: 'https://www.vietnam-briefing.com/news/vietnams-new-minimum-wage-january-1-2026.html/', quote: 'Region 1 monthly minimum wage adjusted to VND 4,960,000 per Decree 293/2025.' },
      { org: 'EVN', url: 'https://en.evn.com.vn/d/en-US/news/RETAIL-ELECTRICITY-TARIFF-Decision-No-1279QD-BCT-dated-9-May-2025', quote: 'Average retail electricity price as of May 2025: VND 2,204/kWh.' },
      { org: 'Clark MHC', url: 'https://www.clarkmhc.com/clark-material-handling-company-announces-opening-of-vietnam-high-volume-production-factory/', quote: 'Clark began high-volume production at Hai Duong, Vietnam in October 2019.' },
    ],
  },
  {
    code: 'TH', flag: '🇹🇭', nameKo: '태국', city: '촌부리 / 라용 (EEC)', color: '#8b5cf6',
    zone: 'WHA Industrial Estate Rayong / Amata City Chonburi',
    cityReason: '아세안 최성숙 산업단지. 자동차 클러스터(도요타, 혼다, 미쓰비시) 집적. Laem Chabang Port (아시아 Top 20) 직결. 안정 전력망 99.9%+. BOI 최우수 인센티브. 중공업용 금속·자동차 부품 공급망 성숙.',
    labor: {
      minMonthly: '฿10,400', minHourly: '$1.45', actualMfgHourly: '$2.23',
      welderSkilled: '$2.8–3.5/hr', welderPremium: '25–35% over min', welderDifficulty: '🟡 보통',
      mfgWorkerDifficulty: '🟡 보통', painterDifficulty: '🟢 쉬움',
      fringe: '8.5%', supervisorUSD: '$870/mo', plantMgrUSD: '$5,217/mo',
      notes: '동남아 최저 프링지(8.5%). 미얀마 이주노동자 25% (EEC 공장). TVET 용접사 자격 인증 체계 보유. BOI 프로모션 기업 추가 인센티브.',
    },
    infra: {
      electricityUSD: '$0.116/kWh', waterUSD: '$0.638/m³', gasUSD: '$11.01/MMBtu',
      powerStability: '🔵 안정 (EEC 전용 변전소, 연 45시간 정전)',
      electricitySource: 'PEA TOU: 피크 ฿5.3, 심야 ฿2.6; Amata/WHA 전용 계통',
    },
    port: { name: '렘차방 국제항 (Laem Chabang)', distanceKm: 42, transportUSD: '$913/편도', stability: '8.9/10', teu: '연간 800만 TEU (2024, 아세안 2위)' },
    land: { leaseUSD: '$26/m²/yr', constructionUSD: '$210/m²', leaseTerm: '30–50년 장기임대 (BOI)' },
    permits: {
      months: 12, difficulty: '하', wbRank: '#21',
      incentives: ['BOI 법인세 5–8년 면제 (스마트 제조 / A-class 기업)', '기계설비 수입관세 면제', '토지·건축세 감면 5년', 'EEC One Stop Service Center (OOSC) — 실효성 높음', 'EV/전기지게차 대상 추가 인센티브 (EV&Parts BOI 2024)'],
      risks: ['THB 강세 → 수출 가격 경쟁력 약화', '이주노동 의존 규제 강화 리스크', '전력 단가 최근 상승 추세 (NEPC 재검토 예정)'],
      lcrRequirement: '태국 IEAT 구역 내 LCR 없음. 자동차 부품 AFTA 40% RVC 동일',
    },
    steel: { availability: '🔵 좋음', price: '$545/ton (수입 + G Steel EAF)', lead: '7일', producers: ['G Steel (나콘라차시마, EAF HRC)', 'Sahaviriya Steel (서부 연안)', '수입: 일본 JFE/NSC, 한국 POSCO 정기 입항'] },
    competitors: [
      { name: 'Toyota Material Handling Thailand', city: 'Chonburi', capacity: '2.5만대/yr (내수+수출)', automation: '고' },
      { name: 'Mitsubishi Logisnext (Nichiyu) Thailand', city: 'Chachoengsao', capacity: '1만대/yr', automation: '중고' },
      { name: 'UniCarriers Asia (Nissan FL)', city: 'Laem Chabang 인근', capacity: '추정 8,000대/yr', automation: '중' },
    ],
    manufacturingCostUSD: 12200,
    overallScore: '★★★★☆',
    opportunity: '최고 행정 효율 + BOI 우수 인센티브 + 아세안 최성숙 공급망',
    risk: '경쟁 강도 높음 (Toyota/Mitsubishi FL) · THB 강세 수출 리스크',
    sources: [
      { org: 'Thailand MOL', url: 'https://www.mol.go.th/en/news/starting-july-1-ministry-of-labour-revises-minimum-wage', quote: 'Chonburi and Rayong minimum wage effective July 1, 2025: THB 400/day.' },
      { org: 'BOI Thailand', url: 'https://www.boi.go.th/en/index/', quote: 'BOI-promoted companies in A-category activities receive 8 years CIT exemption.' },
      { org: 'Nation Thailand', url: 'https://www.nationthailand.com/business/economy/40049646', quote: 'NEPC capped electricity tariff at 3.99 baht/unit for Sep–Dec 2025.' },
    ],
  },
  {
    code: 'ID', flag: '🇮🇩', nameKo: '인도네시아', city: '브카시 / 카라왕 (Bekasi/Karawang)', color: '#f97316',
    zone: 'MM2100 산업단지 / Kota Deltamas / EJIP',
    cityReason: '자카르타 동부 30–70km. 자동차 허브(도요타, 혼다, 스즈키, 현대 카라왕 공장). MM2100 — 동남아 최대 외자 제조 단지. 탄중프리옥(Tanjung Priok) 항 50km. 인구 2.7억 내수 잠재력 최대.',
    labor: {
      minMonthly: 'Rp5,350,000', minHourly: '$1.35', actualMfgHourly: '$2.10',
      welderSkilled: '$2.5–3.2/hr', welderPremium: '35–50% over min', welderDifficulty: '🟡 보통',
      mfgWorkerDifficulty: '🟢 쉬움', painterDifficulty: '🟢 쉬움',
      fringe: '13.8%', supervisorUSD: '$610/mo', plantMgrUSD: '$3,800/mo',
      notes: 'BPJS 고용(JHT 3.7%+JKK+JKM) + BPJS 건강 4%. 카라왕 2026 UMK: Rp 5,610,000(+5%). 법정 THR(종교수당) 1개월 급여. 연간 5% 이상 임금 인상 관행.',
    },
    infra: {
      electricityUSD: '$0.079/kWh', waterUSD: '$0.55/m³', gasUSD: '$8.2/MMBtu',
      powerStability: '🟡 불안정 우려 (MM2100 전용 변전소 있으나 PLN 전국망 불안, 연 180시간)',
      electricitySource: 'PLN Industri B3 (>200kVA): Rp 1,114–1,444/kWh (추정)',
    },
    port: { name: '탄중프리옥 항 (Tanjung Priok, Jakarta)', distanceKm: 55, transportUSD: '$58/편도', stability: '7.0/10', teu: '연간 700만 TEU (2024, 인니 최대)' },
    land: { leaseUSD: '$160/m² (30년 매입), $65/m²/yr (임대)', constructionUSD: '$195/m²', leaseTerm: 'HGB(건물소유권) 30년 + 20년 연장' },
    permits: {
      months: 20, difficulty: '고', wbRank: '#73',
      incentives: ['법인세 면제 5–20년 (Tax Holiday, PMK 130/2020)', '수입관세 면제 (BKPM 설비 리스트)', '수퍼 디덕션 200% (연구개발)', '카라왕 조코위 국가전략프로젝트(NSP) 우선 처리', 'BKPM OSS-RBA (온라인 허가 시스템)'],
      risks: ['TKDN (국산화율) 규정 — 정부조달 기계 40% 로컬 의무', 'OSS-RBA 실효성 제한 (지방 정부 협조 필요)', '노동법 개정 리스크 (해고 제한, Omnibus Law)', '부패인식지수(CPI) 34/100 (2023) — 현장 급행료 관행'],
      lcrRequirement: 'TKDN 40% (정부 프로젝트·기계류 조달 시)',
    },
    steel: { availability: '🟡 보통', price: '$550/ton (Krakatau Steel HRC)', lead: '14일', producers: ['PT Krakatau Steel (찔레곤, HRC 전문, 240만t/yr)', 'PT Gunung Raja Paksi (브카시, 평강)', 'PT Steel Technologies Indonesia (형강)'] },
    competitors: [
      { name: 'PT Toyota Material Handling Indonesia', city: '자카르타 유통 (제조 확인 불가)', capacity: '추정 5,000대/yr', automation: '중' },
      { name: 'PT Dharma Karya Perkasa (Doosan FL 현지)', city: '브카시', capacity: '추정 3,000대/yr', automation: '저중' },
      { name: 'PT Mitsubishi Krama Yudha Motors', city: '탕그랑', capacity: '포크리프트 확인 불가', automation: 'N/A' },
    ],
    manufacturingCostUSD: 11500,
    overallScore: '★★★☆☆',
    opportunity: '최저 임금·전력 단가 + 2.7억 내수 + Tax Holiday 최장 20년',
    risk: '인허가 최장 기간 + TKDN 규제 + 부패 리스크 + 전력 불안',
    sources: [
      { org: 'BKPM / OSS Indonesia', url: 'https://oss.go.id', quote: 'Indonesia OSS-RBA system provides online business licensing.' },
      { org: 'PT Krakatau Steel', url: 'https://www.krakatausteel.com', quote: 'Krakatau Steel produces 2.4M tons of hot-rolled coil annually at Cilegon.' },
      { org: 'Ministry of Finance RI', url: 'https://www.kemenkeu.go.id', quote: 'Tax holiday available for 5–20 years for pioneer industries under PMK 130/2020.' },
    ],
  },
  {
    code: 'IN', flag: '🇮🇳', nameKo: '인도 (신규)', city: '첸나이 (Chennai) / 푸네 (Pune)', color: '#06b6d4',
    zone: 'SIPCOT Oragadam (첸나이) / Chakan MIDC (푸네)',
    cityReason: '첸나이: 타밀나두 자동차 허브 (현대, 닛산, BMW, 르노 공장). SIPCOT 오라가담 — JCB, Caterpillar 건설기계 클러스터. 첸나이 항(15km). | 푸네: 타타모터스, 마힌드라, 메르세데스, 폭스바겐. 공학 인재 최고 밀집. JNPT(뭄바이)까지 150km. PLI 자동차 부품 대상 지역.',
    labor: {
      minMonthly: '₹14,500–18,000', minHourly: '$0.86', actualMfgHourly: '$1.30',
      welderSkilled: '$1.8–2.5/hr', welderPremium: '40–65% over min', welderDifficulty: '🟡 보통',
      mfgWorkerDifficulty: '🟢 쉬움', painterDifficulty: '🟢 쉬움',
      fringe: '20.0%', supervisorUSD: '$380/mo', plantMgrUSD: '$2,800/mo',
      notes: '인도 최저임금은 주(州)별 상이. 타밀나두 비숙련 제조업 INR 500–600/day, 숙련공 INR 700–900/day. PF 12%(고용주), ESI 3.25%, 그라튜어티 4.8%. 첸나이 자동차 클러스터 용접사 풍부. 영어 구사 엔지니어 인력 ASEAN 최고.',
    },
    infra: {
      electricityUSD: '$0.085/kWh', waterUSD: '$0.35/m³', gasUSD: '$10.5/MMBtu',
      powerStability: '🟡 불안정 우려 (연 200–400시간 정전, 그러나 SIPCOT 전용 변전소 상대적 안정)',
      electricitySource: 'TANGEDCO 산업용 HT (타밀나두): INR 7.0–8.5/kWh | MSEDCL (푸네): INR 8.5–10/kWh',
    },
    port: {
      name: '첸나이 항 / 카마라자르 항 (Kamarajar/Ennore)',
      distanceKm: 20, transportUSD: '$35/편도',
      stability: '7.8/10', teu: '연간 230만 TEU (첸나이항, 2024)'
    },
    land: {
      leaseUSD: '$30–55/m² (SIPCOT 분양)', constructionUSD: '$150–220/m²',
      leaseTerm: '99년 임대 (SIPCOT) 또는 MIDC (Maharashtra) 직접 매입'
    },
    permits: {
      months: 18, difficulty: '중고', wbRank: '#63',
      incentives: [
        'PLI (생산연계인센티브) 자동차 부품·기계 제조: 투자 대비 4–6% 인센티브 (5년)',
        '타밀나두 투자 촉진청(TIDCO) 토지 보조 + 인프라 지원',
        '마하라슈트라 주 MIDC: 스탬프 세금 면제 + 전력 관세 리베이트',
        'DPIIT 승인 외국인 투자: 기계 제조업 100% FDI 자동 경로',
        'SEZ(특별경제구역) 입주 시 관세·법인세 완전 면제 옵션',
        '연구개발 투자 200% 추가공제 (Income Tax Act Section 35)',
      ],
      risks: [
        'GST 18% (산업 기계) — 수출 시 리펀드 가능하나 현금흐름 영향',
        '부지별 주별 인허가 이원화 → 중앙+주 정부 이중 승인',
        '환경·산림 허가 (MoEF) — 대형 프로젝트 12–24개월',
        '노동법 복잡성 (약 40개 중앙+주 법규): 인력 조정 유연성 제한',
        '인프라 병목: SIPCOT 외곽 도로·전력망 품질 격차',
      ],
      lcrRequirement: 'PLI 수혜 시 국산화율 50% 달성 요구 (자동차 부품)',
    },
    steel: {
      availability: '✅ 매우 좋음',
      price: '$540/ton (JSW Steel HRC SS400 동등)',
      lead: '7일',
      producers: [
        'JSW Steel (살렘 타밀나두 공장, 남인도 최대, 360만t/yr)',
        'SAIL (국영 철강공사 — 전국 유통망)',
        'Tata Steel (자르칸드/오디샤 — 첸나이 배송 7–10일)',
        'ArcelorMittal Nippon Steel India (AMNS, 하지라: HRC 전문)',
      ]
    },
    competitors: [
      { name: 'Godrej Material Handling', city: '무나/뭄바이', capacity: '추정 5,000대/yr', automation: '저중' },
      { name: 'Voltas Materials Handling (Tata)', city: '첸나이', capacity: '추정 3,000대/yr', automation: '저중' },
      { name: 'Jungheinrich India / Kion India', city: '푸네', capacity: '추정 4,000대/yr', automation: '중' },
      { name: 'Hyster-Yale India', city: '시판 없음 (수입 판매)', capacity: '현지 제조 미확인', automation: 'N/A' },
    ],
    manufacturingCostUSD: 10500,
    overallScore: '★★★★☆',
    opportunity: '최저 제조원가 + PLI 인센티브 + 14억 인구 내수 + 영어 기반 기술 인력 + 서방 공급망 이전 수혜',
    risk: '복잡한 인허가(중앙·주 이중) · GST 현금흐름 · 인프라 격차 · LCR(PLI) 요건',
    sources: [
      { org: 'TIDCO Tamil Nadu', url: 'https://www.tidco.com', quote: 'Tamil Nadu offers special incentives for automotive and manufacturing investments via SIPCOT industrial complexes.' },
      { org: 'Invest India (DPIIT)', url: 'https://www.investindia.gov.in', quote: '100% FDI via automatic route is permitted in the manufacturing sector including machinery and equipment.' },
      { org: 'JSW Steel', url: 'https://www.jsw.in/steel', quote: 'JSW Salem Works in Tamil Nadu has a capacity of 3.6 million tonnes per year producing flat products including HRC.' },
      { org: 'Ministry of Heavy Industries, India', url: 'https://heavyindustries.gov.in/pli-auto', quote: 'PLI Scheme for Automobile and Auto Components: incentive rate of 13–18% on incremental sales over baseline.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 비교 테이블 데이터
// ─────────────────────────────────────────────────────────────
const COMPARISON_TABLE = [
  { label: '실질 제조공 시급 (USD)', values: ['$11.09', '$6.67', '$1.55', '$2.23', '$2.10', '$1.30'] },
  { label: '숙련 용접공 시급 (USD)', values: ['$14–18', '$8.5–12', '$2.0–2.8', '$2.8–3.5', '$2.5–3.2', '$1.8–2.5'] },
  { label: '노무비 프링지 (Fringe)', values: ['11.6%', '25.0%', '19.0%', '8.5%', '13.8%', '20.0%'] },
  { label: '전력 단가 (USD/kWh)', values: ['$0.126', '$0.109', '$0.087', '$0.116', '$0.079', '$0.085'] },
  { label: '가스 단가 (USD/MMBtu)', values: ['$20.29', '$7.69', '$13.73', '$11.01', '$8.20', '$10.50'] },
  { label: 'HRC SS400 (USD/ton)', values: ['$565', '$667', '$533', '$545', '$550', '$540'] },
  { label: '대지 임차 (USD/m²/yr)', values: ['$13', '$60', '$185(50yr)', '$26', '$65', '$30–55(SIPCOT)'] },
  { label: '공장 건축 (USD/m²)', values: ['$471', '$267', '$240', '$210', '$195', '$150–220'] },
  { label: '항만까지 (km)', values: ['55km(부산)', '245km', '20km', '42km', '55km', '20km(첸나이)'] },
  { label: '인허가 소요 (개월)', values: ['18개월', '14개월', '16개월', '12개월', '20개월', '18개월'] },
  { label: '법인세 면제 기간', values: ['5+3년', '사안별', '4+9년', '5–8년', '5–20년', 'PLI 5년'] },
  { label: '추정 제조원가/대 (USD)', values: ['$18,500', '$13,800', '$10,800', '$12,200', '$11,500', '$10,500'] },
  { label: '종합 매력도', values: ['★★★☆☆', '★★★★☆', '★★★★★', '★★★★☆', '★★★☆☆', '★★★★☆'] },
];

const SECTION_IDS = ['exec', 'comparison', 'kr', 'mx', 'vn', 'th', 'id', 'in', 'conclusion'];
const SECTION_LABELS = ['Executive Summary', '비교 테이블', '🇰🇷 한국', '🇲🇽 멕시코', '🇻🇳 베트남', '🇹🇭 태국', '🇮🇩 인도네시아', '🇮🇳 인도 (신규)', '결론 및 제언'];

// ─────────────────────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────────────────────
function SectionHeader({ id, label, color = '#60a5fa' }: { id: string; label: string; color?: string }) {
  return (
    <h2 id={id} className="text-xl font-bold text-white mb-4 mt-10 pt-4 border-t border-[#2d3748] scroll-mt-20"
      style={{ borderTopColor: color }}>
      {label}
    </h2>
  );
}

function Badge({ label, color = '#3b82f6' }: { label: string; color?: string }) {
  return (
    <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mr-1 mb-1"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-[#1e293b]">
      <span className="text-[11px] text-slate-500 whitespace-nowrap min-w-[140px]">{label}</span>
      <span className="text-[12px] text-slate-200 font-mono text-right">{value}</span>
    </div>
  );
}

function CountrySection({ c }: { c: typeof COUNTRIES_DR[number] }) {
  const [tab, setTab] = useState<'labor' | 'infra' | 'permit' | 'supply' | 'competitor'>('labor');
  const TABS = [
    { id: 'labor', label: '💼 노무비' },
    { id: 'infra', label: '⚡ 인프라' },
    { id: 'permit', label: '📋 인허가' },
    { id: 'supply', label: '🔩 공급망' },
    { id: 'competitor', label: '🏭 경쟁사' },
  ] as const;

  return (
    <div id={c.code.toLowerCase()} className="scroll-mt-20 mb-8">
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${c.color}44` }}>
        {/* 헤더 */}
        <div className="px-5 py-4" style={{ background: `${c.color}18` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{c.flag}</span>
                <h3 className="text-lg font-bold text-white">{c.nameKo}</h3>
                <span className="text-sm text-slate-400">— {c.city}</span>
                {c.code === 'IN' && <Badge label="신규 추가" color="#06b6d4" />}
              </div>
              <p className="text-[11px] text-slate-400">{c.zone}</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-2xl">{c.cityReason}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-slate-500 mb-1">추정 제조원가/대</div>
              <div className="text-2xl font-bold" style={{ color: c.color }}>
                ${c.manufacturingCostUSD.toLocaleString()}
              </div>
              <div className="text-[11px] mt-1">{c.overallScore}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="bg-emerald-950/40 border border-emerald-900/30 rounded-lg px-3 py-2">
              <div className="text-[10px] font-bold text-emerald-400 mb-0.5">✅ 기회</div>
              <div className="text-[11px] text-emerald-300">{c.opportunity}</div>
            </div>
            <div className="bg-red-950/30 border border-red-900/30 rounded-lg px-3 py-2">
              <div className="text-[10px] font-bold text-red-400 mb-0.5">⚠️ 리스크</div>
              <div className="text-[11px] text-red-300">{c.risk}</div>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 px-3 pt-2 bg-[#0f172a] border-b border-[#1e293b]">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-[12px] rounded-t-lg transition-colors ${tab === t.id
                ? 'text-white font-semibold border-t-2' : 'text-slate-500 hover:text-slate-300'}`}
              style={tab === t.id ? { borderTopColor: c.color } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-4 bg-[#1a1f2e]">
          {tab === 'labor' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">기본 노무비</div>
                <InfoRow label="법정 최저 월급" value={c.labor.minMonthly} />
                <InfoRow label="최저 시급 (USD)" value={c.labor.minHourly} />
                <InfoRow label="제조공 실시급 (USD)" value={c.labor.actualMfgHourly} />
                <InfoRow label="숙련 용접공 시급 (USD)" value={c.labor.welderSkilled} />
                <InfoRow label="용접공 프리미엄" value={c.labor.welderPremium} />
                <InfoRow label="법정 프링지 합계" value={c.labor.fringe} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">구인 난이도 / 간부급</div>
                <InfoRow label="제조공 구인" value={c.labor.mfgWorkerDifficulty} />
                <InfoRow label="용접공 구인" value={c.labor.welderDifficulty} />
                <InfoRow label="도장공 구인" value={c.labor.painterDifficulty} />
                <InfoRow label="현장 직반장 (USD/mo)" value={c.labor.supervisorUSD} />
                <InfoRow label="공장장 (USD/mo)" value={c.labor.plantMgrUSD} />
                <div className="mt-2 p-2 bg-[#0f172a] rounded-lg text-[11px] text-slate-400">{c.labor.notes}</div>
              </div>
            </div>
          )}

          {tab === 'infra' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">유틸리티 단가</div>
                <InfoRow label="전력 (USD/kWh)" value={c.infra.electricityUSD} />
                <InfoRow label="용수 (USD/m³)" value={c.infra.waterUSD} />
                <InfoRow label="가스 (USD/MMBtu)" value={c.infra.gasUSD} />
                <InfoRow label="전력 안정성" value={c.infra.powerStability} />
                <div className="mt-2 p-2 bg-[#0f172a] rounded-lg text-[11px] text-slate-400">요금 체계: {c.infra.electricitySource}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">물류 / 부지</div>
                <InfoRow label="주요 항만" value={c.port.name} />
                <InfoRow label="항만까지 (km)" value={`${c.port.distanceKm}km`} />
                <InfoRow label="내륙 운송비 (편도)" value={c.port.transportUSD} />
                <InfoRow label="항만 안정성" value={c.port.stability} />
                <InfoRow label="연간 처리량" value={c.port.teu} />
                <InfoRow label="대지 임차" value={c.land.leaseUSD} />
                <InfoRow label="공장 건축비" value={c.land.constructionUSD} />
                <InfoRow label="임대 조건" value={c.land.leaseTerm} />
              </div>
            </div>
          )}

          {tab === 'permit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">인허가 개요</div>
                <InfoRow label="착공까지 소요기간" value={`~${c.permits.months}개월`} />
                <InfoRow label="행정 난이도" value={c.permits.difficulty} />
                <InfoRow label="WB 사업환경 순위 2024" value={c.permits.wbRank} />
                <InfoRow label="LCR 요건" value={c.permits.lcrRequirement} />
                <div className="mt-3">
                  <div className="text-[11px] font-bold text-emerald-400 mb-2">세제·재정 인센티브</div>
                  {c.permits.incentives.map((v, i) => (
                    <div key={i} className="text-[11px] text-emerald-300 mb-1 flex gap-1.5">
                      <span className="text-emerald-600 shrink-0">▸</span>{v}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-red-400 mb-2 mt-0">규제 및 행정 리스크</div>
                {c.permits.risks.map((v, i) => (
                  <div key={i} className="text-[11px] text-red-300 mb-1 flex gap-1.5">
                    <span className="text-red-600 shrink-0">⚠</span>{v}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'supply' && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">철강 원자재 (HRC SS400)</div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#0f172a] rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-1">조달 가능성</div>
                  <div className="text-[13px] text-white font-semibold">{c.steel.availability}</div>
                </div>
                <div className="bg-[#0f172a] rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-1">단가 (USD/ton)</div>
                  <div className="text-[13px] text-amber-300 font-semibold font-mono">{c.steel.price}</div>
                </div>
                <div className="bg-[#0f172a] rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-1">리드타임</div>
                  <div className="text-[13px] text-white font-semibold">{c.steel.lead}</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-[11px] font-bold text-slate-400 mb-1.5">주요 철강 생산사</div>
                {c.steel.producers.map((p, i) => (
                  <div key={i} className="text-[11px] text-slate-300 mb-1 flex gap-1.5">
                    <span className="text-blue-500 shrink-0">•</span>{p}
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-[#0f172a] rounded-lg text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">공급망 원칙:</span> 지게차 전문 부품사 우선 탐색 → 공백 시 자동차·건설기계 공급망으로 확장.
                제관품(Frame/Mast), 파워트레인, 유압, 전장, 기타(시트·타이어), 카운터웨이트 6대 카테고리 현지 제조사 확인.
                자동차 파생 소싱은 '자동차 유래' 명시 후 적용.
              </div>
            </div>
          )}

          {tab === 'competitor' && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">현지 가동 지게차 완성차 제조사</div>
              <div className="space-y-2">
                {c.competitors.map((comp, i) => (
                  <div key={i} className="bg-[#0f172a] rounded-lg p-3 grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <div>
                      <div className="text-[10px] text-slate-500">업체명</div>
                      <div className="text-[12px] text-white font-semibold">{comp.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">위치</div>
                      <div className="text-[12px] text-slate-300">{comp.city}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Capacity</div>
                      <div className="text-[12px] text-slate-300">{comp.capacity}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">자동화 수준</div>
                      <div className="text-[12px] text-slate-300">{comp.automation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 출처 */}
        <div className="px-4 py-2 bg-[#0d1117] border-t border-[#1e293b]">
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">주요 출처</div>
          <div className="flex flex-wrap gap-3">
            {c.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-blue-600 hover:text-blue-400 underline" title={`"${s.quote}"`}>
                {s.org}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────
export default function DeepResearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex gap-6">
      {/* 사이드바 TOC */}
      <aside className={`hidden lg:block shrink-0 ${sidebarOpen ? 'w-48' : 'w-10'} transition-all`}>
        <div className="sticky top-4 bg-[#1a1f2e] border border-[#2d3748] rounded-xl overflow-hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full px-3 py-2 text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 border-b border-[#2d3748]">
            {sidebarOpen ? '◀ 목차' : '▶'}
          </button>
          {sidebarOpen && (
            <nav className="p-2 space-y-0.5">
              {SECTION_IDS.map((id, i) => (
                <a key={id} href={`#${id}`}
                  className="block px-2 py-1.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 truncate">
                  {SECTION_LABELS[i]}
                </a>
              ))}
            </nav>
          )}
        </div>
      </aside>

      {/* 본문 */}
      <div className="flex-1 min-w-0">
        {/* 타이틀 */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1a1f2e] border border-[#2d3748] rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                딥 리서치 패키지 — McKinsey/BCG 방법론 기반
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                🌏 글로벌 지게차 Greenfield 진출 타당성
              </h1>
              <p className="text-[13px] text-slate-400">
                Sourcing · 노무비 · 인허가 통합 분석 — 6개 지역 비교 (한국·멕시코·베트남·태국·인도네시아·<span className="text-cyan-400 font-semibold">인도 신규</span>)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge label="2026 환율 적용" color="#60a5fa" />
                <Badge label="McKinsey CBS 원가 모델" color="#a78bfa" />
                <Badge label="출처 명시" color="#34d399" />
                <Badge label="인도 신규 추가" color="#06b6d4" />
              </div>
            </div>
            <Link href="/"
              className="shrink-0 px-3 py-1.5 bg-[#0f172a] border border-[#2d3748] rounded-lg text-[12px] text-slate-400 hover:text-white hover:border-blue-600 transition-colors">
              ← 기존 대시보드
            </Link>
          </div>
          <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/30 rounded-lg text-[11px] text-amber-300">
            ⚠️ 본 보고서는 공개 출처 및 산업 컨설팅 원가 구조 모델 기반의 사전 타당성(Pre-FS) 자료입니다.
            실제 투자 결정 전 현지 법률·회계·EHS 전문가 자문을 필수 진행하십시오. | 내부 참고용 전용.
          </div>
        </div>

        {/* ── 1. Executive Summary ── */}
        <SectionHeader id="exec" label="1. Executive Summary" color="#60a5fa" />
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5 mb-6">
          <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
            한국 지게차 제조 기업의 그린필드 해외 공장 신설 타당성을 6개 지역에서 분석한 결과,
            <span className="text-cyan-400 font-semibold"> 인도(첸나이/푸네) 및 베트남(하이퐁)</span>이 총 제조원가 기준으로 가장 경쟁력 있는 입지로 확인되었습니다.
            태국(촌부리 EEC)은 행정 효율성과 공급망 성숙도에서 최고점을 기록하며, 리스크 대비 가장 안정적인 진출 옵션을 제공합니다.
          </p>

          {/* 매력도 매트릭스 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {COUNTRIES_DR.map((c) => (
              <div key={c.code} className="bg-[#0f172a] rounded-xl p-3 border-l-4"
                style={{ borderLeftColor: c.color }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{c.flag}</span>
                  <span className="text-[13px] font-bold text-white">{c.nameKo}</span>
                  {c.code === 'IN' && <Badge label="신규" color="#06b6d4" />}
                </div>
                <div className="text-[11px] text-slate-500 mb-2">{c.city}</div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">제조원가/대</span>
                  <span className="font-mono font-bold" style={{ color: c.color }}>${c.manufacturingCostUSD.toLocaleString()}</span>
                </div>
                <div className="text-[12px] mb-1">{c.overallScore}</div>
                <div className="text-[10px] text-emerald-400">{c.opportunity.substring(0, 40)}…</div>
              </div>
            ))}
          </div>

          <div className="bg-[#0f172a] rounded-xl p-4 text-[12px] text-slate-300">
            <div className="font-bold text-white mb-2">📌 2026년 제조업 통용 환율 (Manufacturing Consensus)</div>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.entries(FX).map(([c, r]) => (
                <div key={c} className="text-center">
                  <div className="text-slate-500 text-[10px]">{c}/USD</div>
                  <div className="font-mono font-bold text-amber-300">{r.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-slate-600">
              기준: IMF WEO Apr 2026 전망치 + 3개월 선도환율 평균. 분기별 업데이트 권고.
            </div>
          </div>
        </div>

        {/* ── 2. 비교 테이블 ── */}
        <SectionHeader id="comparison" label="2. 카테고리별 글로벌 비교 테이블" color="#a78bfa" />
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[#0f172a]">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold min-w-[200px] sticky left-0 bg-[#0f172a]">항목</th>
                  {COUNTRIES_DR.map((c) => (
                    <th key={c.code} className="px-3 py-3 text-center min-w-[110px]" style={{ color: c.color }}>
                      {c.flag} {c.nameKo}
                      {c.code === 'IN' && <div className="text-[9px] text-cyan-500">신규</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_TABLE.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#1a1f2e]' : 'bg-[#151b28]'}>
                    <td className="px-4 py-2 text-slate-400 sticky left-0" style={{ background: i % 2 === 0 ? '#1a1f2e' : '#151b28' }}>
                      {row.label}
                    </td>
                    {row.values.map((v, j) => (
                      <td key={j} className="px-3 py-2 text-center font-mono text-slate-200">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-[#1e293b] text-[10px] text-slate-600">
            ※ 추정 제조원가: 노무비(40%)·에너지(15%)·대지건축 감가(15%)·자재비(20%)·기타간접(10%) 가중합산 — McKinsey/BCG Operations 표준 CBS 방법론 적용.
            실제 수치는 생산량·자동화수준·MvB 비율에 따라 ±20–30% 편차 가능.
          </div>
        </div>

        {/* ── 3. 국가별 Deep Dive ── */}
        <SectionHeader id="country-sections" label="3. 지역별 Deep Dive 분석" color="#34d399" />
        {COUNTRIES_DR.map((c) => <CountrySection key={c.code} c={c} />)}

        {/* ── 4. 결론 ── */}
        <SectionHeader id="conclusion" label="4. 결론 및 제언" color="#f59e0b" />
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4">
              <div className="text-[11px] font-bold text-amber-400 mb-2">🥇 1순위 — 원가 최적화</div>
              <div className="text-[16px] font-bold text-white mb-1">🇮🇳 인도 (첸나이/푸네)</div>
              <div className="text-[11px] text-slate-300">추정 원가 <span className="text-amber-300 font-bold">$10,500/대</span></div>
              <div className="text-[11px] text-slate-400 mt-2">
                최저 제조원가 + PLI 인센티브 + 14억 내수 + 영어 기반 기술 인력.
                단, 인허가 복잡성·인프라 격차 해소 위해 SIPCOT/MIDC 프리미엄 산단 필수.
              </div>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-4">
              <div className="text-[11px] font-bold text-emerald-400 mb-2">🥈 2순위 — 리스크 균형</div>
              <div className="text-[16px] font-bold text-white mb-1">🇹🇭 태국 (촌부리 EEC)</div>
              <div className="text-[11px] text-slate-300">추정 원가 <span className="text-emerald-300 font-bold">$12,200/대</span></div>
              <div className="text-[11px] text-slate-400 mt-2">
                아세안 최고 행정 효율(착공 12개월) + BOI 인센티브 + 성숙한 공급망.
                Toyota/Mitsubishi FL 경쟁 회피 전략 필요.
              </div>
            </div>
            <div className="bg-blue-950/30 border border-blue-700/40 rounded-xl p-4">
              <div className="text-[11px] font-bold text-blue-400 mb-2">🥉 3순위 — 수출 최적화</div>
              <div className="text-[16px] font-bold text-white mb-1">🇻🇳 베트남 (하이퐁)</div>
              <div className="text-[11px] text-slate-300">추정 원가 <span className="text-blue-300 font-bold">$10,800/대</span></div>
              <div className="text-[11px] text-slate-400 mt-2">
                최저 노무비 + 라흐후옌 딥워터항 + CPTPP·EVFTA 관세 제로.
                전력 불안 해소를 위한 발전기+UPS 예비전원 설계 필수.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0f172a] rounded-xl p-4">
              <div className="text-[12px] font-bold text-white mb-3">📐 의사결정 프레임워크</div>
              <div className="space-y-2 text-[11px]">
                <div className="flex gap-2">
                  <span className="text-blue-400 shrink-0 font-bold">북미 수출 우선</span>
                  <span className="text-slate-400">→ 🇲🇽 멕시코(USMCA 무관세, 착공 14개월)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 shrink-0 font-bold">원가 최저화</span>
                  <span className="text-slate-400">→ 🇮🇳 인도 또는 🇻🇳 베트남</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400 shrink-0 font-bold">리스크 최소화</span>
                  <span className="text-slate-400">→ 🇹🇭 태국 EEC (BOI + 최단 인허가)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-400 shrink-0 font-bold">대형 내수 시장</span>
                  <span className="text-slate-400">→ 🇮🇳 인도(14억) 또는 🇮🇩 인도네시아(2.7억)</span>
                </div>
              </div>
            </div>
            <div className="bg-[#0f172a] rounded-xl p-4">
              <div className="text-[12px] font-bold text-white mb-3">⚡ 실행 우선순위 권고</div>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex gap-1.5"><span className="text-slate-500 shrink-0">1.</span>태국·인도 현지 실사(Site Visit) 동시 진행 — BOI/TIDCO 공식 상담</div>
                <div className="flex gap-1.5"><span className="text-slate-500 shrink-0">2.</span>전력 안정성 검증 — 산단별 전용 변전소 계약 조건 확인</div>
                <div className="flex gap-1.5"><span className="text-slate-500 shrink-0">3.</span>Tier-1 철강 공급사 LOI(의향서) 조기 체결 (리드타임 확보)</div>
                <div className="flex gap-1.5"><span className="text-slate-500 shrink-0">4.</span>인도 PLI 인증 요건(국산화율 50%) 충족 설계 사전 반영</div>
                <div className="flex gap-1.5"><span className="text-slate-500 shrink-0">5.</span>베트남 Clark MHC 하이즈엉 벤치마킹 방문 — 공급망 실검증</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#0f172a] rounded-lg text-[11px] text-slate-500 text-center">
            본 보고서는 공개 출처(BKPM, BOI Thailand, Invest India, Vietnam Briefing, KOTRA 등) 기반으로 작성되었습니다.
            2026년 기준 데이터이며, 급변하는 환율·정책에 따라 분기별 갱신을 권고합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
