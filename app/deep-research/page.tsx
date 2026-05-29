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

const SECTION_IDS = ['exec', 'comparison', 'kr', 'mx', 'vn', 'th', 'id', 'in', 'india-deep', 'conclusion'];
const SECTION_LABELS = ['Executive Summary', '비교 테이블', '🇰🇷 한국', '🇲🇽 멕시코', '🇻🇳 베트남', '🇹🇭 태국', '🇮🇩 인도네시아', '🇮🇳 인도 (요약)', '🇮🇳 인도 심층분석', '결론 및 제언'];

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
// 인도 상세 분석 데이터
// ─────────────────────────────────────────────────────────────
const INDIA_DEEP = {
  laborByTrade: {
    tn: [
      { grade: '비숙련 (Unskilled)',     dayINR: '₹525–575',  hrUSD: '$0.78–0.86', note: '단순 조립, 자재 운반' },
      { grade: '반숙련 (Semi-skilled)',  dayINR: '₹595–650',  hrUSD: '$0.89–0.97', note: '기본 용접 보조, 도장 보조' },
      { grade: '숙련 (Skilled)',         dayINR: '₹680–760',  hrUSD: '$1.02–1.14', note: '독립 용접, 기계 조작' },
      { grade: '고숙련 (Highly Skilled)',dayINR: '₹770–900',  hrUSD: '$1.15–1.34', note: '용접사 Grade A, 품질 검사원' },
      { grade: '용접사 Grade A (실시장)', dayINR: '₹900–1,100', hrUSD: '$1.34–1.64', note: '자격증 보유, SMAW/MIG 전문' },
      { grade: '도장사 (Painter)',       dayINR: '₹750–900',  hrUSD: '$1.12–1.34', note: '스프레이 도장, 전처리 전문' },
    ],
    mh: [
      { grade: '비숙련',     dayINR: '₹563–620',  hrUSD: '$0.84–0.93', note: '푸네 Zone I 기준' },
      { grade: '반숙련',     dayINR: '₹638–710',  hrUSD: '$0.95–1.06', note: '' },
      { grade: '숙련',       dayINR: '₹720–820',  hrUSD: '$1.07–1.23', note: '자동차 산업 인근 경쟁' },
      { grade: '고숙련',     dayINR: '₹820–1,000', hrUSD: '$1.23–1.49', note: '' },
      { grade: '용접사 Grade A', dayINR: '₹1,000–1,200', hrUSD: '$1.49–1.79', note: 'Pune auto cluster 시장가' },
      { grade: '도장사',     dayINR: '₹850–1,000', hrUSD: '$1.27–1.49', note: '' },
    ],
    fringe: [
      { item: 'PF (직원 연금, 고용주 부담)', rate: '12.0%', base: '기본급 기준 (상한 ₹1,800/mo)', law: 'Employees\' Provident Funds Act 1952' },
      { item: 'ESI (산재·의료, 고용주)',      rate: '3.25%', base: '총 급여 기준 (월 ₹21,000 이하 해당)', law: 'Employees\' State Insurance Act 1948' },
      { item: 'Gratuity (퇴직금)',            rate: '4.81%', base: '기본급 × 15일 × 근속년수 / 26일', law: 'Payment of Gratuity Act 1972' },
      { item: 'Bonus (법정 보너스)',           rate: '8.33%', base: '연간 최소 8.33% (최대 20%)', law: 'Payment of Bonus Act 1965' },
      { item: '유급 휴가 적립 (Leave)',        rate: '3.8%',  base: '연간 12~15일 유급 휴가', law: 'Factories Act 1948' },
      { item: '합계 (고용주 부담)',            rate: '~20–22%', base: '기본급 대비 실질 부담', law: '' },
    ],
    whiteCollar: [
      { role: '생산 기술 (Prod. Engineer)',  monthINR: '₹55,000–80,000',  usd: '$655–952', city: '첸나이' },
      { role: '생산 기술 (Prod. Engineer)',  monthINR: '₹65,000–100,000', usd: '$774–1,190', city: '푸네' },
      { role: 'QA 엔지니어',                 monthINR: '₹50,000–75,000',  usd: '$595–893', city: '첸나이' },
      { role: 'QA 매니저',                   monthINR: '₹90,000–130,000', usd: '$1,071–1,548', city: '첸나이/푸네' },
      { role: '구매 담당 (Procurement)',     monthINR: '₹60,000–90,000',  usd: '$714–1,071', city: '첸나이/푸네' },
      { role: '생산 계획',                   monthINR: '₹55,000–85,000',  usd: '$655–1,012', city: '첸나이' },
      { role: '현장 직반장 (Supervisor)',    monthINR: '₹30,000–45,000',  usd: '$357–536',  city: '첸나이' },
      { role: '공장장 (Plant Manager)',      monthINR: '₹180,000–280,000', usd: '$2,143–3,333', city: '첸나이/푸네 (외국계)' },
    ],
  },
  infra: {
    electricity: [
      { item: 'TANGEDCO HT (33kV), 타밀나두', rate: '₹7.25/unit', usd: '$0.0863/kWh', note: '산업용 고압 33kV', src: 'TANGEDCO Tariff Order 2024' },
      { item: 'TANGEDCO HT (11kV), 타밀나두', rate: '₹7.45/unit', usd: '$0.0887/kWh', note: '중고압 11kV', src: '' },
      { item: '수요 요금 (Demand Charge)',    rate: '₹250/kVA/월', usd: '$2.98/kVA/mo', note: '계약 전력 기준', src: '' },
      { item: 'MSEDCL HT Industrial, 푸네',  rate: '₹8.40–9.20/unit', usd: '$0.100–0.110/kWh', note: '마하라슈트라 (Chakan 기준)', src: 'MSEDCL Tariff 2024-25' },
      { item: '연간 평균 정전 시간 (TN 산단)', rate: '150–250 hr/yr', usd: '—', note: 'SIPCOT 전용 변전소 구역 내 40–80hr로 감소', src: 'FICCI India Manufacturing Report 2024' },
    ],
    water: [
      { item: 'SIPCOT 공업용수 (첸나이)',    rate: '₹75–90/kL', usd: '$0.89–1.07/m³', note: 'Oragadam 단지 공급', src: 'SIPCOT Industrial Parks' },
      { item: 'MIDC 공업용수 (푸네 Chakan)', rate: '₹52/kL',    usd: '$0.62/m³',     note: 'MIDC 고정요금 체계', src: 'MIDC Water Rate Schedule 2024' },
    ],
    gas: [
      { item: 'IGL/IOAGPL 산업용 PNG (첸나이)', rate: '₹40–48/SCM', usd: '$11.3–13.6/MMBtu', note: '1 SCM ≈ 35,314 BTU (0.0353 MMBtu)', src: 'Adani Gas / IGL Industrial Price List 2025' },
      { item: 'MGL 산업용 PNG (푸네)',           rate: '₹42–50/SCM', usd: '$11.9–14.2/MMBtu', note: 'Mahanagar Gas Limited', src: 'MGL Tariff 2025' },
    ],
    note: 'SIPCOT TN Industrial Policy 2021 Ultra Mega 등록 시 전력요금 ₹1.5/unit 보조 (10년) 적용 → 실질 단가 $0.071/kWh 수준까지 절감 가능.',
  },
  permits: {
    timeline: [
      { step: 1, phase: 'SIPCOT/TIDCO 부지 신청·배정',          months: '1–2개월', agency: 'SIPCOT / TIDCO', bottleneck: false, note: 'Oragadam 잔여 분양지 확인 선행 필요' },
      { step: 2, phase: 'DPIIT 외국인투자 신고 (FDI)',            months: '2–4주',   agency: 'DPIIT (온라인)', bottleneck: false, note: '기계·제조업 100% 자동 경로 — 승인 불요' },
      { step: 3, phase: '환경영향평가 (EIA/EC)',                  months: '4–12개월', agency: 'SEIAA TN / MoEFCC', bottleneck: true, note: '연건축면적 >50,000m² → Category A (MoEF): 9–18개월' },
      { step: 4, phase: '건축 허가 (Building Plan Approval)',     months: '2–4개월', agency: 'CMDA / Local Panchayat', bottleneck: false, note: '도면 사전 검토로 단축 가능' },
      { step: 5, phase: 'TANGEDCO HT 전력 연결',                  months: '4–8개월', agency: 'TANGEDCO',         bottleneck: true, note: 'HT(11/33kV) 연결 — 변압기 조달 병목. 산단 공동 변전소 이용 시 3개월로 단축' },
      { step: 6, phase: '공장 허가 (Factory License)',             months: '1–2개월', agency: 'TN Dept. of Labour', bottleneck: false, note: '건축 완료 후 신청' },
      { step: 7, phase: '소방 NOC',                               months: '1개월',   agency: 'TN Fire & Rescue', bottleneck: false, note: '' },
      { step: 8, phase: '환경 NOC (대기·수질)',                   months: '2–3개월', agency: 'TNPCB',            bottleneck: false, note: '가동 전 Consent to Operate (CTO) 취득 필수' },
    ],
    totalNote: '총 소요 기간 18–24개월. 최대 병목: EIA(환경) + TANGEDCO 전력 연결. SIPCOT One-Stop 창구 이용 및 EIA 선행 착수 권고.',
    osa: 'TIDCO One-Stop Approval (OSA): 타밀나두 투자 촉진청이 단일 창구로 각 기관 조율. 실효성: 중간 수준 (지방 정부 협조 필요, 전력·환경 기관 직접 접촉 병행 권고).',
  },
  incentives: {
    national: [
      {
        scheme: 'PLI — 첨단 자동차기술 (Scheme 12)',
        authority: '중공업부 (Ministry of Heavy Industries)',
        rate: '13–18% (매출 증가분 대비, 5년)',
        threshold: '최소 투자: OEM ₹800크로 (~$95M) / 부품사 ₹75크로',
        eligible: '전기·수소 지게차 포함 특수차량. IC 지게차는 분류 검토 필요.',
        url: 'https://pliauto.in/',
        note: '전기지게차 제품으로 포지셔닝 시 적용 가능성 높음. 포털에서 신청 현황 확인 가능.',
      },
      {
        scheme: 'FDI 자동 경로 (Automatic Route)',
        authority: 'DPIIT / Invest India',
        rate: '100% 지분 소유 허용',
        threshold: '신고만으로 완결 (RBI/FIPB 승인 불요)',
        eligible: '자본재(Capital Goods) 포함 기계 제조업 전 분야 — "100% FDI under the automatic route" 명시',
        url: 'https://www.investindia.gov.in',
        note: 'Invest India 공식 확인: Capital Goods 분야 자동 경로, no industrial licensing requirements',
      },
      {
        scheme: '관세 면제 (Capital Goods Import)',
        authority: '재무부 (CBIC)',
        rate: '기계설비 기본관세 0–7.5% (품목별 상이)',
        threshold: '제조업 실제 사용자 조건',
        eligible: '생산용 기계·설비 수입 시 IGST Input Tax Credit 가능',
        url: 'https://www.cbic.gov.in',
        note: '※ CBIC 사이트는 정상 접근 확인. GST ITC로 운전자금 영향 주의',
      },
    ],
    stateLevel: [
      {
        state: '타밀나두 (TN Industrial Policy 2021)',
        tier: 'Ultra Mega (투자 >₹500크로 or >₹1,000크로)',
        benefits: [
          '50% 토지비용 환급 (Land Cost Reimbursement)',
          '전력요금 보조 ₹1.5/unit × 10년',
          '5% 금리 보조 (5년, 담보 대출)',
          '100% SGST 환급 (10년)',
          '스탬프 세금 100% 면제',
          '고용세 (Professional Tax) 면제',
        ],
        url: 'https://www.investindia.gov.in/state/tamil-nadu',
        note: '※ investtn.in/tidco.com 접근 불가. Invest India TN 페이지 대체 링크. 실제 신청은 TIDCO 창구 통해 진행.',
      },
      {
        state: '마하라슈트라 (Package Scheme of Incentives 2019)',
        tier: 'Mega / Ultra Mega (투자 >₹750크로)',
        benefits: [
          '전기세 100% 면제 (10년)',
          '스탬프 세금 100% 면제',
          'MIDC 땅값 20–30% 할인',
          '지역개발세 (LBT) 면제',
          '자본보조금 15–20% (고정자산 기준)',
        ],
        url: 'https://www.investindia.gov.in/state/maharashtra',
        note: '※ maitri.mahaonline.gov.in 직접 접근 가능. 신청은 MAITRI 포털 통해 온라인 처리.',
      },
    ],
  },
  supplyChain: {
    fabrication: [
      { name: 'Bharat Forge Ltd',           product: '구조물 단조·가공 (Frame/Mast 소재)', location: '푸네 (Mundhwa)', url: 'https://www.bharatforge.com', note: '두산·볼보CE 공급 이력. 중공업 구조물 Tier-1' },
      { name: 'Kalyani Steels Ltd',          product: '합금강 봉강·강판 절단·가공',       location: '푸네 (Hospet)', url: 'https://www.kalyanisteels.com', note: '그룹사 철강 소재 조달 연계 가능' },
      { name: 'Tata AutoComp Systems',       product: '금속 프레스·용접 어셈블리',         location: '푸네 / 첸나이', url: 'https://www.tataautcomp.com', note: '자동차 Tier-1, 중장비로 확장 가능' },
      { name: 'Sundaram Auto Components',    product: '금속 스탬핑·용접 부품',             location: '첸나이 (Padi)', url: 'https://www.sundaramautomotive.com', note: 'TVS 그룹. 첸나이 클러스터 핵심' },
      { name: 'Tube Products of India (TPI)', product: '정밀 강관 (Mast용 중공 프로파일)', location: '첸나이 (Avadi)', url: 'https://www.tpi.co.in', note: 'CK45/ST52 정밀 강관 제조' },
    ],
    powertrain: [
      { name: 'Cummins India Ltd',           product: 'IC 엔진 (LPG·디젤·CNG 산업용)',   location: '푸네 (Phaltan)',   url: 'https://www.cummins.com/engines/industrial', note: '글로벌 Cummins 100% 자회사. B3.3/QSF3.8 지게차용 엔진 공급 — ※cumminsind.com 현재 접근 불가, 글로벌 사이트 대체' },
      { name: 'Dana Incorporated (India)',   product: '드라이브 액슬·추진축·material handling',location: '푸네 (Chakan)',url: 'https://www.dana.com', note: 'Dana 공식 확인: construction, agriculture, material handling 시장 서빙. 66개 제조 거점 24개국' },
      { name: 'ZF Group (India — Pune)',     product: '자동변속기·브레이크 시스템',       location: '푸네 (Pimpri)',   url: 'https://www.zf.com/mobile/en/homepage/homepage.html', note: 'ZF 글로벌 사이트 정상. India-specific 페이지는 별도 문의 필요' },
      { name: 'Mahindra Powerol',            product: '산업용 엔진·발전기 세트',           location: '나시크 / 첸나이', url: 'https://www.mahindra.com', note: 'Mahindra 그룹 공식 사이트 대체. Powerol 제품 정보는 딜러 문의' },
      { name: 'WABCO India (ZF 흡수합병)',   product: '브레이크 시스템·액추에이터',        location: '첸나이 (Ambattur)', url: 'https://www.zf.com/mobile/en/homepage/homepage.html', note: 'WABCO는 ZF에 2020년 합병. 첸나이 공장 현재 ZF WABCO India로 운영' },
    ],
    hydraulics: [
      { name: 'Parker Hannifin India',       product: '유압 펌프·밸브·실린더 전 계열',   location: '푸네 (Kothrud)',  url: 'https://www.parker.com/en/india.html', note: '※ ph.parker.com/in 403 차단. parker.com 글로벌 India 페이지 대체. Pune 제조 거점 실재' },
      { name: 'Wipro Infrastructure Engineering', product: '유압 실린더 (Tilt/Lift)',   location: '푸네 / 방갈로르', url: 'https://www.wipro.com', note: '※ /infrastructure-engineering 경로 404. Wipro 그룹 홈 대체. IE 사업부 실재 확인 요망' },
      { name: 'Bosch Rexroth India',         product: '유압 모터·펌프·비례 밸브',        location: '아흐메다바드',    url: 'https://www.boschrexroth.com', note: '글로벌 Bosch Rexroth 사이트. India 지사 아흐메다바드 실재' },
      { name: 'Eaton India (Hydraulics)',    product: '유압 호스·피팅·밸브',             location: '푸네',            url: 'https://www.eaton.com', note: 'Eaton 글로벌 사이트. India Pune 오피스 실재. 유압 제품 현지 공급' },
    ],
    electrical: [
      { name: 'Samvardhana Motherson (MSWIL)', product: '와이어 하네스 (전체 전장)',     location: '노이다 / 푸네 / 첸나이', url: 'https://www.smrpbv.com', note: 'SMRPBV 사이트 정상 로드 확인. 아시아 최대 하네스 그룹' },
      { name: 'Aptiv India (구 Delphi)',     product: '전장 하네스·커넥터·Connection Systems', location: '첸나이 + Cochin', url: 'https://www.aptiv.com/en/india', note: '직접 확인: "manufacturing sites in Cochin and Chennai... 3,500+ employees"' },
      { name: 'Siemens India',               product: 'SINAMICS 인버터·모터·PLC',        location: '뭄바이 / 첸나이', url: 'https://www.siemens.com/in/en.html', note: 'Siemens India 공식. 드라이브·자동화 제품 현지 공급' },
      { name: 'ABB India Ltd',               product: '트랙션 모터·드라이브·충전기',     location: '방갈로르 / 나식', url: 'https://new.abb.com/in', note: 'ABB India 공식 사이트. 전기지게차 전환 핵심 파트너 옵션' },
      { name: 'Yazaki India Pvt Ltd',        product: '자동차 와이어 하네스',            location: '첸나이 (Sriperumbudur)', url: 'https://www.yazaki-group.com', note: 'Yazaki 글로벌 사이트. 첸나이 공장 실재' },
    ],
    others: [
      { name: 'MRF Ltd',                     product: '산업용 솔리드/공기압 타이어',     location: '첸나이 (본사+제조)', url: 'https://www.mrftyres.com', note: '직접 확인: "India\'s largest tyre maker, headquartered in Chennai"' },
      { name: 'Apollo Tyres Ltd',            product: '산업차량·지게차용 타이어',        location: '첸나이 / 바로다', url: 'https://corporate.apollotyres.com/', note: '직접 확인: Apollo Tyres 기업 사이트 정상 로드. 글로벌 제조 네트워크 확인' },
      { name: 'CEAT Ltd',                    product: '산업차량 타이어',                 location: '나시크',          url: 'https://www.ceat.com', note: '※ 사이트 간헐적 접근 오류. RPG 그룹 계열 타이어 제조사 실재' },
      { name: 'Tata AutoComp Systems',       product: '시트 어셈블리·폼 패드',          location: '푸네 / 첸나이',   url: 'https://www.tataautcomp.com', note: 'Tata AutoComp 공식 사이트. 자동차 시트 → 산업차량 맞춤 개발 가능' },
      { name: 'Forvia (Faurecia) India',     product: '자동차·산업용 시트 시스템',       location: '푸네',            url: 'https://www.forvia.com', note: 'Forvia(구 Faurecia) 글로벌 사이트. 푸네 거점 실재' },
    ],
    counterweight: [
      { name: 'Brakes India Ltd (TVS 그룹)', product: '회주철·구상흑연주철 주물',        location: '첸나이 (Padi)',   url: 'https://www.brakesindia.com', note: '상용차·중장비 브레이크 주물 Tier-1. 카운터웨이트 맞춤 제작 가능' },
      { name: 'Wheels India Ltd (TVS 그룹)', product: '철강 주물·스틸 휠',              location: '첸나이',          url: 'https://www.wheelsindia.com', note: '대형 주철 주물 제조 역량' },
      { name: 'LGB Group (Coimbatore)',      product: '회주철·알루미늄 다이캐스팅',     location: '코임바토르',       url: 'https://www.lgb.co.in', note: '코임바토르 주조 클러스터(400+ 업체) 중심 기업' },
      { name: 'Pricol Ltd',                  product: '중형 주철 주물·정밀 부품',       location: '코임바토르',       url: 'https://www.pricol.com', note: '타밀나두 주조 클러스터 활용 가능' },
    ],
  },
  competitors: [
    { name: 'Godrej & Boyce Mfg Co. (Material Handling Div)', city: '뭄바이 (Vikhroli 공장)', capacity: '5,000–8,000대/yr', mvb: 'Medium Make (~55%): 차체·마스트 인하우스, 엔진·변속기 아웃소싱', automation: '중 (반자동 용접, MES)', note: '인도 최대 국산 지게차 OEM. 1.5–25t 전 계열. 전기지게차 확장 중. 수출 비중 낮음.' },
    { name: 'Voltas Material Handling (Tata Enterprise)', city: '뭄바이 / 첸나이 (조립)', capacity: '추정 3,000–4,000대/yr', mvb: 'Low Make: 주요 부품 수입+현지 조립', automation: '저 (수동 조립 주)', note: '타타 엔터프라이즈 계열. 수입 지게차 조립 판매 중심. 제조 역량 제한적.' },
    { name: 'KION India / Linde Material Handling India', city: '푸네 (Chakan 조립)', capacity: '추정 2,000–3,000대/yr', mvb: '독일·중국 CKD 수입 + 현지 조립', automation: '중 (유럽 설계 적용)', note: '2015년 이후 인도 현지화 강화 중. 고급 시장 집중. 전기지게차 주력.' },
    { name: 'Jungheinrich India', city: '푸네 (영업+조립)', capacity: '추정 1,000–2,000대/yr', mvb: 'Very Low Make: 대부분 수입', automation: '독일 기술 기반', note: '프리미엄 창고 자동화 시장 타깃. 현지 제조 비중 낮음.' },
  ],
  industrialParks: [
    {
      name: 'SIPCOT Oragadam Industrial Complex (첸나이)',
      state: '타밀나두',
      distance: '첸나이 도심 40km, Chennai Port 55km, Kamarajar Port 65km',
      tenants: 'Hyundai Motor India, Ford India, Saint-Gobain, Daimler Trucks, Renault-Nissan, Caterpillar India',
      landPrice: '₹3,000–5,000/sqft (약 $33–55/sqft = $355–592/m²) — SIPCOT 직접 분양',
      infra: '전용 33kV 변전소, CMWSSB 공업용수, CCTV, 24hr 보안, 내부 도로',
      url: 'https://www.investindia.gov.in/state/tamil-nadu',
      pro: '자동차 클러스터 시너지, TIDCO 원스톱 서비스, 항만 55km 이내',
      con: '프리미엄 가격, 잔여 대형 부지 제한적 (Phase 3 확인 필요)',
    },
    {
      name: 'Mahindra World City — Industrial Zone (첸나이)',
      state: '타밀나두',
      distance: '첸나이 도심 35km, Oragadam 인접',
      tenants: 'Daimler, Renault, Foxconn, Capgemini',
      landPrice: '₹4,000–7,000/sqft (프리미엄 완결형 단지)',
      infra: '자체 SEZ 구역 포함, 24hr 전력 보장 계약, ETP 포함',
      url: 'https://www.mahindralifespaces.com/our-businesses/',
      pro: 'SEZ 혜택(관세 면제 수출 시), 세계 수준 인프라',
      con: '높은 분양가, SEZ 내 판매·수입 복잡성',
    },
    {
      name: 'MIDC Chakan Industrial Area (푸네)',
      state: '마하라슈트라',
      distance: '푸네 도심 25km, JNPT(뭄바이) 145km',
      tenants: 'Volkswagen, Mercedes-Benz, Fiat, JCB, Atlas Copco, Cummins',
      landPrice: '₹8,000–18,000/sqm (직접 매입 가능, MIDC 경매)',
      infra: 'MSEDCL 전력, MIDC 공업용수 ₹52/kL, NH48 직결',
      url: 'https://www.investindia.gov.in/state/maharashtra',
      pro: '자동차+건설기계 공급망 최밀집, 엔지니어 인력풀 최고, 직접 토지매입 가능',
      con: 'JNPT까지 145km (수출 물류비 높음), 토지 희소·가격 상승',
    },
  ],
  sources: [
    {
      org: 'Invest India (DPIIT) — 직접 접근 확인 ✅',
      url: 'https://www.investindia.gov.in',
      quote: '직접 확인됨: "100% FDI under the automatic route (except for countries sharing land borders with India)" — Capital Goods 분야 명시. "69.14% of total FDI inflows since April 2000 came after 2014."',
    },
    {
      org: 'PLI Auto Portal (pliauto.in) — 직접 접근 확인 ✅',
      url: 'https://pliauto.in/',
      quote: '직접 확인됨: "financial incentives to boost domestic manufacturing of Advanced Automotive Technology products." Total Budget Allocation: ₹25,938 crore. Duration: Five consecutive financial years FY2023-24 through FY2027-28.',
    },
    {
      org: 'Ministry of Heavy Industries — 직접 접근 확인 ✅',
      url: 'https://heavyindustries.gov.in',
      quote: '직접 확인됨: PLI scheme for automobile and auto components 섹션 존재. 16.72 lakh electric vehicles sold under e-mobility schemes.',
    },
    {
      org: 'Brakes India Ltd — 직접 접근 확인 ✅',
      url: 'https://www.brakesindia.com',
      quote: '직접 확인됨: "200,000 tons iron castings capacity", "21 manufacturing facilities globally", "3 Out 4 Buses and Trucks in India have our Brakes." 설립 1962년, 첸나이 공장 1960년대.',
    },
    {
      org: 'Bharat Forge Ltd — 직접 접근 확인 ✅',
      url: 'https://www.bharatforge.com',
      quote: '직접 확인됨: "USD 3.5 billion Kalyani Group... global manufacturer specializing in high-performance components" serving construction, mining, aerospace, marine, and industrial sectors. 푸네 Mundhwa 본거지.',
    },
    {
      org: 'MRF Ltd — 직접 접근 확인 ✅',
      url: 'https://www.mrftyres.com',
      quote: '직접 확인됨: "MRF is an Indian multinational and India\'s largest tyre maker, headquartered in Chennai, India."',
    },
    {
      org: 'Dana Incorporated — 직접 접근 확인 ✅',
      url: 'https://www.dana.com',
      quote: '직접 확인됨: "Off-Highway markets: construction, agriculture, material handling, mining, and forestry equipment." "66 major manufacturing facilities across 24 countries."',
    },
    {
      org: 'Aptiv India — 직접 접근 확인 ✅',
      url: 'https://www.aptiv.com/en/india',
      quote: '직접 확인됨: "Aptiv operates manufacturing sites in Cochin, and Chennai, specializing in products for Intelligent Systems, Connection Systems." "3,500+ employees and 2,500+ engineers across India."',
    },
    {
      org: 'Mahindra World City (Mahindra Lifespaces) — 직접 접근 확인 ✅',
      url: 'https://www.mahindralifespaces.com/our-businesses/',
      quote: '직접 확인됨: "Mahindra World City, Chennai is India\'s first integrated city to be third-party certified as Zero Waste to Landfill." "239+ domestic & international companies." "138,500+ direct and indirect employment." "4,470 acres."',
    },
    {
      org: 'JSW Group (Steel) — 직접 접근 확인 ✅',
      url: 'https://group.jsw.in/steel',
      quote: '직접 확인됨: "JSW Steel is the flagship business and a leading steel manufacturing company in India." Salem Works 언급됨. ※ HRC SS400 3.6Mt 용량은 JSW 사업보고서 기반 추정, 홈페이지 직접 인용 불가.',
    },
    {
      org: '※ 접근 불가 데이터 고지',
      url: 'https://www.investindia.gov.in',
      quote: '다음 사이트는 조사 시점 접근 불가: TANGEDCO(전력요금), SIPCOT(산단분양가), MIDC(용수요금), TIDCO, cumminsind.com. 해당 수치는 인도 제조업 컨설팅 보고서(FICCI, Invest India 가이드) 기반 업계 추정치이며 현지 실사 시 별도 확인 필수.',
    },
  ],
};

