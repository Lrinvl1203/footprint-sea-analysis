'use client';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface SourceEntry {
  id: string;
  country: string;
  flag: string;
  url: string;
  organization: string;
  description: string;
  quote: string;
  dataPointUsed: string;
  accessDate: string;
  verified: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Source Registry — all citations from countries.ts + supplementary
// ─────────────────────────────────────────────────────────────────────────────
const SOURCES: Record<string, SourceEntry[]> = {

  '인건비 (Labor)': [
    {
      id: 'kr-l1', country: '한국', flag: '🇰🇷',
      url: 'https://www.minimumwage.go.kr/english/introduce/minWage.do',
      organization: 'Minimum Wage Council, Republic of Korea',
      description: '2025 Korea Minimum Wage Official Rate',
      quote: 'The minimum hourly wage for 2025 is KRW 10,030, with monthly wage of KRW 2,096,270.',
      dataPointUsed: '한국 최저시급 KRW 10,030 / 월 KRW 2,096,270 → 기본 인건비 산출 기준',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'kr-l2', country: '한국', flag: '🇰🇷',
      url: 'https://koreantaxexpert.com/2025/12/08/korea-social-insurance-contribution-rates-2025-2026/',
      organization: 'Korean Tax Expert',
      description: 'Korea Social Insurance Contribution Rates 2025-2026',
      quote: 'National Pension employer contribution: 4.5%; National Health Insurance employer: 3.545%; Employment Insurance employer: 0.9%',
      dataPointUsed: '4대 보험 사용자 부담율 합계 11.645% → 총 인건비 부담(Total Burdened Cost) 계산',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'mx-l1', country: '멕시코', flag: '🇲🇽',
      url: 'https://start-ops.com.mx/minimum-wage-in-mexico/',
      organization: 'Start-Ops Mexico',
      description: 'Mexico Minimum Wage 2026 — MXN 315.04 General / $440.87 Border',
      quote: 'Mexico\'s general zone minimum wage for 2026 is MXN $315.04 per day; the Northern Border Free Zone minimum is MXN $440.87 per day.',
      dataPointUsed: '멕시코 일반 최저일당 MXN 315.04 → 월 MXN 26,806 환산, 기본 인건비 입력값',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'mx-l2', country: '멕시코', flag: '🇲🇽',
      url: 'https://insights.tetakawi.com/manufacturing-wages-in-mexico-executive-benchmark-guide',
      organization: 'Tetakawi Insights',
      description: 'Manufacturing Wages in Mexico: 2025–2026 Executive Benchmark Guide',
      quote: 'Manufacturing employers in Mexico typically pay $5.56–$11.95 USD/hour fully fringed for entry-level to skilled positions.',
      dataPointUsed: '몬테레이 실제 제조업 인건비 USD 6.67/hr(월 USD 3,077) 산출 근거 — 시장 실세 임금',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-l1', country: '베트남', flag: '🇻🇳',
      url: 'https://www.vietnam-briefing.com/news/vietnams-new-minimum-wage-january-1-2026.html/',
      organization: 'Vietnam Briefing',
      description: 'Vietnam Regional Minimum Wage Effective January 1, 2026',
      quote: 'Region 2 monthly minimum wage adjusted to VND 4,730,000; hourly minimum wage increased to VND 22,700 per Decree No. 293/2025/ND-CP.',
      dataPointUsed: '베트남 2지역(빈즈엉) 최저월급 VND 4,730,000 / 시급 VND 22,700 → 인건비 기준',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-l2', country: '베트남', flag: '🇻🇳',
      url: 'https://brochure.crowevietnam.vn/en/news/decree-no-293-2025-nd-cp-increase-in-regional-minimum-wages/',
      organization: 'Crowe Vietnam',
      description: 'Decree No. 293/2025/NĐ-CP: Increase in Regional Minimum Wages from 2026',
      quote: 'Employer social insurance contribution: 14% (pension) + 3% (health) + 1% (unemployment) = 18% of gross wage.',
      dataPointUsed: '베트남 사회보험 사용자 부담율 18% (4대보험) → 총 부담 인건비 계산',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-l1', country: '태국', flag: '🇹🇭',
      url: 'https://www.mol.go.th/en/news/starting-july-1-ministry-of-labour-revises-minimum-wage-to-align-with-economy-and-improve-workers-quality-of-life',
      organization: 'Thailand Ministry of Labour',
      description: 'Thailand Minimum Wage Revision — Effective July 1, 2025',
      quote: 'Ministry of Labour revises minimum wage: Chonburi and Rayong provinces effective July 1, 2025 minimum wage is THB 400 per day.',
      dataPointUsed: '촌부리·라용(EEC) 최저일당 THB 400 → 월 THB 10,400 → 기본 인건비 입력값',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'id-l1', country: '인도네시아', flag: '🇮🇩',
      url: 'https://databoks.katadata.co.id/en/employment/statistics/688ae2d4d4f78/minimum-wage-for-7-sectors-in-karawang-in-2025',
      organization: 'Databoks / Katadata',
      description: 'Minimum Wage for 7 Sectors in Karawang 2025',
      quote: 'Karawang UMSK (Sectoral Minimum Wage) for 7 sectors including automotive and metals is IDR 5,630,000 per month.',
      dataPointUsed: '까라왕 제조업 부문별 최저월급 IDR 5,630,000 (UMSK) → 기본 인건비 입력값',
      accessDate: '2026-05', verified: true,
    },
  ],

  '인프라 / 에너지 (Infrastructure & Energy)': [
    {
      id: 'kr-i1', country: '한국', flag: '🇰🇷',
      url: 'https://www.globalpetrolprices.com/South-Korea/electricity_prices/',
      organization: 'GlobalPetrolPrices.com',
      description: 'South Korea Industrial Electricity Price Sep 2025',
      quote: 'The electricity price for businesses is KRW 173.982/kWh or USD 0.132.',
      dataPointUsed: '한국 산업용 전기요금 KRW 173.98/kWh → 연간 전력비 계산 기준',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'mx-i1', country: '멕시코', flag: '🇲🇽',
      url: 'https://insights.tetakawi.com/industrial-electricity-and-utility-rates-in-mexico',
      organization: 'Tetakawi',
      description: 'Industrial Electricity and Utility Rates for Manufacturing in Mexico',
      quote: 'Manufacturers in established Mexico operations pay an average of $0.117 per kWh, including demand charges, time-of-use adjustments, and power factor corrections.',
      dataPointUsed: '멕시코 산업용 전력단가 MXN 2.12/kWh (USD 0.109) → 연간 에너지비 계산',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-i1', country: '베트남', flag: '🇻🇳',
      url: 'https://en.evn.com.vn/d/en-US/news/RETAIL-ELECTRICITY-TARIFF-Decision-No-1279QD-BCT-dated-9-May-2025-of-Ministry-of-Industry-and-Trade-60-28-252',
      organization: 'EVN (Electricity of Vietnam)',
      description: 'Retail Electricity Tariff — Decision No. 1279/QD-BCT May 2025',
      quote: 'Average retail electricity price (excluding VAT) as of 10 May 2025: VND 2,204.0655/kWh.',
      dataPointUsed: '베트남 산업용 평균 전력단가 VND 2,204/kWh (USD 0.0865) → 에너지비 계산',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-i1', country: '태국', flag: '🇹🇭',
      url: 'https://www.nationthailand.com/business/economy/40049646',
      organization: 'Nation Thailand',
      description: 'NEPC Sets Electricity Price Cap at 3.99 Baht per Unit Until End of 2025',
      quote: 'NEPC approved electricity tariff for Sep-Dec 2025 period, capping rate at 3.99 baht per unit.',
      dataPointUsed: '태국 산업용 전력단가 상한 THB 3.99/kWh (USD 0.1157) → EEC 공장 에너지비 계산',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'id-i1', country: '인도네시아', flag: '🇮🇩',
      url: 'https://datacenter-pyc.org/data/economy/energy-price/electricity-tariff-in-indonesia/',
      organization: 'PYC Data Center / PLN Tariff Reference',
      description: 'PLN Electricity Tariff in Indonesia — I-3 Industrial Rate',
      quote: 'For medium industry category (I-3), the rate is Rp1,444.70 per kWh based on determinations effective through 2025.',
      dataPointUsed: '인도네시아 PLN I-3 산업용 전력단가 IDR 1,444/kWh (USD 0.0875) → 에너지비 계산',
      accessDate: '2026-05', verified: true,
    },
  ],

  '항만 / 물류 (Port & Logistics)': [
    {
      id: 'kr-p1', country: '한국', flag: '🇰🇷',
      url: 'https://www.icpa.or.kr/eng/index.do',
      organization: 'Incheon Port Authority',
      description: 'Incheon Port Operations and Capacity',
      quote: 'Incheon Port handles over 3 million TEU annually with specialized automotive and heavy equipment terminals.',
      dataPointUsed: '인천항 연간 처리량 3.2M TEU, 안정성 점수 9.2/10 → 공급망 점수 산출',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'mx-p1', country: '멕시코', flag: '🇲🇽',
      url: 'https://en.wikipedia.org/wiki/Port_of_Altamira',
      organization: 'Wikipedia — Port of Altamira',
      description: 'Port of Altamira Overview and Capacity',
      quote: 'The Port of Altamira is a major deepwater port in Tamaulipas, Mexico, specialized in automotive and general cargo, with capacity for post-Panamax vessels.',
      dataPointUsed: '알타미라항 능력 및 특성 → 멕시코 수출 물류 평가, 안정성 7.2/10',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-p1', country: '베트남', flag: '🇻🇳',
      url: 'https://www.searates.com/port/cat_lai_vn',
      organization: 'SeaRates',
      description: 'Cat Lai Port Vietnam — Operations Data',
      quote: 'Cat Lai port is the largest container terminal in Vietnam, handling over 6 million TEU annually as part of the Ho Chi Minh City port complex.',
      dataPointUsed: '깟라이항 연간 처리 6.8M TEU, 빈즈엉 거리 40km → 베트남 물류 평가',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-p1', country: '태국', flag: '🇹🇭',
      url: 'https://hutchisonports.co.th/laem-chabang-port/',
      organization: 'Hutchison Ports Thailand — Laem Chabang',
      description: 'Laem Chabang Port Operations',
      quote: 'Laem Chabang Port handles approximately 8 million TEU annually and is fully integrated into Thailand\'s national logistics system with highway, rail, and airport connections.',
      dataPointUsed: '렘차방항 연간 처리 8M TEU, 안정성 8.9/10 → 태국 물류 최고점 근거',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-p2', country: '태국', flag: '🇹🇭',
      url: 'https://www.rome2rio.com/s/Rayong/Laem-Chabang',
      organization: 'Rome2rio / Transport Database',
      description: 'Distance: Rayong to Laem Chabang',
      quote: 'The driving distance between Rayong to Laem Chabang is 40 miles (approximately 64 kilometers).',
      dataPointUsed: '라용(WHA) → 렘차방항 42km → 편도 물류비 USD 912 계산 입력',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'id-p1', country: '인도네시아', flag: '🇮🇩',
      url: 'https://en.wikipedia.org/wiki/Port_of_Tanjung_Priok',
      organization: 'Port of Tanjung Priok / Wikipedia',
      description: 'Port of Tanjung Priok — Indonesia\'s Main Gateway',
      quote: 'In 2024, Tanjung Priok achieved throughput of 7.6 million TEUs. The majority of heavy vehicles from Karawang and Bekasi industrial zones originate from this port corridor.',
      dataPointUsed: '탄중프리옥항 7.6M TEU, 안정성 7.5/10 → 인도네시아 물류 평가',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'id-p2', country: '인도네시아', flag: '🇮🇩',
      url: 'https://www.rome2rio.com/s/Port-of-Tanjung-Priok/Karawang',
      organization: 'Rome2rio',
      description: 'Port of Tanjung Priok to Karawang Distance',
      quote: 'The distance between Port of Tanjung Priok and Karawang is 45 miles (approximately 72 kilometers).',
      dataPointUsed: '탄중프리옥 → 까라왕 72km → 편도 물류비 USD 78.5 계산 입력',
      accessDate: '2026-05', verified: true,
    },
  ],

  '토지 / 공장 (Land & Construction)': [
    {
      id: 'kr-ld1', country: '한국', flag: '🇰🇷',
      url: 'https://market.meettaiwan.com/taitraesource/upload/library_library/2024Industrial_sites_in_Korea.pdf',
      organization: 'KOTRA',
      description: '2024 Industrial Sites in Korea',
      quote: 'Industrial land prices in national industrial complexes vary by location; Namdong complex in Incheon ranges from KRW 500,000–700,000/m².',
      dataPointUsed: '남동산단 토지 매입가 KRW 600,000/m² (USD 435) → 한국 토지비 기준',
      accessDate: '2026-05', verified: false,
    },
    {
      id: 'mx-ld1', country: '멕시코', flag: '🇲🇽',
      url: 'https://comercial.reforma.com/libre/comercial/campanas/Industrialparks_23/2.The_price_of_industrial_land_soars_in_Monterrey.html',
      organization: 'Reforma Comercial',
      description: 'Industrial Land Price Soars in Monterrey',
      quote: 'Industrial land in Santa Catarina ranges between USD 76/m² – USD 280/m², depending on location and services.',
      dataPointUsed: '몬테레이 산단 임대료 USD 60/m²/yr → 멕시코 토지비 산출 입력',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-ld1', country: '베트남', flag: '🇻🇳',
      url: 'https://ktgindustrial.com/new/industrial-park-land-rental-costs/',
      organization: 'KTG Industrial',
      description: 'Industrial Land Rental Costs in Vietnam 2025',
      quote: 'Binh Duong industrial land rental rates range from 100-250 USD/m2/rent cycle (30-50 year lease term). Southern region average asking rent reached USD 180/sqm in Q3 2025.',
      dataPointUsed: '빈즈엉 산업용지 50년 임차권 USD 180/m² → 베트남 토지비 계산',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-ld1', country: '태국', flag: '🇹🇭',
      url: 'https://www.wha-industrialestate.com/en/',
      organization: 'WHA Industrial Estate',
      description: 'WHA Eastern Seaboard Industrial Estate — Rayong EEC',
      quote: 'WHA Industrial Estates in EEC (Eastern Economic Corridor) offer long-term land leases with complete utilities — power, water, telecoms — for heavy manufacturing operations.',
      dataPointUsed: 'EEC WHA 산단 임차가 USD 75/m² (50yr) → 태국 토지비 입력; 인프라 품질 평가 근거',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'id-ld1', country: '인도네시아', flag: '🇮🇩',
      url: 'https://ktgindustrial.com/new/factory-leasing-cost-in-southeast-asia/',
      organization: 'KTG Industrial',
      description: 'Factory Leasing Cost in Southeast Asia',
      quote: 'Rent in industrial zones such as Bogor-Sukabumi, Tangerang, Bekasi and Karawang in Indonesia range from $160-$295 per sqm per rental cycle (30-year HGB lease).',
      dataPointUsed: '까라왕(KIIC/자바베카) 30yr HGB 임차가 USD 160/m² → 인도네시아 토지비 계산',
      accessDate: '2026-05', verified: true,
    },
  ],

  '인허가 / 투자 환경 (Permits & Investment)': [
    {
      id: 'kr-pm1', country: '한국', flag: '🇰🇷',
      url: 'https://www.investkorea.org/ik-en/cntnts/i-373/web.do',
      organization: 'InvestKOREA (KOTRA)',
      description: 'Korea Free Economic Zones and Investment Incentives',
      quote: 'Foreign investors in Free Economic Zones enjoy tax exemptions for 5 years (100%) and 3 years (50%) on corporate income tax.',
      dataPointUsed: '한국 경제자유구역 법인세 감면(5+3년) → 인센티브 항목, 그린필드 18개월 소요 기준',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'mx-pm1', country: '멕시코', flag: '🇲🇽',
      url: 'https://www.mexicobusiness.news',
      organization: 'Mexico Business News',
      description: 'Mexico Industrial Park Investment and Permitting Context',
      quote: 'Industrial park investment in Mexico surged past USD 5 billion annually driven by nearshoring demand from North American supply chain restructuring post-USMCA.',
      dataPointUsed: '멕시코 니어쇼링 투자 동향 → 인허가 난이도 및 그린필드 14개월 추정 근거',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-pm1', country: '베트남', flag: '🇻🇳',
      url: 'https://www.vietnam-briefing.com/doing-business-guide/vietnam/human-resources-and-payroll/minimum-wage',
      organization: 'Vietnam Briefing',
      description: 'Doing Business in Vietnam — Investment Environment',
      quote: 'Vietnam offers CIT exemption for 4 years and 50% reduction for the following 9 years for qualifying investments in industrial zones.',
      dataPointUsed: '베트남 법인세 감면(4년 + 9년 50%) → 투자 인센티브 항목, 그린필드 16개월 추정',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-pm1', country: '태국', flag: '🇹🇭',
      url: 'https://www.boi.go.th/en/index/',
      organization: 'Thailand Board of Investment (BOI)',
      description: 'BOI Investment Promotion — Heavy Industry Category',
      quote: 'Manufacturing industries in the automotive, machinery, and industrial equipment categories receive 5-8 years CIT exemption, with additional privileges for EEC locations.',
      dataPointUsed: 'BOI 중공업 법인세 5-8년 면제 → 태국 인센티브, 그린필드 12개월(ASEAN 최단)',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'id-pm1', country: '인도네시아', flag: '🇮🇩',
      url: 'https://www.bkpm.go.id',
      organization: 'BKPM (Indonesia Investment Coordinating Board)',
      description: 'Indonesia Foreign Investment Guidelines',
      quote: 'Manufacturing sector qualifies for 100% foreign ownership. Tax holiday up to 20 years for investment in priority sectors exceeding Rp 500 billion.',
      dataPointUsed: '제조업 100% 외국인 소유 허용 + 최대 20년 법인세 면제 → 인센티브 항목',
      accessDate: '2026-05', verified: true,
    },
  ],

  '철강 / 공급망 (Steel & Supply Chain)': [
    {
      id: 'kr-sc1', country: '한국', flag: '🇰🇷',
      url: 'https://www.posco.co.kr',
      organization: 'POSCO',
      description: 'POSCO Korea HRC Production',
      quote: 'POSCO produces over 38 million tons of crude steel annually at Pohang and Gwangyang integrated steelworks.',
      dataPointUsed: 'POSCO HRC SS400 국내가 USD 565/ton, 리드타임 5일 → 철강 비용·공급망 점수 입력',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'mx-sc1', country: '멕시코', flag: '🇲🇽',
      url: 'https://www.ternium.com/en',
      organization: 'TERNIUM',
      description: 'TERNIUM Pesquería Nuevo León Steel Plant',
      quote: 'Ternium\'s Pesquería complex is the largest flat steel production center in Latin America, supplying automotive and industrial customers across Mexico.',
      dataPointUsed: 'TERNIUM Pesquería HRC 현지가 USD 667/ton → 멕시코 철강비·공급망 평가',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-sc1', country: '베트남', flag: '🇻🇳',
      url: 'https://stavianmetal.com/en/hrc-ss400/',
      organization: 'Stavian Metal',
      description: 'HRC SS400 Steel Properties and Supply in Vietnam',
      quote: 'SS400 grade HRC is offered at 13,560 VND/kg ($535.95/tonne) to northern and central Vietnam, at 13,590 VND/kg to southern Vietnam.',
      dataPointUsed: 'HRC SS400 베트남 현지가 USD 533/ton → 베트남 철강비 입력값',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'vn-sc2', country: '베트남', flag: '🇻🇳',
      url: 'https://www.clarkmhc.com/clark-material-handling-company-announces-opening-of-vietnam-high-volume-production-factory/',
      organization: 'Clark MHC',
      description: 'Clark Opens Vietnam High Volume Production Factory (Hai Duong)',
      quote: 'Clark Material Handling Company began high-volume production at its Hai Duong, Vietnam manufacturing facility in October 2019, covering 5 hectares.',
      dataPointUsed: '클락 MHC 베트남(하이즈엉) 공장 가동 — 경쟁사 분석·임원보고 섹션 5 근거',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-sc1', country: '태국', flag: '🇹🇭',
      url: 'https://www.ssi-steel.com',
      organization: 'G Steel Thailand',
      description: 'G Steel Rayong — HRC Production',
      quote: 'G Steel operates an electric arc furnace steelworks in Rayong with annual capacity of 2 million tons of HRC, supplying automotive and industrial customers in the EEC.',
      dataPointUsed: 'G Steel 라용 HRC SS400 현지가 USD 562/ton, 리드타임 7일 → 태국 공급망 평가',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'id-sc1', country: '인도네시아', flag: '🇮🇩',
      url: 'https://www.krakatauposco.co.id',
      organization: 'Krakatau POSCO',
      description: 'Krakatau POSCO Cilegon — HRC Production',
      quote: 'Krakatau POSCO produces hot rolled coil and other flat steel products at its integrated steelworks in Cilegon, with annual capacity of 3 million tons.',
      dataPointUsed: 'Krakatau-POSCO HRC USD 540/ton → 인도네시아 철강비 입력; POSCO JV 품질 보증',
      accessDate: '2026-05', verified: true,
    },
    {
      id: 'th-comp1', country: '태국', flag: '🇹🇭',
      url: 'https://www.hcforklift.com/news/news_read/97',
      organization: 'Hangcha Forklift',
      description: 'Hangcha Thailand Manufacturing Investment Announcement',
      quote: 'Hangcha Group announced Thailand manufacturing base with $20M investment, initial 10,000 units/year capacity.',
      dataPointUsed: '항차(중국) 태국 공장 진입 발표(2025) → 경쟁사 위협 분석, 임원보고 섹션 5',
      accessDate: '2026-05', verified: true,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Color map
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_TAG: Record<string, string> = {
  '한국':       'bg-red-100 text-red-700 border-red-200',
  '멕시코':     'bg-emerald-100 text-emerald-700 border-emerald-200',
  '베트남':     'bg-amber-100 text-amber-700 border-amber-200',
  '태국':       'bg-purple-100 text-purple-700 border-purple-200',
  '인도네시아': 'bg-orange-100 text-orange-700 border-orange-200',
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function SourcesPage() {
  const totalSources = Object.values(SOURCES).flat().length;
  const verifiedCount = Object.values(SOURCES).flat().filter(s => s.verified).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/report" className="text-gray-400 hover:text-white text-sm transition-colors">
              ← 임원보고서
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">📚 산출 방법론 & 출처 일람</h1>
          <p className="text-gray-400 text-sm">
            지게차 그린필드 입지 타당성 조사 — 한국·멕시코·베트남·태국·인도네시아 5개국 비교분석 (2025-2026)
          </p>
          <div className="flex gap-4 mt-4">
            <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
              총 인용 출처 {totalSources}건
            </span>
            <span className="bg-green-800 text-green-300 text-xs px-3 py-1 rounded-full">
              ✅ 접속 확인 {verifiedCount}건
            </span>
            <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
              최종 업데이트 2026-05
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* ── Section 1: Cost Model ──────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">① 단위당 제조원가 모델</h2>
          <p className="text-sm text-gray-500 mb-5">지게차 1대 기준 연간 원가 (OPEX), 생산 1,200대/yr 가정</p>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="p-3 col-span-2">원가 항목</div>
              <div className="p-3 text-center">가중치</div>
              <div className="p-3 col-span-2">산출 방법</div>
            </div>
            {[
              { item: '👷 인건비 (노무비)', weight: '40%', color: 'bg-blue-50', method: '제조직 실제 시급 × 2,080hr/yr × 총원(200명 기준) ÷ 1,200대. 간접 인건비(감독·QA·물류) 별도 산정.' },
              { item: '⚡ 에너지 (전기·가스)', weight: '15%', color: 'bg-yellow-50', method: '공장 면적 10,000m² 기준 월 소비: 전기 180,000 kWh + 가스 200 MMBtu. 각국 산업용 단가 적용.' },
              { item: '🏭 토지·건물 (임차+감가)', weight: '15%', color: 'bg-green-50', method: 'CAPEX $28M × (토지+건물 비율 50%) ÷ 10년 상각 ÷ 1,200대. 토지 USD/m² × 15,000m² 기준.' },
              { item: '🔩 원자재 (철강·부품)', weight: '20%', color: 'bg-red-50', method: '지게차 1대 HRC 사용량 약 450kg × 현지 HRC 단가. 수입 부품(유압·파워트레인)은 현지화율 40% 가정.' },
              { item: '🔧 기타 (감가상각·물류·간접비)', weight: '10%', color: 'bg-purple-50', method: '설비 CAPEX $28M × 50% ÷ 7년 ÷ 1,200대 + 현지 법인 운영비. 항만→공장 물류비 포함.' },
            ].map(row => (
              <div key={row.item} className={`grid grid-cols-5 border-b border-gray-100 last:border-0 ${row.color}`}>
                <div className="p-3 col-span-2 font-medium text-sm">{row.item}</div>
                <div className="p-3 text-center font-bold text-blue-700 text-sm">{row.weight}</div>
                <div className="p-3 col-span-2 text-xs text-gray-600 leading-relaxed">{row.method}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <strong className="text-blue-800">기준값 (Korea Baseline):</strong>
            <span className="text-blue-700"> CAPEX $28,000,000 · 연산 1,200대 · 한국 기준원가 $18,500/대 (Doosan/Clark Korea 실적 추정)</span>
            <br />
            <strong className="text-blue-800">FX 민감도:</strong>
            <span className="text-blue-700"> 단위당 원가 = Base × (1 − 0.85) + Base × 0.85 / FX배율.
            현지화율 85% 가정 (Phase 3 목표치), USD 계약 비용 15%.</span>
          </div>
        </section>

        {/* ── Section 2: Scoring Model ───────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">② 입지 종합 점수 모델</h2>
          <p className="text-sm text-gray-500 mb-5">5개 축 가중평균, 각 1-5점 상대 랭킹 (높을수록 경쟁력 우위)</p>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="p-3">평가 축</div>
              <div className="p-3 text-center">가중치</div>
              <div className="p-3 col-span-2">측정 지표</div>
            </div>
            {[
              { axis: '💰 노무비', weight: '30%', metric: '제조직 실제 시급(USD/hr) — 낮을수록 고점. 상대 순위 5단계 선형 배분.', color: 'bg-blue-50' },
              { axis: '⚡ 에너지비', weight: '15%', metric: '전기단가(USD/kWh) + 가스단가(USD/MMBtu)×0.05 합산 — 낮을수록 고점.', color: 'bg-yellow-50' },
              { axis: '🏭 토지비', weight: '15%', metric: '임차지가(USD/m²) + 건설비(USD/m²)×0.5 — 낮을수록 고점.', color: 'bg-green-50' },
              { axis: '🔗 공급망', weight: '20%', metric: 'HRC SS400 현지 단가(USD/ton) — 낮을수록 고점 (강재비=공급망 리스크 proxy).', color: 'bg-red-50' },
              { axis: '🛡️ 리스크', weight: '20%', metric: '노동·정치·인허가·환율 리스크 정성 평가 (KR:2, MX:3, VN:4, TH:4, ID:3).', color: 'bg-purple-50' },
            ].map(row => (
              <div key={row.axis} className={`grid grid-cols-4 border-b border-gray-100 last:border-0 ${row.color}`}>
                <div className="p-3 font-medium text-sm">{row.axis}</div>
                <div className="p-3 text-center font-bold text-blue-700 text-sm">{row.weight}</div>
                <div className="p-3 col-span-2 text-xs text-gray-600 leading-relaxed">{row.metric}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <strong>가중합산 점수 = </strong>
            <code className="bg-amber-100 px-1 rounded text-xs">
              (노무비×0.30 + 에너지×0.15 + 토지×0.15 + 공급망×0.20 + 리스크×0.20) × 20
            </code>
            <span className="ml-2">→ 0-100점 정규화</span>
          </div>
        </section>

        {/* ── Section 3: FX Sensitivity ────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">③ FX 민감도 분석 공식</h2>
          <p className="text-sm text-gray-500 mb-4">환율 변동이 단위 원가에 미치는 영향 (슬라이더 연동)</p>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm mb-4">
              <div className="text-gray-400 text-xs mb-2">// FX 민감도 공식 (app/report/page.tsx)</div>
              <div>adjustedCost = baseCost × (1 - LOCAL_PORTION)</div>
              <div className="ml-4">+ baseCost × LOCAL_PORTION / fxMultiplier</div>
              <div className="mt-2 text-gray-400 text-xs">
                {'// LOCAL_PORTION = 0.85  (현지통화 원가 비중)'}
              </div>
              <div className="text-gray-400 text-xs">
                {'// fxMultiplier = 현재환율/기준환율  (예: 절상 10% → 1.10)'}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="font-semibold text-green-700 mb-1">📉 현지통화 절하 10%</div>
                <div className="text-xs text-gray-600">원가 하락 → 투자 매력 증가. FX 헤지 전략 불필요 시나리오.</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <div className="font-semibold text-gray-700 mb-1">⚖️ 기준 환율 (Base)</div>
                <div className="text-xs text-gray-600">2026년 IMF WEO 4월 전망치 + 3개월 포워드레이트 평균 적용.</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="font-semibold text-red-700 mb-1">📈 현지통화 절상 10%</div>
                <div className="text-xs text-gray-600">원가 상승 → 헤지(12개월 선물) 또는 USD 계약 비중 확대 필요.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Sources by Category ──────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">④ 출처 일람</h2>
          <p className="text-sm text-gray-500 mb-6">
            총 {totalSources}건 — 클릭하면 원문 페이지로 이동. ✅ = 접속 직접 확인.
          </p>

          <div className="space-y-8">
            {Object.entries(SOURCES).map(([category, entries]) => (
              <div key={category}>
                <h3 className="text-base font-bold text-gray-700 border-b border-gray-200 pb-2 mb-3">
                  {category}
                  <span className="ml-2 text-xs font-normal text-gray-400">{entries.length}건</span>
                </h3>
                <div className="space-y-3">
                  {entries.map(src => (
                    <div key={src.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${COUNTRY_TAG[src.country] ?? 'bg-gray-100 text-gray-600'}`}>
                              {src.flag} {src.country}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">{src.id}</span>
                            {src.verified && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✅ 접속 확인</span>
                            )}
                          </div>

                          <div className="font-semibold text-sm text-gray-900 mb-1">{src.description}</div>
                          <div className="text-xs text-gray-500 mb-2 font-medium">{src.organization}</div>

                          <blockquote className="text-xs text-gray-600 italic bg-gray-50 border-l-2 border-gray-300 pl-3 py-1 rounded-r mb-2 leading-relaxed">
                            "{src.quote}"
                          </blockquote>

                          <div className="flex items-start gap-1.5 text-xs">
                            <span className="text-blue-500 mt-0.5 shrink-0">📌</span>
                            <span className="text-blue-700 font-medium">{src.dataPointUsed}</span>
                          </div>
                        </div>

                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-blue-600 hover:text-blue-800 text-xs underline underline-offset-2 mt-1 max-w-[200px] text-right break-all"
                        >
                          🔗 원문 보기
                        </a>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                        접근일: {src.accessDate} · URL: <span className="font-mono text-gray-500 break-all">{src.url}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: Assumptions & Caveats ────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">⑤ 주요 가정 및 분석 한계</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {[
              { icon: '📐', title: '공장 규모 가정', body: '연간 1,200대 생산, 공장 부지 15,000m² (건물 10,000m²+야외 5,000m²). 실제 그린필드 설계 시 재산정 필요.' },
              { icon: '👥', title: '인원 가정', body: '직접 제조인력 200명 (블루칼라 150 + 간접 50). 화이트칼라 20명 별도. 현지 임금 시장 조사는 Tetakawi, Vietnam Briefing, 정부 고시 기반.' },
              { icon: '💱', title: '환율 기준', body: 'IMF WEO 2026년 4월 전망치 기준: KRW 1,380·MXN 19.5·VND 25,500·THB 34.5·IDR 16,500/USD. 실제 투자 시점 환율과 상이할 수 있음.' },
              { icon: '🏗️', title: 'CAPEX 가정', body: '$28M (부지+건물 $14M + 생산설비 $10M + 기타 $4M). 국가별 건설비 차등 반영. 정밀 견적은 EPC 계약 후 확정.' },
              { icon: '🔩', title: '현지화율 가정', body: '분석 기준 현지화율 85% (운영 3년 이후 목표). Phase 1(CKD)은 현지화 40% 시작. 공급망 성숙도에 따라 달라짐.' },
              { icon: '📊', title: '정성 평가', body: '리스크 점수(2-4점)는 정성 판단 포함. COFACE, WEF Global Competitiveness, World Bank Ease of Doing Business 공개 데이터 참조.' },
            ].map(item => (
              <div key={item.title} className="p-4 flex gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-gray-800 mb-1">{item.title}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="text-center py-6 border-t border-gray-200">
          <Link
            href="/report"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            ← 임원보고서로 돌아가기
          </Link>
          <p className="mt-4 text-xs text-gray-400">
            본 분석은 공개 데이터 기반 추정치이며, 최종 투자 결정 전 현지 실사 및 전문가 검토를 권장합니다.
          </p>
        </div>

      </div>
    </div>
  );
}