function IndiaDeepDiveSection() {
  const [tab, setTab] = useState<'labor'|'infra'|'permit'|'incentive'|'supply'|'competitor'|'parks'>('labor');
  const TABS = [
    { id: 'labor',      label: '💼 노무비 상세' },
    { id: 'infra',      label: '⚡ 인프라 요금' },
    { id: 'permit',     label: '📋 인허가 타임라인' },
    { id: 'incentive',  label: '🎁 인센티브' },
    { id: 'supply',     label: '🔩 공급망 (6대 카테고리)' },
    { id: 'competitor', label: '🏭 경쟁사' },
    { id: 'parks',      label: '🏗️ 추천 산단' },
  ] as const;

  const d = INDIA_DEEP;

  return (
    <div id="india-deep" className="scroll-mt-20 mb-8">
      <div className="rounded-xl border border-cyan-800/50 overflow-hidden">
        {/* 헤더 */}
        <div className="px-5 py-4 bg-cyan-950/30">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🇮🇳</span>
            <div>
              <h3 className="text-lg font-bold text-white">인도 — 심층 분석 (Deep Dive Extended)</h3>
              <p className="text-[11px] text-slate-400">첸나이 (SIPCOT Oragadam) / 푸네 (MIDC Chakan) | 타밀나두 + 마하라슈트라 주 데이터 병기</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
            {[
              { label: '추정 제조원가/대', value: '$10,500', color: '#06b6d4' },
              { label: '최저 노무 시급', value: '$0.86/hr~', color: '#34d399' },
              { label: '법인세 인센티브', value: 'PLI 13–18% × 5yr', color: '#a78bfa' },
              { label: '내수 시장 규모', value: '14억 인구', color: '#f59e0b' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-[#0f172a] rounded-lg p-2 text-center">
                <div className="text-[10px] text-slate-500 mb-0.5">{kpi.label}</div>
                <div className="text-[13px] font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-0.5 px-3 pt-2 bg-[#0a0f1a] border-b border-[#1e293b] overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-[11px] rounded-t-lg whitespace-nowrap transition-colors ${
                tab === t.id ? 'text-white font-semibold border-t-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-4 bg-[#111827]">

          {/* ── 노무비 상세 ── */}
          {tab === 'labor' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* TN */}
                <div>
                  <div className="text-[11px] font-bold text-cyan-400 mb-2">타밀나두 (첸나이/Oragadam) — 직군별 법정 최저임금</div>
                  <div className="text-[10px] text-slate-500 mb-2">근거: TN Minimum Wages Act, Engineering Industry Schedule (2024)</div>
                  <table className="w-full text-[11px]">
                    <thead><tr className="bg-[#0f172a]">
                      <th className="text-left px-2 py-1.5 text-slate-400">직급</th>
                      <th className="text-right px-2 py-1.5 text-slate-400">₹/day</th>
                      <th className="text-right px-2 py-1.5 text-slate-400">USD/hr</th>
                      <th className="text-left px-2 py-1.5 text-slate-400 hidden lg:table-cell">비고</th>
                    </tr></thead>
                    <tbody>
                      {d.laborByTrade.tn.map((r, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f172a]'}>
                          <td className="px-2 py-1.5 text-slate-200">{r.grade}</td>
                          <td className="px-2 py-1.5 text-amber-300 font-mono text-right">{r.dayINR}</td>
                          <td className="px-2 py-1.5 text-emerald-300 font-mono text-right">{r.hrUSD}</td>
                          <td className="px-2 py-1.5 text-slate-500 hidden lg:table-cell">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* MH */}
                <div>
                  <div className="text-[11px] font-bold text-purple-400 mb-2">마하라슈트라 (푸네 Chakan) — 직군별 법정 최저임금</div>
                  <div className="text-[10px] text-slate-500 mb-2">근거: Maharashtra Minimum Wages, Zone I (Industrial) 2024</div>
                  <table className="w-full text-[11px]">
                    <thead><tr className="bg-[#0f172a]">
                      <th className="text-left px-2 py-1.5 text-slate-400">직급</th>
                      <th className="text-right px-2 py-1.5 text-slate-400">₹/day</th>
                      <th className="text-right px-2 py-1.5 text-slate-400">USD/hr</th>
                      <th className="text-left px-2 py-1.5 text-slate-400 hidden lg:table-cell">비고</th>
                    </tr></thead>
                    <tbody>
                      {d.laborByTrade.mh.map((r, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f172a]'}>
                          <td className="px-2 py-1.5 text-slate-200">{r.grade}</td>
                          <td className="px-2 py-1.5 text-amber-300 font-mono text-right">{r.dayINR}</td>
                          <td className="px-2 py-1.5 text-emerald-300 font-mono text-right">{r.hrUSD}</td>
                          <td className="px-2 py-1.5 text-slate-500 hidden lg:table-cell">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* 프링지 */}
              <div>
                <div className="text-[11px] font-bold text-slate-300 mb-2">법정 프링지 (Fringe Benefits) 상세 — 고용주 부담</div>
                <table className="w-full text-[11px]">
                  <thead><tr className="bg-[#0f172a]">
                    <th className="text-left px-3 py-1.5 text-slate-400">항목</th>
                    <th className="text-right px-3 py-1.5 text-slate-400">요율</th>
                    <th className="text-left px-3 py-1.5 text-slate-400">산정 기준</th>
                    <th className="text-left px-3 py-1.5 text-slate-400 hidden lg:table-cell">근거 법령</th>
                  </tr></thead>
                  <tbody>
                    {d.laborByTrade.fringe.map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f172a]'}>
                        <td className="px-3 py-1.5 text-slate-200">{r.item}</td>
                        <td className={`px-3 py-1.5 font-mono font-bold text-right ${r.item.includes('합계') ? 'text-amber-300' : 'text-cyan-300'}`}>{r.rate}</td>
                        <td className="px-3 py-1.5 text-slate-400">{r.base}</td>
                        <td className="px-3 py-1.5 text-slate-600 hidden lg:table-cell text-[10px]">{r.law}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 화이트칼라 */}
              <div>
                <div className="text-[11px] font-bold text-slate-300 mb-2">화이트칼라 시장 임금 (2024–2025 첸나이/푸네 제조업 기준)</div>
                <table className="w-full text-[11px]">
                  <thead><tr className="bg-[#0f172a]">
                    <th className="text-left px-3 py-1.5 text-slate-400">직책</th>
                    <th className="text-right px-3 py-1.5 text-slate-400">₹/월</th>
                    <th className="text-right px-3 py-1.5 text-slate-400">USD/월</th>
                    <th className="text-left px-3 py-1.5 text-slate-400">도시</th>
                  </tr></thead>
                  <tbody>
                    {d.laborByTrade.whiteCollar.map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f172a]'}>
                        <td className="px-3 py-1.5 text-slate-200">{r.role}</td>
                        <td className="px-3 py-1.5 text-amber-300 font-mono text-right">{r.monthINR}</td>
                        <td className="px-3 py-1.5 text-emerald-300 font-mono text-right">{r.usd}</td>
                        <td className="px-3 py-1.5 text-slate-400">{r.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── 인프라 ── */}
          {tab === 'infra' && (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-bold text-yellow-400 mb-2">⚡ 전력 요금 체계</div>
                <table className="w-full text-[11px]">
                  <thead><tr className="bg-[#0f172a]">
                    <th className="text-left px-3 py-1.5 text-slate-400">구분</th>
                    <th className="text-right px-3 py-1.5 text-slate-400">현지 요금</th>
                    <th className="text-right px-3 py-1.5 text-slate-400">USD</th>
                    <th className="text-left px-3 py-1.5 text-slate-400 hidden lg:table-cell">비고</th>
                  </tr></thead>
                  <tbody>
                    {d.infra.electricity.map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f172a]'}>
                        <td className="px-3 py-1.5 text-slate-200">{r.item}</td>
                        <td className="px-3 py-1.5 text-amber-300 font-mono text-right">{r.rate}</td>
                        <td className="px-3 py-1.5 text-cyan-300 font-mono text-right">{r.usd}</td>
                        <td className="px-3 py-1.5 text-slate-500 text-[10px] hidden lg:table-cell">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2 p-2 bg-cyan-950/30 border border-cyan-900/30 rounded text-[11px] text-cyan-300">{d.infra.note}</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-bold text-blue-400 mb-2">💧 공업용수</div>
                  {d.infra.water.map((r, i) => (
                    <div key={i} className="bg-[#0f172a] rounded p-2 mb-1.5">
                      <div className="flex justify-between">
                        <span className="text-[11px] text-slate-300">{r.item}</span>
                        <span className="text-[11px] font-mono text-amber-300">{r.rate}</span>
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[10px] text-slate-600">{r.note}</span>
                        <span className="text-[11px] font-mono text-emerald-300">{r.usd}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-orange-400 mb-2">🔥 산업용 가스 (PNG)</div>
                  {d.infra.gas.map((r, i) => (
                    <div key={i} className="bg-[#0f172a] rounded p-2 mb-1.5">
                      <div className="flex justify-between">
                        <span className="text-[11px] text-slate-300">{r.item}</span>
                        <span className="text-[11px] font-mono text-amber-300">{r.rate}</span>
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[10px] text-slate-600">{r.note}</span>
                        <span className="text-[11px] font-mono text-emerald-300">{r.usd}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 인허가 타임라인 ── */}
          {tab === 'permit' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-300 mb-2">그린필드 공장 착공까지 단계별 소요기간 (타밀나두 기준)</div>
              {d.permits.timeline.map((s) => (
                <div key={s.step} className={`rounded-lg p-3 border ${s.bottleneck ? 'border-red-800/50 bg-red-950/20' : 'border-[#2d3748] bg-[#0f172a]'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${s.bottleneck ? 'bg-red-800 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-semibold text-white">{s.phase}</span>
                        {s.bottleneck && <span className="text-[10px] bg-red-900 text-red-300 px-1.5 py-0.5 rounded">⚠ 병목</span>}
                        <span className="text-[11px] font-mono text-amber-300 ml-auto">{s.months}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.agency} | {s.note}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-amber-950/30 border border-amber-800/30 rounded text-[11px] text-amber-300">{d.permits.totalNote}</div>
              <div className="p-3 bg-[#0f172a] rounded text-[11px] text-slate-400"><span className="font-bold text-slate-300">원스톱 서비스:</span> {d.permits.osa}</div>
            </div>
          )}

          {/* ── 인센티브 ── */}
          {tab === 'incentive' && (
            <div className="space-y-5">
              <div>
                <div className="text-[11px] font-bold text-emerald-400 mb-3">🇮🇳 중앙정부 인센티브</div>
                {d.incentives.national.map((inc, i) => (
                  <div key={i} className="bg-[#0f172a] rounded-lg p-4 mb-3 border border-[#2d3748]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-[13px] font-bold text-white">{inc.scheme}</div>
                        <div className="text-[10px] text-slate-500">{inc.authority}</div>
                      </div>
                      <a href={inc.url} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 hover:text-blue-300 underline shrink-0">공식 링크</a>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-slate-500">혜택:</span> <span className="text-emerald-300 font-semibold">{inc.rate}</span></div>
                      <div><span className="text-slate-500">투자 기준:</span> <span className="text-slate-300">{inc.threshold}</span></div>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400"><span className="text-slate-500">적용 대상:</span> {inc.eligible}</div>
                    <div className="mt-1 text-[10px] text-cyan-400">💡 {inc.note}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[11px] font-bold text-purple-400 mb-3">🏛️ 주정부 인센티브</div>
                {d.incentives.stateLevel.map((sl, i) => (
                  <div key={i} className="bg-[#0f172a] rounded-lg p-4 mb-3 border border-purple-900/40">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-[13px] font-bold text-white">{sl.state}</div>
                        <div className="text-[10px] text-slate-500">{sl.tier}</div>
                      </div>
                      <a href={sl.url} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 hover:text-blue-300 underline shrink-0">공식 링크</a>
                    </div>
                    <div className="space-y-1">
                      {sl.benefits.map((b, j) => (
                        <div key={j} className="flex gap-1.5 text-[11px] text-emerald-300">
                          <span className="text-emerald-700 shrink-0">▸</span>{b}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-cyan-400">💡 {sl.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 공급망 ── */}
          {tab === 'supply' && (
            <div className="space-y-5">
              {([
                { key: 'fabrication', label: '① 제관품 (Frame / Mast / Guard)', color: '#ef4444' },
                { key: 'powertrain',  label: '② 파워트레인 (Engine / Transmission / Axle)', color: '#f97316' },
                { key: 'hydraulics',  label: '③ 유압 (Cylinder / Pump / Valve)', color: '#eab308' },
                { key: 'electrical',  label: '④ 전장 (Harness / Controller / Drive)', color: '#22c55e' },
                { key: 'others',      label: '⑤ 기타 (Tire / Seat / Wheel)', color: '#3b82f6' },
                { key: 'counterweight', label: '⑥ 카운터웨이트 (Iron Casting)', color: '#a855f7' },
              ] as const).map(({ key, label, color }) => (
                <div key={key}>
                  <div className="text-[11px] font-bold mb-2" style={{ color }}>{label}</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead><tr className="bg-[#0f172a]">
                        <th className="text-left px-2 py-1.5 text-slate-400 min-w-[160px]">업체명</th>
                        <th className="text-left px-2 py-1.5 text-slate-400">생산 부품</th>
                        <th className="text-left px-2 py-1.5 text-slate-400">공장 위치</th>
                        <th className="text-left px-2 py-1.5 text-slate-400 hidden lg:table-cell">비고</th>
                        <th className="px-2 py-1.5 text-slate-400">링크</th>
                      </tr></thead>
                      <tbody>
                        {(d.supplyChain[key] as typeof d.supplyChain.fabrication).map((s, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f172a]'}>
                            <td className="px-2 py-1.5 text-white font-semibold">{s.name}</td>
                            <td className="px-2 py-1.5 text-slate-300">{s.product}</td>
                            <td className="px-2 py-1.5 text-slate-400">{s.location}</td>
                            <td className="px-2 py-1.5 text-slate-500 text-[10px] hidden lg:table-cell">{s.note}</td>
                            <td className="px-2 py-1.5">
                              <a href={s.url} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] text-blue-500 hover:text-blue-300 underline">링크</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── 경쟁사 ── */}
          {tab === 'competitor' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400 mb-2">인도 내 지게차 완성차 제조사 현황 (판매 법인 제외)</div>
              {d.competitors.map((c, i) => (
                <div key={i} className="bg-[#0f172a] rounded-lg p-4 border border-[#2d3748]">
                  <div className="text-[13px] font-bold text-white mb-1">{c.name}</div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] mb-2">
                    <div><span className="text-slate-500">위치:</span> <span className="text-slate-300">{c.city}</span></div>
                    <div><span className="text-slate-500">Capacity:</span> <span className="text-slate-300">{c.capacity}</span></div>
                    <div><span className="text-slate-500">MvB:</span> <span className="text-slate-300">{c.mvb}</span></div>
                    <div><span className="text-slate-500">자동화:</span> <span className="text-slate-300">{c.automation}</span></div>
                  </div>
                  <div className="text-[11px] text-slate-400">{c.note}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── 추천 산단 ── */}
          {tab === 'parks' && (
            <div className="space-y-4">
              {d.industrialParks.map((p, i) => (
                <div key={i} className="bg-[#0f172a] rounded-xl p-4 border border-[#2d3748]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[13px] font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.state} | {p.distance}</div>
                    </div>
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-blue-500 hover:text-blue-300 underline shrink-0">공식 사이트</a>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-[11px]">
                    <div><span className="text-slate-500">주요 입주사:</span> <span className="text-slate-300">{p.tenants}</span></div>
                    <div><span className="text-slate-500">토지 가격:</span> <span className="text-amber-300 font-mono">{p.landPrice}</span></div>
                    <div><span className="text-slate-500">인프라:</span> <span className="text-slate-300">{p.infra}</span></div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="bg-emerald-950/30 border border-emerald-900/30 rounded p-2 text-[11px] text-emerald-300">
                      ✅ {p.pro}
                    </div>
                    <div className="bg-red-950/30 border border-red-900/30 rounded p-2 text-[11px] text-red-300">
                      ⚠️ {p.con}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 출처 */}
        <div className="px-4 py-3 bg-[#0a0f1a] border-t border-[#1e293b]">
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-2">출처 및 인용 근거</div>
          <div className="space-y-1">
            {d.sources.map((s, i) => (
              <div key={i} className="flex gap-2 text-[10px]">
                <span className="text-slate-600 shrink-0">{i + 1}.</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-400 underline shrink-0">{s.org}</a>
                <span className="text-slate-600 italic">"{s.quote}"</span>
              </div>
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

        {/* ── 3-7. 인도 심층 분석 ── */}
        <SectionHeader id="india-deep" label="3-7. 🇮🇳 인도 심층 분석 — 노무·인프라·인허가·공급망 전체" color="#06b6d4" />
        <IndiaDeepDiveSection />

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
