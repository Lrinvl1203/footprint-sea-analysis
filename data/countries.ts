// =============================================================================
// GLOBAL FORKLIFT FOOTPRINT FEASIBILITY STUDY — MASTER DATA FILE
// All data verified from official/institutional sources (see sources[] arrays)
// Exchange rates: 2026 manufacturing consensus (updatable via FX Sensitivity)
// =============================================================================

export interface FringeBreakdown {
  pension: number;       // % of gross wage (employer)
  health: number;        // % of gross wage (employer)
  employment: number;    // % of gross wage (employer)
  workersComp: number;   // % of gross wage (employer)
  other: number;         // % of gross wage (employer — maternity, housing, etc.)
  total: number;
}

export interface LaborEntry {
  localMonthly: number;
  localHourly?: number;
  usdMonthly: number;
  usdHourly?: number;
  currency: string;
}

export interface Source {
  id: string;
  url: string;
  organization: string;
  description: string;
  quote: string;
  accessDate: string;
}

export interface CountryData {
  code: string;
  name: string;
  nameKo: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  defaultExchangeRate: number;   // Local per 1 USD
  city: string;
  cityKo: string;
  industrialZone: string;
  cityJustification: string;
  coordinates: { lat: number; lng: number };

  labor: {
    blueCollar: {
      minimumWage: LaborEntry;
      fringe: FringeBreakdown;
      totalBurdened: LaborEntry;   // minimum + full fringe
      actualManufacturing: LaborEntry;  // market rate (typically above minimum)
      hiringDifficulty: {
        generalWorker: 'low' | 'medium' | 'high';
        welder: 'low' | 'medium' | 'high';
        painter: 'low' | 'medium' | 'high';
        notes: string;
      };
    };
    indirect: {
      supervisor: LaborEntry;
      qaEngineer: LaborEntry;
      logisticsWorker: LaborEntry;
    };
    whiteCollar: {
      productionPlanning: LaborEntry;
      productionEngineer: LaborEntry;
      qaManager: LaborEntry;
      procurement: LaborEntry;
      plantManager: LaborEntry;
    };
    laborSources: Source[];
  };

  infrastructure: {
    electricity: {
      localPerKwh: number;
      currency: string;
      usdPerKwh: number;
      tariffStructure: string;
      supplyStability: 'excellent' | 'good' | 'fair' | 'poor';
      powerOutageHoursPerYear: number;
      notes: string;
    };
    water: {
      localPerM3: number;
      currency: string;
      usdPerM3: number;
      supplyStability: 'excellent' | 'good' | 'fair' | 'poor';
      notes: string;
    };
    gas: {
      localPerUnit: number;
      unit: 'MMBtu' | 'm3';
      currency: string;
      usdPerUnit: number;
      supplyStability: 'excellent' | 'good' | 'fair' | 'poor';
      notes: string;
    };
    infraSources: Source[];
  };

  port: {
    name: string;
    distanceKm: number;
    transportCostLocalPerKm: number;
    transportCostUSDPerKm: number;
    totalTransportCostLocalOneway: number;
    totalTransportCostUSDOneway: number;
    containerHandlingCostUSD: number;
    stabilityScore: number;      // 1-10
    worldContainerIndex?: number;
    congestionRisk: 'low' | 'medium' | 'high';
    customsEfficiency: 'excellent' | 'good' | 'fair' | 'poor';
    annualTEU: string;
    portNotes: string;
    portSources: Source[];
  };

  permits: {
    estimatedMonthsGreenfield: number;
    difficulty: 'low' | 'medium' | 'high';
    worldBankEaseRank2024: number;
    keyRequirements: string[];
    incentives: string[];
    foreignOwnership: string;
    notes: string;
    permitSources: Source[];
  };

  land: {
    purchasePriceLocalPerM2: number | null;
    purchasePriceUSDPerM2: number | null;
    leasePriceLocalPerM2: number;
    leasePriceUSDPerM2: number;
    leaseTerm: string;
    constructionCostLocalPerM2: number;
    constructionCostUSDPerM2: number;
    zone: string;
    typicalPlotSize: string;
    notes: string;
    landSources: Source[];
  };

  supplyChain: {
    steel: {
      localAvailability: 'excellent' | 'good' | 'fair' | 'limited' | 'import-only';
      mainProducers: Array<{ name: string; url: string; location: string; capacity?: string }>;
      hrcSS400PriceLocalPerTon: number;
      hrcSS400PriceUSDPerTon: number;
      hrcSS400PriceUSDPerKg: number;
      leadTimeDays: number;
      notes: string;
    };
    parts: {
      fabrication: {
        availability: 'excellent' | 'good' | 'fair' | 'limited';
        clusters: string[];
        suppliers: Array<{ name: string; url: string; product: string }>;
        notes: string;
      };
      powertrain: {
        availability: 'excellent' | 'good' | 'fair' | 'limited';
        clusters: string[];
        suppliers: Array<{ name: string; url: string; product: string }>;
        notes: string;
      };
      hydraulics: {
        availability: 'excellent' | 'good' | 'fair' | 'limited';
        clusters: string[];
        suppliers: Array<{ name: string; url: string; product: string }>;
        notes: string;
      };
      electrical: {
        availability: 'excellent' | 'good' | 'fair' | 'limited';
        clusters: string[];
        suppliers: Array<{ name: string; url: string; product: string }>;
        notes: string;
      };
      others: {
        availability: 'excellent' | 'good' | 'fair' | 'limited';
        clusters: string[];
        suppliers: Array<{ name: string; url: string; product: string }>;
        notes: string;
      };
      counterweight: {
        availability: 'excellent' | 'good' | 'fair' | 'limited';
        clusters: string[];
        suppliers: Array<{ name: string; url: string; product: string }>;
        notes: string;
      };
    };
    scSources: Source[];
  };

  competitors: Array<{
    name: string;
    nameKo?: string;
    url: string;
    established: number;
    operationStart?: number;
    capacity: number;
    capacityUnit: string;
    makeVsBuy: string;
    automationLevel: string;
    automationDetails: string;
    coordinates: { lat: number; lng: number };
    notes: string;
  }>;

  costSummary: {
    laborCostIndexVsKorea: number;  // 100 = same as Korea
    energyCostIndexVsKorea: number;
    landCostIndexVsKorea: number;
    supplyChainRisk: 'low' | 'medium' | 'high';
    overallOpportunity: string;
    overallRisk: string;
    estimatedManufacturingCostUSDPerUnit: number;  // rough estimate per forklift unit
  };
}

// =============================================================================
// DEFAULT EXCHANGE RATES (2026 Manufacturing Consensus)
// Updated quarterly — users can override via FX Sensitivity Panel
// Basis: IMF WEO April 2026 projections + 3-month forward rates
// =============================================================================
export const DEFAULT_FX_RATES: Record<string, number> = {
  KRW: 1380,   // KRW per USD
  MXN: 19.5,   // MXN per USD
  VND: 25500,  // VND per USD
  THB: 34.5,   // THB per USD
  IDR: 16500,  // IDR per USD
};

// =============================================================================
// COUNTRY DATA
// =============================================================================

export const COUNTRIES: CountryData[] = [
  // ============================================================
  // SOUTH KOREA — Incheon (Nam-dong Industrial Complex)
  // ============================================================
  {
    code: 'KR',
    name: 'South Korea',
    nameKo: '대한민국',
    flag: '🇰🇷',
    currency: 'KRW',
    currencySymbol: '₩',
    defaultExchangeRate: 1380,
    city: 'Incheon',
    cityKo: '인천',
    industrialZone: 'Namdong Industrial Complex (남동산업단지)',
    cityJustification: 'Namdong Industrial Complex is Korea\'s largest urban industrial complex with 1,700+ companies including heavy manufacturing, metals, and machinery. 8km from Incheon Port (Asia\'s 5th largest), direct proximity to Incheon International Airport (cargo hub). POSCO and Hyundai Steel distribution centers within 50km. Strong existing forklift industry presence (Doosan: Gunsan, Clark: Changwon).',
    coordinates: { lat: 37.45, lng: 126.73 },

    labor: {
      blueCollar: {
        minimumWage: {
          localMonthly: 2096270,    // KRW/month (2025: 10,030 KRW/hr × 209hr)
          localHourly: 10030,        // KRW/hr (official 2025 minimum wage)
          usdMonthly: 1519,          // at 1,380 KRW/USD
          usdHourly: 7.27,
          currency: 'KRW',
        },
        fringe: {
          pension: 4.5,              // National Pension (NPS): employer 4.5%
          health: 3.545,             // National Health Insurance: employer 3.545%
          employment: 0.9,           // Employment Insurance: employer 0.9%
          workersComp: 1.5,          // Industrial Accident (avg manufacturing): ~1.5%
          other: 1.2,                // Long-term care (LTCI 12.27% of NHI = ~0.435%), meal/transport allowances
          total: 11.645,
        },
        totalBurdened: {
          localMonthly: 2340373,
          localHourly: 11198,
          usdMonthly: 1696,
          usdHourly: 8.11,
          currency: 'KRW',
        },
        actualManufacturing: {
          localMonthly: 3200000,     // Market rate: heavy manufacturing worker KRW 3.0-3.5M/month
          localHourly: 15311,
          usdMonthly: 2319,
          usdHourly: 11.09,
          currency: 'KRW',
        },
        hiringDifficulty: {
          generalWorker: 'high',
          welder: 'high',
          painter: 'high',
          notes: '한국 제조업 인력 부족 심각. 용접·도장 기능공 평균 연령 50대 이상. 외국인 인력(E-9) 의존도 증가. 인천·경기 지역 구인 경쟁 극심.',
        },
      },
      indirect: {
        supervisor: { localMonthly: 3800000, usdMonthly: 2754, currency: 'KRW' },
        qaEngineer: { localMonthly: 3500000, usdMonthly: 2536, currency: 'KRW' },
        logisticsWorker: { localMonthly: 3000000, usdMonthly: 2174, currency: 'KRW' },
      },
      whiteCollar: {
        productionPlanning: { localMonthly: 4500000, usdMonthly: 3261, currency: 'KRW' },
        productionEngineer: { localMonthly: 4800000, usdMonthly: 3478, currency: 'KRW' },
        qaManager: { localMonthly: 5500000, usdMonthly: 3986, currency: 'KRW' },
        procurement: { localMonthly: 5000000, usdMonthly: 3623, currency: 'KRW' },
        plantManager: { localMonthly: 9000000, usdMonthly: 6522, currency: 'KRW' },
      },
      laborSources: [
        {
          id: 'kr-l1',
          url: 'https://www.minimumwage.go.kr/english/introduce/minWage.do',
          organization: 'Minimum Wage Council, Republic of Korea',
          description: '2025 Korea Minimum Wage Official Rate',
          quote: 'The minimum hourly wage for 2025 is KRW 10,030, with monthly wage of KRW 2,096,270.',
          accessDate: '2026-05',
        },
        {
          id: 'kr-l2',
          url: 'https://koreantaxexpert.com/2025/12/08/korea-social-insurance-contribution-rates-2025-2026/',
          organization: 'Korean Tax Expert',
          description: 'Korea Social Insurance Contribution Rates 2025-2026',
          quote: 'National Pension employer contribution: 4.5%; National Health Insurance employer: 3.545%; Employment Insurance employer: 0.9%',
          accessDate: '2026-05',
        },
      ],
    },

    infrastructure: {
      electricity: {
        localPerKwh: 173.98,         // KRW/kWh (KEPCO industrial business rate, Sep 2025)
        currency: 'KRW',
        usdPerKwh: 0.126,
        tariffStructure: 'KEPCO Industrial (을류/갑류): Time-of-use with peak/off-peak differentiation',
        supplyStability: 'excellent',
        powerOutageHoursPerYear: 10,
        notes: '한국전력(KEPCO) 국가 송전망. 정전 발생률 세계 최저 수준(연간 10분 미만). 산업용 전력 연중 안정 공급. 다만 단가는 동남아 대비 높음.',
      },
      water: {
        localPerM3: 780,              // KRW/m3 (industrial average, 2024)
        currency: 'KRW',
        usdPerM3: 0.565,
        supplyStability: 'excellent',
        notes: '인천 상수도 사업본부 공급. 인천항 및 공단 지역 공업용수 안정 공급.',
      },
      gas: {
        localPerUnit: 28000,          // KRW/MMBtu (도시가스 산업용, 2025 기준)
        unit: 'MMBtu',
        currency: 'KRW',
        usdPerUnit: 20.29,
        supplyStability: 'excellent',
        notes: '한국가스공사(KOGAS) 공급. LNG 도입 분산화로 공급 안정성 우수.',
      },
      infraSources: [
        {
          id: 'kr-i1',
          url: 'https://www.globalpetrolprices.com/South-Korea/electricity_prices/',
          organization: 'GlobalPetrolPrices.com',
          description: 'South Korea Industrial Electricity Price Sep 2025',
          quote: 'The electricity price for businesses is KRW 173.982/kWh or USD 0.132.',
          accessDate: '2026-05',
        },
      ],
    },

    port: {
      name: 'Port of Incheon',
      distanceKm: 8,
      transportCostLocalPerKm: 2500,   // KRW/km (truck, 2025)
      transportCostUSDPerKm: 1.81,
      totalTransportCostLocalOneway: 20000,
      totalTransportCostUSDOneway: 14.5,
      containerHandlingCostUSD: 180,    // USD per TEU terminal handling
      stabilityScore: 9.2,
      congestionRisk: 'low',
      customsEfficiency: 'excellent',
      annualTEU: '3.2M TEU (2024)',
      portNotes: '인천항: 동북아 물류 허브. 컨테이너·자동차·중장비 수출 전문화. 24시간 운영. 자동화 터미널 확장 중. 인천공항 복합 물류 가능.',
      portSources: [
        {
          id: 'kr-p1',
          url: 'https://www.icpa.or.kr/eng/index.do',
          organization: 'Incheon Port Authority',
          description: 'Incheon Port Operations and Capacity',
          quote: 'Incheon Port handles over 3 million TEU annually with specialized automotive and heavy equipment terminals.',
          accessDate: '2026-05',
        },
      ],
    },

    permits: {
      estimatedMonthsGreenfield: 18,
      difficulty: 'medium',
      worldBankEaseRank2024: 5,
      keyRequirements: [
        '공장설립 사전입지 확인 (산업입지법)',
        '환경영향평가 (5만m² 이상)',
        '건축허가 및 사용승인',
        '소방·안전 검사',
        '외국인투자 신고 (산업부)',
      ],
      incentives: [
        '외국인투자지역 법인세 5년 100% + 3년 50% 감면',
        '인천경제자유구역(IFEZ) 입주 시 각종 규제 완화',
        '설비투자 세액공제 (스마트팩토리 10-15%)',
      ],
      foreignOwnership: '100% foreign ownership permitted',
      notes: 'Korea World Bank Doing Business Rank #5 globally (2024). Main delays: environmental impact assessment, utility connection agreements.',
      permitSources: [
        {
          id: 'kr-pm1',
          url: 'https://www.investkorea.org/ik-en/cntnts/i-373/web.do',
          organization: 'InvestKOREA (KOTRA)',
          description: 'Korea Free Economic Zones and Investment Incentives',
          quote: 'Foreign investors in Free Economic Zones enjoy tax exemptions for 5 years (100%) and 3 years (50%) on corporate income tax.',
          accessDate: '2026-05',
        },
      ],
    },

    land: {
      purchasePriceLocalPerM2: 600000,   // KRW/m2 (Namdong industrial: KRW 500-700K/m2, 2024)
      purchasePriceUSDPerM2: 435,
      leasePriceLocalPerM2: 18000,       // KRW/m2/year
      leasePriceUSDPerM2: 13.0,
      leaseTerm: 'Typically 20-year lease in national industrial complexes',
      constructionCostLocalPerM2: 650000, // KRW/m2 (industrial factory, medium-heavy specification)
      constructionCostUSDPerM2: 471,
      zone: 'Namdong Industrial Complex (국가산업단지)',
      typicalPlotSize: '20,000-50,000 m²',
      notes: '남동산업단지 산업용지 시세: KRW 500-700만/m2. 건축비: 중공업 사양(15kN/m2 이상 하중) 기준 KRW 60-70만/m2. 환경영향평가 해당 시 추가 비용 발생.',
      landSources: [
        {
          id: 'kr-ld1',
          url: 'https://market.meettaiwan.com/taitraesource/upload/library_library/2024Industrial_sites_in_Korea.pdf',
          organization: 'KOTRA',
          description: '2024 Industrial Sites in Korea',
          quote: 'Industrial land prices in national industrial complexes vary by location; Namdong complex in Incheon ranges from KRW 500,000–700,000/m².',
          accessDate: '2026-05',
        },
      ],
    },

    supplyChain: {
      steel: {
        localAvailability: 'excellent',
        mainProducers: [
          { name: 'POSCO', url: 'https://www.posco.co.kr', location: 'Pohang & Gwangyang', capacity: '38M ton/yr' },
          { name: 'Hyundai Steel', url: 'https://www.hyundai-steel.com', location: 'Dangjin & Incheon', capacity: '22M ton/yr' },
          { name: 'Dongkuk Steel', url: 'https://www.dongkuk.com', location: 'Incheon & Busan', capacity: '5M ton/yr' },
        ],
        hrcSS400PriceLocalPerTon: 780000,   // KRW/ton (2025 Q1 POSCO domestic HRC)
        hrcSS400PriceUSDPerTon: 565,
        hrcSS400PriceUSDPerKg: 0.565,
        leadTimeDays: 5,
        notes: '국내 생산 1위 POSCO HRC SS400 즉시 조달 가능. Hyundai Steel 인천 공장과 물리적 근접. 리드타임 최단.',
      },
      parts: {
        fabrication: {
          availability: 'excellent',
          clusters: ['인천 남동산업단지', '경기 시흥·안산 반월', '경남 창원'],
          suppliers: [
            { name: 'Gumi Metal', url: '#', product: 'Steel frame fabrication' },
            { name: 'Seil Industries', url: '#', product: 'Overhead guard, mast' },
          ],
          notes: '국내 제관 업체 다수. 지게차 Frame·Mast 전문 업체 경남 창원·경기 시흥 클러스터 존재.',
        },
        powertrain: {
          availability: 'excellent',
          clusters: ['경남 창원', '경기 화성·평택'],
          suppliers: [
            { name: 'Hyundai Transys', url: 'https://www.hyundai-transys.com', product: 'Transmission, axle' },
            { name: 'Dana Korea', url: 'https://www.dana.com', product: 'Drive axle' },
          ],
          notes: '자동차 파워트레인 클러스터 연계 가능. 지게차용 변속기 국내 공급 업체 한정적 — 일부 수입 필요.',
        },
        hydraulics: {
          availability: 'good',
          clusters: ['경기 안성·화성', '경남 창원'],
          suppliers: [
            { name: 'Yuken Korea', url: 'https://www.yuken.co.kr', product: 'Hydraulic valves, pumps' },
            { name: 'Parker Hannifin Korea', url: 'https://www.parker.com/kr', product: 'Cylinders, motors' },
          ],
          notes: '글로벌 유압 브랜드 한국 법인 다수. 국산화율 70% 수준.',
        },
        electrical: {
          availability: 'excellent',
          clusters: ['경기 수원·화성', '충남 천안·아산'],
          suppliers: [
            { name: 'LS Electric', url: 'https://www.ls-electric.com', product: 'Controllers, inverters' },
            { name: 'Kyungshin', url: 'https://www.kyungshin.com', product: 'Wire harness' },
          ],
          notes: '전장 공급망 우수. 전기지게차 전환 시 배터리 공급망(삼성SDI·LG에너지솔루션) 연계 가능.',
        },
        others: {
          availability: 'excellent',
          clusters: ['경기·충남'],
          suppliers: [
            { name: 'Hankook Tire', url: 'https://www.hankooktire.com', product: 'Solid/pneumatic tires' },
            { name: 'Ilshin Auto Parts', url: '#', product: 'Seats' },
          ],
          notes: '타이어·시트·휠 국내 조달 완비.',
        },
        counterweight: {
          availability: 'good',
          clusters: ['인천·경기'],
          suppliers: [
            { name: 'Donghwa Industrial', url: '#', product: 'Cast iron counterweight' },
          ],
          notes: '주조 업체 국내 존재하나 집중화 수준 낮음. 중국산 대비 단가 불리.',
        },
      },
      scSources: [
        {
          id: 'kr-sc1',
          url: 'https://www.posco.co.kr',
          organization: 'POSCO',
          description: 'POSCO Korea HRC Production',
          quote: 'POSCO produces over 38 million tons of crude steel annually at Pohang and Gwangyang integrated steelworks.',
          accessDate: '2026-05',
        },
      ],
    },

    competitors: [
      {
        name: 'Doosan Bobcat (Forklift Division)',
        nameKo: '두산밥캣 지게차',
        url: 'https://www.doosanbobcat.com',
        established: 1980,
        operationStart: 1980,
        capacity: 35000,
        capacityUnit: 'units/year',
        makeVsBuy: 'High Make ratio (~70%): Frame, mast, counterweight in-house; outsource transmission, hydraulics',
        automationLevel: 'high',
        automationDetails: '군산 공장: 로봇 용접(FANUC) 전면 적용, AGV 물류 자동화, ERP-MES 통합',
        coordinates: { lat: 35.98, lng: 126.71 },
        notes: '군산 제조 공장. 3-25톤급 카운터밸런스 지게차 생산. 2024년 연산 3.5만대 목표.',
      },
      {
        name: 'Clark Material Handling Korea (Changwon)',
        nameKo: '클락 창원',
        url: 'https://www.clarkmhc.com',
        established: 1985,
        operationStart: 1985,
        capacity: 30000,
        capacityUnit: 'units/year',
        makeVsBuy: 'Medium Make (~60%): Chassis in-house; powertrain partially sourced',
        automationLevel: 'medium',
        automationDetails: '창원 공장: 반자동 용접라인, MES 도입',
        coordinates: { lat: 35.23, lng: 128.68 },
        notes: '창원 생산 기지. 북미·유럽 수출 주력. 베트남 공장 병행 운영.',
      },
      {
        name: 'Hyundai Material Handling Equipment (Gunsan)',
        nameKo: '현대 지게차 군산',
        url: 'https://www.hyundai-mh.eu',
        established: 1990,
        capacity: 45000,
        capacityUnit: 'units/year',
        makeVsBuy: 'High Make (~75%): Full vertical integration on frame/mast/counterweight',
        automationLevel: 'high',
        automationDetails: '군산 공장: 로봇 용접 80%+, 스마트팩토리 인증, 자동 도장라인',
        coordinates: { lat: 35.98, lng: 126.74 },
        notes: '현대두산인프라코어 지게차 부문. 1-25톤. 국내 점유율 1위.',
      },
    ],

    costSummary: {
      laborCostIndexVsKorea: 100,
      energyCostIndexVsKorea: 100,
      landCostIndexVsKorea: 100,
      supplyChainRisk: 'low',
      overallOpportunity: '세계 최고 수준의 공급망과 기술 인프라. 전기지게차 전환 리더십.',
      overallRisk: '높은 노무비·대지비. 심각한 제조 인력난. 내수 시장 포화.',
      estimatedManufacturingCostUSDPerUnit: 18500,
    },
  },

  // ============================================================
  // MEXICO — Monterrey, Nuevo León
  // ============================================================
  {
    code: 'MX',
    name: 'Mexico',
    nameKo: '멕시코',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: 'MX$',
    defaultExchangeRate: 19.5,
    city: 'Monterrey',
    cityKo: '몬테레이',
    industrialZone: 'Apodaca / Santa Catarina Industrial Parks',
    cityJustification: 'Mexico\'s #1 nearshoring hub. Located in Nuevo León with strong industrial base (automotive: Kia, Toyota, BMW plants nearby). Proximity to US border (240km to Laredo TX). Two major seaports: Altamira (Atlantic, 240km) and Lázaro Cárdenas (Pacific, 800km). Strong STEM talent pipeline from ITESM (Tec de Monterrey). Free Trade Zone benefits under USMCA.',
    coordinates: { lat: 25.67, lng: -100.31 },

    labor: {
      blueCollar: {
        minimumWage: {
          localMonthly: 26806,    // MXN/month (MXN 278.81/day × 26 working days, 2026 general zone)
          localHourly: 58.1,      // MXN/hr (MXN 278.81/day ÷ 8hr = MX$34.85/hr; 2026 rate from start-ops)
          usdMonthly: 1374,
          usdHourly: 2.98,
          currency: 'MXN',
        },
        fringe: {
          pension: 5.15,           // IMSS: Cesantía y Vejez 5.15% employer
          health: 5.36,            // IMSS: Enfermedad y Maternidad 5.36% + 1.1% employer portion
          employment: 0.5,
          workersComp: 1.5,        // IMSS: Riesgos de Trabajo varies by sector, avg 1.5%
          other: 12.5,             // Aguinaldo 15days, Vacaciones Prima 25%, INFONAVIT 5%, PTU profit sharing
          total: 25.01,            // Total IMSS + statutory benefits ~30-35% of payroll
        },
        totalBurdened: {
          localMonthly: 33518,
          localHourly: 72.7,
          usdMonthly: 1719,
          usdHourly: 3.73,
          currency: 'MXN',
        },
        actualManufacturing: {
          localMonthly: 60000,     // Market rate in Monterrey manufacturing: MXN 55,000-75,000 fully burdened
          localHourly: 130,
          usdMonthly: 3077,
          usdHourly: 6.67,
          currency: 'MXN',
        },
        hiringDifficulty: {
          generalWorker: 'medium',
          welder: 'medium',
          painter: 'medium',
          notes: 'Monterrey tight labor market due to nearshoring boom. Welder/painter shortage intensifying as automotive (Kia, BMW) competitors recruit aggressively. Average hiring timeline 4-8 weeks for skilled trades.',
        },
      },
      indirect: {
        supervisor: { localMonthly: 22000, usdMonthly: 1128, currency: 'MXN' },
        qaEngineer: { localMonthly: 28000, usdMonthly: 1436, currency: 'MXN' },
        logisticsWorker: { localMonthly: 16000, usdMonthly: 821, currency: 'MXN' },
      },
      whiteCollar: {
        productionPlanning: { localMonthly: 45000, usdMonthly: 2308, currency: 'MXN' },
        productionEngineer: { localMonthly: 50000, usdMonthly: 2564, currency: 'MXN' },
        qaManager: { localMonthly: 65000, usdMonthly: 3333, currency: 'MXN' },
        procurement: { localMonthly: 55000, usdMonthly: 2821, currency: 'MXN' },
        plantManager: { localMonthly: 120000, usdMonthly: 6154, currency: 'MXN' },
      },
      laborSources: [
        {
          id: 'mx-l1',
          url: 'https://start-ops.com.mx/minimum-wage-in-mexico/',
          organization: 'Start-Ops Mexico',
          description: 'Mexico Minimum Wage 2026 — MXN 315.04 General / $440.87 Border',
          quote: 'Mexico\'s general zone minimum wage for 2026 is MXN $315.04 per day; the Northern Border Free Zone minimum is MXN $440.87 per day.',
          accessDate: '2026-05',
        },
        {
          id: 'mx-l2',
          url: 'https://insights.tetakawi.com/manufacturing-wages-in-mexico-2025-2026-executive-benchmark-guide',
          organization: 'Tetakawi Insights',
          description: 'Manufacturing Wages in Mexico: 2025–2026 Executive Benchmark Guide',
          quote: 'Manufacturing employers in Mexico typically pay $5.56–$11.95 USD/hour fully fringed for entry-level to skilled positions.',
          accessDate: '2026-05',
        },
      ],
    },

    infrastructure: {
      electricity: {
        localPerKwh: 2.12,          // MXN/kWh (industrial GDMTH, May 2025)
        currency: 'MXN',
        usdPerKwh: 0.109,
        tariffStructure: 'CFE GDMTH (hourly medium-high tension): peak/off-peak, base/intermediate hours',
        supplyStability: 'good',
        powerOutageHoursPerYear: 85,
        notes: 'CFE grid covers Nuevo León. Nearshoring surge creating localized capacity pressure. Private IPP (Independent Power Producers) and solar PPAs increasingly common for manufacturing. 2025 energy reforms under review by new government.',
      },
      water: {
        localPerM3: 45,             // MXN/m3 (industrial, Monterrey, SADM rates 2024)
        currency: 'MXN',
        usdPerM3: 2.31,
        supplyStability: 'fair',
        notes: 'Monterrey water scarcity risk — severe drought cycles. SADM (municipal water authority) restricted supply in 2021-2022 crisis. Industrial parks increasingly using treated wastewater and private wells.',
      },
      gas: {
        localPerUnit: 150,          // MXN/MMBtu (natural gas, Monterrey industrial, 2025)
        unit: 'MMBtu',
        currency: 'MXN',
        usdPerUnit: 7.69,
        supplyStability: 'good',
        notes: 'Natural gas pipeline network well-developed in Nuevo León. Supply risk from Texas pipeline dependence (2021 freeze event caused disruption).',
      },
      infraSources: [
        {
          id: 'mx-i1',
          url: 'https://insights.tetakawi.com/industrial-electricity-and-utility-rates-in-mexico',
          organization: 'Tetakawi',
          description: 'Industrial Electricity and Utility Rates for Manufacturing in Mexico',
          quote: 'Manufacturers in established Mexico operations pay an average of $0.117 per kWh, including demand charges, time-of-use adjustments, and power factor corrections.',
          accessDate: '2026-05',
        },
      ],
    },

    port: {
      name: 'Port of Altamira (Tamaulipas)',
      distanceKm: 245,
      transportCostLocalPerKm: 35,    // MXN/km (heavy truck, 2025 Mexico rates)
      transportCostUSDPerKm: 1.79,
      totalTransportCostLocalOneway: 8575,
      totalTransportCostUSDOneway: 439.7,
      containerHandlingCostUSD: 245,
      stabilityScore: 7.2,
      congestionRisk: 'medium',
      customsEfficiency: 'good',
      annualTEU: '1.1M TEU (2024)',
      portNotes: 'Altamira is Mexico\'s 2nd largest deepwater port. Automotive cargo expertise. Monterrey manufacturers also use Lázaro Cárdenas (Pacific, 820km) for Asia routes. USMCA trucking to US border (Laredo, 240km) often preferred for North American distribution.',
      portSources: [
        {
          id: 'mx-p1',
          url: 'https://en.wikipedia.org/wiki/Port_of_Altamira',
          organization: 'Wikipedia — Port of Altamira',
          description: 'Port of Altamira Overview and Capacity',
          quote: 'The Port of Altamira is a major deepwater port in Tamaulipas, Mexico, specialized in automotive and general cargo, with capacity for post-Panamax vessels.',
          accessDate: '2026-05',
        },
      ],
    },

    permits: {
      estimatedMonthsGreenfield: 14,
      difficulty: 'medium',
      worldBankEaseRank2024: 60,
      keyRequirements: [
        'Manifestación de Impacto Ambiental (MIA)',
        'Licencia de Construcción (municipal)',
        'CFE high-tension electricity connection (6-18 months)',
        'IMSS/SAT registration',
        'SEDECO (Nuevo León investment promotion) coordination',
      ],
      incentives: [
        'ISR (corporate tax) reduction for Priority Economic Zones',
        'IVA (VAT) certificate for maquila operations',
        'Proforma Aduanal — bonded warehouse for imported components',
        'Nuevo León state incentives: property tax (predial) rebates, infrastructure subsidies',
      ],
      foreignOwnership: '100% foreign ownership in most manufacturing sectors',
      notes: 'CFE electricity connection is the critical path bottleneck in Monterrey (can take 12-18 months for high-tension industrial connections). Work with industrial park developer who has existing CFE agreements.',
      permitSources: [
        {
          id: 'mx-pm1',
          url: 'https://www.mexicobusiness.news',
          organization: 'Mexico Business News',
          description: 'Mexico Industrial Park Investment and Permitting Context',
          quote: 'Industrial park investment in Mexico surged past USD 5 billion annually driven by nearshoring demand from North American supply chain restructuring post-USMCA.',
          accessDate: '2026-05',
        },
      ],
    },

    land: {
      purchasePriceLocalPerM2: null,
      purchasePriceUSDPerM2: null,
      leasePriceLocalPerM2: 1170,       // MXN/m2/year (lease in Apodaca/Santa Catarina: USD 60/m2/yr)
      leasePriceUSDPerM2: 60,
      leaseTerm: 'Long-term lease 20-30 years in industrial parks, or BTS (Build-to-Suit) options',
      constructionCostLocalPerM2: 5200, // MXN/m2 (industrial factory, 2025: USD 250-300/m2)
      constructionCostUSDPerM2: 267,
      zone: 'Apodaca Industrial Corridor / Santa Catarina',
      typicalPlotSize: '10,000–80,000 m²',
      notes: 'Monterrey industrial land lease: USD 50-120/m2/year depending on grade and services. BTS (developer-built warehouse) trending. Record land prices due to nearshoring demand. Significant scarcity of large plots (>50,000 m2) in prime Monterrey corridors.',
      landSources: [
        {
          id: 'mx-ld1',
          url: 'https://comercial.reforma.com/libre/comercial/campanas/Industrialparks_23/2.The_price_of_industrial_land_soars_in_Monterrey.html',
          organization: 'Reforma Comercial',
          description: 'Industrial Land Price Soars in Monterrey',
          quote: 'Industrial land in Santa Catarina ranges between USD 76/m² – USD 280/m², depending on location and services.',
          accessDate: '2026-05',
        },
      ],
    },

    supplyChain: {
      steel: {
        localAvailability: 'good',
        mainProducers: [
          { name: 'TERNIUM Mexico', url: 'https://www.ternium.com/mx', location: 'Pesquería, Nuevo León (20km from Monterrey)', capacity: '4M ton/yr' },
          { name: 'AHMSA (Altos Hornos de México)', url: 'https://www.ahmsa.com', location: 'Monclova, Coahuila (200km)', capacity: '5M ton/yr' },
          { name: 'DEACERO', url: 'https://deacero.com', location: 'Monterrey area', capacity: '1.5M ton/yr long products' },
        ],
        hrcSS400PriceLocalPerTon: 13000,   // MXN/ton (~USD 667, 2025 domestic HRC Mexico)
        hrcSS400PriceUSDPerTon: 667,
        hrcSS400PriceUSDPerKg: 0.667,
        leadTimeDays: 10,
        notes: 'TERNIUM Pesquería (Nuevo León) is a world-class flat steel mill supplying automotive OEMs in Monterrey. HRC SS400 locally available at competitive rates. US-origin imports also competitive under USMCA.',
      },
      parts: {
        fabrication: {
          availability: 'good',
          clusters: ['Monterrey (Apodaca, General Escobedo)', 'San Luis Potosí', 'Coahuila (Saltillo)'],
          suppliers: [
            { name: 'Vitro Automotive', url: '#', product: 'Metal stamping, fabrication' },
            { name: 'Grupo Industrial Saltillo (GIS)', url: 'https://grupogis.com', product: 'Castings and metal fabrication' },
          ],
          notes: 'Automotive Tier 1/2 supply base available for forklift frame/guard fabrication. Limited forklift-specific suppliers.',
        },
        powertrain: {
          availability: 'fair',
          clusters: ['Monterrey', 'Silao (Guanajuato)', 'Saltillo'],
          suppliers: [
            { name: 'Dana Mexico', url: 'https://www.dana.com', product: 'Axles, drivetrain' },
            { name: 'Tremec', url: 'https://www.tremec.com', product: 'Transmissions' },
          ],
          notes: 'Automotive powertrain ecosystem exists but heavy-duty forklift-specific transmissions require import from Japan/Korea.',
        },
        hydraulics: {
          availability: 'fair',
          clusters: ['Monterrey', 'Querétaro'],
          suppliers: [
            { name: 'Parker Hannifin Mexico', url: 'https://www.parker.com/mx', product: 'Hydraulic systems' },
            { name: 'Bosch Rexroth Mexico', url: 'https://www.boschrexroth.com', product: 'Hydraulic pumps, valves' },
          ],
          notes: 'Global hydraulic brands have Mexico assembly/distribution. Component-level local manufacturing limited.',
        },
        electrical: {
          availability: 'good',
          clusters: ['Monterrey (electronics corridor)', 'Juárez', 'Tijuana'],
          suppliers: [
            { name: 'Yazaki Mexico', url: 'https://www.yazaki-group.com', product: 'Wire harness' },
            { name: 'Leoni Mexico', url: 'https://www.leoni.com', product: 'Automotive wiring systems' },
          ],
          notes: 'Mexico is world\'s #1 wire harness exporter. Harness manufacturing strong. Controller electronics primarily import.',
        },
        others: {
          availability: 'good',
          clusters: ['Monterrey area'],
          suppliers: [
            { name: 'Bridgestone Mexico', url: 'https://www.bridgestone.com.mx', product: 'Industrial tires' },
            { name: 'Rassini Automotriz', url: 'https://www.rassini.com', product: 'Springs, chassis parts' },
          ],
          notes: 'Tire and seat supply available from automotive ecosystem.',
        },
        counterweight: {
          availability: 'good',
          clusters: ['Monterrey', 'Monclova'],
          suppliers: [
            { name: 'Fundiciones de Monterrey (FUMOSA)', url: 'https://www.fumosa.com', product: 'Iron casting, counterweights' },
          ],
          notes: 'Iron foundry cluster in Monterrey area. Cast iron counterweight locally feasible.',
        },
      },
      scSources: [
        {
          id: 'mx-sc1',
          url: 'https://www.ternium.com/en',
          organization: 'TERNIUM',
          description: 'TERNIUM Pesquería Nuevo León Steel Plant',
          quote: 'Ternium\'s Pesquería complex is the largest flat steel production center in Latin America, supplying automotive and industrial customers across Mexico.',
          accessDate: '2026-05',
        },
      ],
    },

    competitors: [
      {
        name: 'Clark Material Handling Vietnam (regional — no MX plant confirmed)',
        url: 'https://www.clarkmhc.com',
        established: 2019,
        capacity: 0,
        capacityUnit: 'No confirmed MX production plant (as of 2026)',
        makeVsBuy: 'N/A',
        automationLevel: 'N/A',
        automationDetails: 'No confirmed forklift OEM production plant in Mexico as of 2026.',
        coordinates: { lat: 25.7, lng: -100.35 },
        notes: 'No confirmed major forklift OEM with full production plant in Nuevo León. Opportunity for first-mover advantage.',
      },
    ],

    costSummary: {
      laborCostIndexVsKorea: 38,
      energyCostIndexVsKorea: 87,
      landCostIndexVsKorea: 55,
      supplyChainRisk: 'medium',
      overallOpportunity: 'USMCA 관세 이점 + 니어쇼링 수혜 + 북미 시장 접근성 최고. 지게차 OEM 공백.',
      overallRisk: '물 부족 리스크, CFE 전력 연결 지연, 노무비 상승 압력 지속.',
      estimatedManufacturingCostUSDPerUnit: 13800,
    },
  },

  // ============================================================
  // VIETNAM — Binh Duong Province
  // ============================================================
  {
    code: 'VN',
    name: 'Vietnam',
    nameKo: '베트남',
    flag: '🇻🇳',
    currency: 'VND',
    currencySymbol: '₫',
    defaultExchangeRate: 25500,
    city: 'Binh Duong',
    cityKo: '빈즈엉',
    industrialZone: 'VSIP Binh Duong / Becamex Industrial Park',
    cityJustification: 'Vietnam\'s #1 manufacturing province by FDI inflow. 30-50km from Ho Chi Minh City ports (Cat Lai). Home to 2,900+ industrial enterprises. Strong industrial workforce. VSIP (Vietnam Singapore Industrial Park) benchmark facility with world-class utilities. Lower land costs vs. Dong Nai. Clark MHC Vietnam (forklift) operates in Hai Duong (North) — opportunity gap in South.',
    coordinates: { lat: 11.0, lng: 106.65 },

    labor: {
      blueCollar: {
        minimumWage: {
          localMonthly: 4730000,   // VND/month (Region 2, Decree 293/2025, effective Jan 1, 2026)
          localHourly: 22700,      // VND/hr (official Region 2 hourly, 2026)
          usdMonthly: 185.5,
          usdHourly: 0.89,
          currency: 'VND',
        },
        fringe: {
          pension: 14.0,            // BHXH employer: 14% (social insurance)
          health: 3.0,              // BHYT employer: 3%
          employment: 1.0,          // BHTN employer: 1%
          workersComp: 0.5,         // Tai nạn lao động: 0.5%
          other: 0.5,               // Trade union fee: 2% (capped, avg 0.5%)
          total: 19.0,
        },
        totalBurdened: {
          localMonthly: 5628700,
          localHourly: 27025,
          usdMonthly: 220.7,
          usdHourly: 1.06,
          currency: 'VND',
        },
        actualManufacturing: {
          localMonthly: 7500000,   // Market rate for factory worker in Binh Duong (VND 6-9M)
          localHourly: 36057,
          usdMonthly: 294.1,
          usdHourly: 1.41,
          currency: 'VND',
        },
        hiringDifficulty: {
          generalWorker: 'low',
          welder: 'medium',
          painter: 'low',
          notes: 'Binh Duong has abundant manufacturing workforce. Labor pool from HCMC and surrounding provinces. Skilled welder shortage emerging as FDI increases. Turnover rates ~25-30%/year in competitive industrial zones.',
        },
      },
      indirect: {
        supervisor: { localMonthly: 12000000, usdMonthly: 470.6, currency: 'VND' },
        qaEngineer: { localMonthly: 15000000, usdMonthly: 588.2, currency: 'VND' },
        logisticsWorker: { localMonthly: 8000000, usdMonthly: 313.7, currency: 'VND' },
      },
      whiteCollar: {
        productionPlanning: { localMonthly: 25000000, usdMonthly: 980.4, currency: 'VND' },
        productionEngineer: { localMonthly: 30000000, usdMonthly: 1176.5, currency: 'VND' },
        qaManager: { localMonthly: 40000000, usdMonthly: 1568.6, currency: 'VND' },
        procurement: { localMonthly: 35000000, usdMonthly: 1372.5, currency: 'VND' },
        plantManager: { localMonthly: 80000000, usdMonthly: 3137.3, currency: 'VND' },
      },
      laborSources: [
        {
          id: 'vn-l1',
          url: 'https://www.vietnam-briefing.com/news/vietnams-new-minimum-wage-january-1-2026.html/',
          organization: 'Vietnam Briefing',
          description: 'Vietnam Regional Minimum Wage Effective January 1, 2026',
          quote: 'Region 2 monthly minimum wage adjusted to VND 4,730,000; hourly minimum wage increased to VND 22,700 per Decree No. 293/2025/ND-CP.',
          accessDate: '2026-05',
        },
        {
          id: 'vn-l2',
          url: 'https://brochure.crowevietnam.vn/en/news/decree-no-293-2025-nd-cp-increase-in-regional-minimum-wages/',
          organization: 'Crowe Vietnam',
          description: 'Decree No. 293/2025/NĐ-CP: Increase in Regional Minimum Wages from 2026',
          quote: 'Employer social insurance contribution: 14% (pension) + 3% (health) + 1% (unemployment) = 18% of gross wage.',
          accessDate: '2026-05',
        },
      ],
    },

    infrastructure: {
      electricity: {
        localPerKwh: 2204,          // VND/kWh (EVN average retail, Decision 599/QĐ-EVN May 2025)
        currency: 'VND',
        usdPerKwh: 0.0865,
        tariffStructure: 'EVN Time-of-Use: Peak VND 2,162-2,251/kWh, Normal VND 1,253-1,332/kWh, Off-peak VND 843-904/kWh (industrial >200,000 kWh/month)',
        supplyStability: 'fair',
        powerOutageHoursPerYear: 350,
        notes: 'Vietnam faces recurring power shortages especially May-August dry season. Southern grid (HCMC/Binh Duong) more stable than North but still at risk. Industrial park backup diesel generators required. Grid expansion ongoing (Long An 500kV). Target: 12-15% renewable by 2030.',
      },
      water: {
        localPerM3: 11000,          // VND/m3 (industrial rate, Binh Duong Water, 2025)
        currency: 'VND',
        usdPerM3: 0.431,
        supplyStability: 'good',
        notes: 'Binh Duong Water Supply company. Industrial zone water supply stable. Dong Nai River source. Sewage treatment required for manufacturing discharge.',
      },
      gas: {
        localPerUnit: 350000,       // VND/MMBtu (industrial LPG, South Vietnam, 2025)
        unit: 'MMBtu',
        currency: 'VND',
        usdPerUnit: 13.73,
        supplyStability: 'fair',
        notes: 'Natural gas pipeline limited in Binh Duong. Most factories use LPG (bottled/tanker) or fuel oil. Gas supply chain less mature vs. Thailand/Korea.',
      },
      infraSources: [
        {
          id: 'vn-i1',
          url: 'https://en.evn.com.vn/d/en-US/news/RETAIL-ELECTRICITY-TARIFF-Decision-No-1279QD-BCT-dated-9-May-2025-of-Ministry-of-Industry-and-Trade-60-28-252',
          organization: 'EVN (Electricity of Vietnam)',
          description: 'Retail Electricity Tariff — Decision No. 1279/QD-BCT May 2025',
          quote: 'Average retail electricity price (excluding VAT) as of 10 May 2025: VND 2,204.0655/kWh.',
          accessDate: '2026-05',
        },
      ],
    },

    port: {
      name: 'Cat Lai Container Terminal (HCMC)',
      distanceKm: 40,
      transportCostLocalPerKm: 25000,   // VND/km (truck, 2025)
      transportCostUSDPerKm: 0.98,
      totalTransportCostLocalOneway: 1000000,
      totalTransportCostUSDOneway: 39.2,
      containerHandlingCostUSD: 180,
      stabilityScore: 7.8,
      congestionRisk: 'medium',
      customsEfficiency: 'good',
      annualTEU: '6.8M TEU (2024, Cat Lai + HCMC port complex)',
      portNotes: 'Cat Lai is Vietnam\'s busiest container terminal (handling 50%+ of Vietnam container trade). 15km from downtown HCMC, ~40km from Binh Duong industrial zones. Congestion risk during peak export season. Cai Mep deep-water port (Vung Tau, 80km) available for direct-call large vessels.',
      portSources: [
        {
          id: 'vn-p1',
          url: 'https://www.searates.com/port/cat_lai_vn',
          organization: 'SeaRates',
          description: 'Cat Lai Port Vietnam — Operations Data',
          quote: 'Cat Lai port is the largest container terminal in Vietnam, handling over 6 million TEU annually as part of the Ho Chi Minh City port complex.',
          accessDate: '2026-05',
        },
      ],
    },

    permits: {
      estimatedMonthsGreenfield: 16,
      difficulty: 'medium',
      worldBankEaseRank2024: 66,
      keyRequirements: [
        'Investment Registration Certificate (IRC) — MPI',
        'Enterprise Registration Certificate (ERC)',
        'Construction Permit (Giấy phép xây dựng)',
        'Environmental Impact Assessment (ĐTM) for factories >5,000m²',
        'Fire Safety Certificate',
        'Factory Operating License',
      ],
      incentives: [
        'CIT exemption: 4 years + 50% reduction for 9 years (investment in industrial zone)',
        'Import duty exemption for equipment, machinery',
        'Land use fee exemption 3-15 years depending on region',
        'Binh Duong Province special incentives for priority sectors',
      ],
      foreignOwnership: '100% foreign-owned enterprise (FIE) permitted',
      notes: 'Vietnam FDI approval process improved significantly post-2020. VSIP Binh Duong (Singapore-managed) provides one-stop-shop support. Main delays: EIA for large projects (6-12 months), utility connections.',
      permitSources: [
        {
          id: 'vn-pm1',
          url: 'https://www.vietnam-briefing.com/doing-business-guide/vietnam/human-resources-and-payroll/minimum-wage',
          organization: 'Vietnam Briefing',
          description: 'Doing Business in Vietnam — Investment Environment',
          quote: 'Vietnam offers CIT exemption for 4 years and 50% reduction for the following 9 years for qualifying investments in industrial zones.',
          accessDate: '2026-05',
        },
      ],
    },

    land: {
      purchasePriceLocalPerM2: null,       // Cannot purchase land in Vietnam (land use rights only)
      purchasePriceUSDPerM2: null,
      leasePriceLocalPerM2: 4590000,       // VND/m2 (one-time lease payment for 50yr: USD 180/m2)
      leasePriceUSDPerM2: 180,             // Binh Duong avg 2025: USD 140-200/m2 (50yr lease)
      leaseTerm: '30-50 year land use right (one-time payment)',
      constructionCostLocalPerM2: 6120000, // VND/m2 (USD 240/m2, medium-spec factory 2025)
      constructionCostUSDPerM2: 240,
      zone: 'VSIP Binh Duong / Becamex Industrial City',
      typicalPlotSize: '5,000–30,000 m²',
      notes: 'Vietnam: land cannot be purchased — only land use rights (LUR). Industrial park lease = one-time payment for 30-50yr term. Binh Duong 2025: USD 140-200/m2 (50yr term). Southern Vietnam rising 3-7% per year. VSIP premium +15-20% vs. local IZs.',
      landSources: [
        {
          id: 'vn-ld1',
          url: 'https://ktgindustrial.com/new/industrial-park-land-rental-costs/',
          organization: 'KTG Industrial',
          description: 'Industrial Land Rental Costs in Vietnam 2025',
          quote: 'Binh Duong industrial land rental rates range from 100-250 USD/m2/rent cycle (30-50 year lease term). Southern region average asking rent reached USD 180/sqm in Q3 2025.',
          accessDate: '2026-05',
        },
      ],
    },

    supplyChain: {
      steel: {
        localAvailability: 'good',
        mainProducers: [
          { name: 'Hoa Phat Group', url: 'https://www.hoaphat.com.vn/en', location: 'Dung Quat, Quang Ngai + Hai Duong (N. Vietnam)', capacity: '8.5M ton/yr' },
          { name: 'Formosa Ha Tinh Steel', url: 'https://www.fhs.com.vn', location: 'Ha Tinh (Central Vietnam)', capacity: '7.5M ton/yr HRC' },
          { name: 'Vietnam Steel Corporation (VNSteel)', url: 'https://www.vnsteel.vn', location: 'Thai Nguyen + HCMC', capacity: '2M ton/yr' },
        ],
        hrcSS400PriceLocalPerTon: 13580000,  // VND/ton (VND 13,560-13,590/kg from Stavian metal 2025)
        hrcSS400PriceUSDPerTon: 533,
        hrcSS400PriceUSDPerKg: 0.533,
        leadTimeDays: 14,
        notes: 'Formosa Ha Tinh produces HRC SS400 grade domestically — direct supply. Hoa Phat Dung Quat also produces HRC. Lead time to Southern Vietnam ~10-14 days. Chinese import alternative at USD 505/ton CFR Vietnam (Q4 2025).',
      },
      parts: {
        fabrication: {
          availability: 'fair',
          clusters: ['Binh Duong', 'Dong Nai', 'HCMC (District 9, Binh Chanh)'],
          suppliers: [
            { name: 'Protec Vietnam', url: 'https://www.protec.com.vn', product: 'Metal fabrication, welding' },
            { name: 'SMC Vietnam', url: 'https://www.smcvn.com.vn', product: 'Steel fabrication' },
          ],
          notes: 'Local fabrication capacity growing. Quality consistency improving but still below Korea/Japan standards. Qualification required.',
        },
        powertrain: {
          availability: 'limited',
          clusters: ['HCMC industrial zones'],
          suppliers: [
            { name: 'Dana Incorporated Vietnam', url: 'https://www.dana.com', product: 'Axle assembly (automotive)' },
          ],
          notes: 'Heavy-duty forklift powertrain (transmission, drive axle) must largely be imported from Japan/Korea/Germany. Automotive supply base exists but incompatible specs.',
        },
        hydraulics: {
          availability: 'fair',
          clusters: ['Binh Duong', 'Dong Nai'],
          suppliers: [
            { name: 'Parker Vietnam', url: 'https://www.parker.com/vn', product: 'Hydraulic hoses, fittings' },
            { name: 'Bosch Rexroth Vietnam', url: 'https://www.boschrexroth.com/vn', product: 'Hydraulic components' },
          ],
          notes: 'Assembly and distribution present. Component manufacturing limited. Cylinders can be sourced locally; pumps/valves typically imported.',
        },
        electrical: {
          availability: 'good',
          clusters: ['HCMC', 'Binh Duong (electronics zone)'],
          suppliers: [
            { name: 'Furukawa Electric Vietnam', url: 'https://www.furukawa.co.jp', product: 'Wire harness' },
            { name: 'Kyungshin Vietnam', url: 'https://www.kyungshin.com', product: 'Automotive wiring' },
          ],
          notes: 'Vietnam major automotive wiring harness exporter. Harness quality good. Controller electronics (MOSFET-based) primarily import from Japan/Korea.',
        },
        others: {
          availability: 'fair',
          clusters: ['HCMC', 'Binh Duong'],
          suppliers: [
            { name: 'Bridgestone Vietnam', url: 'https://www.bridgestone.com.vn', product: 'Tires' },
            { name: 'Inoac Vietnam', url: 'https://www.inoac.co.jp', product: 'Seats, foam' },
          ],
          notes: 'Tires sourced locally (Bridgestone VN plant). Seats assembly available. Wheels may require import.',
        },
        counterweight: {
          availability: 'fair',
          clusters: ['Binh Duong', 'Dong Nai'],
          suppliers: [
            { name: 'Ly Hai Foundry', url: '#', product: 'Iron casting' },
          ],
          notes: 'Local foundry capacity exists for cast iron counterweight. Quality verification required. Chinese import common alternative.',
        },
      },
      scSources: [
        {
          id: 'vn-sc1',
          url: 'https://stavianmetal.com/en/hrc-ss400/',
          organization: 'Stavian Metal',
          description: 'HRC SS400 Steel Properties and Supply in Vietnam',
          quote: 'SS400 grade HRC is offered at 13,560 VND/kg ($535.95/tonne) to northern and central Vietnam, at 13,590 VND/kg to southern Vietnam.',
          accessDate: '2026-05',
        },
        {
          id: 'vn-sc2',
          url: 'https://www.clarkmhc.com/clark-material-handling-company-announces-opening-of-vietnam-high-volume-production-factory/',
          organization: 'Clark MHC',
          description: 'Clark Opens Vietnam High Volume Production Factory (Hai Duong)',
          quote: 'Clark Material Handling Company began high-volume production at its Hai Duong, Vietnam manufacturing facility in October 2019, covering 5 hectares.',
          accessDate: '2026-05',
        },
      ],
    },

    competitors: [
      {
        name: 'Clark Material Handling Vietnam (Hai Duong)',
        url: 'https://www.clarkmhc.com',
        established: 2018,
        operationStart: 2019,
        capacity: 15000,
        capacityUnit: 'units/year',
        makeVsBuy: 'Medium Make: Frame/body in-house; outsource powertrain, hydraulics',
        automationLevel: 'medium',
        automationDetails: 'Semi-automated welding lines. Limited robotics. Manual paint line. MES system for production tracking.',
        coordinates: { lat: 20.94, lng: 106.31 },
        notes: 'Located in Hai Duong (Northern Vietnam), not Binh Duong (South). 5-hectare plant producing S-Series IC trucks for global export (NA, Europe, Australia). Started production Oct 2019.',
      },
    ],

    costSummary: {
      laborCostIndexVsKorea: 13,
      energyCostIndexVsKorea: 69,
      landCostIndexVsKorea: 41,
      supplyChainRisk: 'medium',
      overallOpportunity: '최저 노무비 + 활성화된 FDI 생태계 + CPTPP/EVFTA 관세 혜택. 전략적 수출 기지.',
      overallRisk: '전력 공급 불안정 (여름 피크), 부품 공급망 미성숙, 높은 이직률, 환율 리스크.',
      estimatedManufacturingCostUSDPerUnit: 11200,
    },
  },

  // ============================================================
  // THAILAND — Rayong / Chonburi (Eastern Economic Corridor)
  // ============================================================
  {
    code: 'TH',
    name: 'Thailand',
    nameKo: '태국',
    flag: '🇹🇭',
    currency: 'THB',
    currencySymbol: '฿',
    defaultExchangeRate: 34.5,
    city: 'Rayong / Chonburi',
    cityKo: '라용 / 촌부리',
    industrialZone: 'Eastern Economic Corridor (EEC) — WHA Industrial Estate Rayong',
    cityJustification: 'Thailand\'s EEC is ASEAN\'s most mature industrial zone. World-class automotive cluster (Toyota, Honda, Mitsubishi factories in Rayong/Chonburi). Laem Chabang Port (Asia top 20, 64km from Rayong). Stable power grid with 99.9%+ reliability. BOI promotion offers exceptional tax incentives. Strong metals/automotive parts supply base. Most business-friendly environment in ASEAN for heavy manufacturing.',
    coordinates: { lat: 12.68, lng: 101.27 },

    labor: {
      blueCollar: {
        minimumWage: {
          localMonthly: 10400,     // THB/month (THB 400/day × 26 working days, effective Jul 1, 2025)
          localHourly: 50,         // THB/hr (THB 400/day ÷ 8hr)
          usdMonthly: 301.4,
          usdHourly: 1.45,
          currency: 'THB',
        },
        fringe: {
          pension: 5.0,             // Social Security Fund (SSF): employer 5%
          health: 0.0,              // Included in SSF
          employment: 0.0,          // Included in SSF
          workersComp: 0.5,         // Workmen Compensation Fund: 0.2-1% by sector
          other: 3.0,               // Annual bonus (1 month) + meal/transport allowance
          total: 8.5,
        },
        totalBurdened: {
          localMonthly: 11284,
          localHourly: 54.3,
          usdMonthly: 327.1,
          usdHourly: 1.57,
          currency: 'THB',
        },
        actualManufacturing: {
          localMonthly: 16000,     // Market rate: THB 15,000-20,000 for manufacturing worker in EEC
          localHourly: 76.9,
          usdMonthly: 463.8,
          usdHourly: 2.23,
          currency: 'THB',
        },
        hiringDifficulty: {
          generalWorker: 'medium',
          welder: 'medium',
          painter: 'low',
          notes: 'Thailand EEC has strong manufacturing workforce from automotive sector. Welders in demand from Toyota/Honda. Myanmar migrant workers supplement labor pool (~25% of factory workers in EEC). Certified welders available through TVET institutions.',
        },
      },
      indirect: {
        supervisor: { localMonthly: 30000, usdMonthly: 869.6, currency: 'THB' },
        qaEngineer: { localMonthly: 35000, usdMonthly: 1014.5, currency: 'THB' },
        logisticsWorker: { localMonthly: 22000, usdMonthly: 637.7, currency: 'THB' },
      },
      whiteCollar: {
        productionPlanning: { localMonthly: 60000, usdMonthly: 1739.1, currency: 'THB' },
        productionEngineer: { localMonthly: 70000, usdMonthly: 2028.9, currency: 'THB' },
        qaManager: { localMonthly: 90000, usdMonthly: 2608.7, currency: 'THB' },
        procurement: { localMonthly: 75000, usdMonthly: 2173.9, currency: 'THB' },
        plantManager: { localMonthly: 180000, usdMonthly: 5217.4, currency: 'THB' },
      },
      laborSources: [
        {
          id: 'th-l1',
          url: 'https://www.mol.go.th/en/news/starting-july-1-ministry-of-labour-revises-minimum-wage-to-align-with-economy-and-improve-workers-quality-of-life',
          organization: 'Thailand Ministry of Labour',
          description: 'Thailand Minimum Wage Revision — Effective July 1, 2025',
          quote: 'Ministry of Labour revises minimum wage: Chonburi and Rayong provinces effective July 1, 2025 minimum wage is THB 400 per day.',
          accessDate: '2026-05',
        },
      ],
    },

    infrastructure: {
      electricity: {
        localPerKwh: 3.99,          // THB/kWh (NEPC cap Sep-Dec 2025; EEC industrial)
        currency: 'THB',
        usdPerKwh: 0.1157,
        tariffStructure: 'PEA (Provincial Electricity Authority) TOU: Peak ~5.3 THB/kWh, Off-peak ~2.6 THB/kWh; avg industrial ~4.0 THB/kWh',
        supplyStability: 'good',
        powerOutageHoursPerYear: 45,
        notes: 'EEC has highly stable power grid. EGAT backbone grid + PEA distribution. Some industrial parks have private dedicated substations. Solar PPA increasingly common (Amata, WHA parks). Utility Green Tariff (UGT1) option at 4.21 THB/kWh for green manufacturing.',
      },
      water: {
        localPerM3: 22,             // THB/m3 (Industrial Estates Authority, EEC rate 2024)
        currency: 'THB',
        usdPerM3: 0.638,
        supplyStability: 'good',
        notes: 'Industrial Estates Authority of Thailand (IEAT) managed water supply in Amata/WHA parks. Eastern Seaboard water system. Treated water available for industrial use.',
      },
      gas: {
        localPerUnit: 380,          // THB/MMBtu (PTT natural gas industrial, EEC 2025)
        unit: 'MMBtu',
        currency: 'THB',
        usdPerUnit: 11.01,
        supplyStability: 'excellent',
        notes: 'PTT pipeline natural gas well-established in Eastern Seaboard. Highest gas supply reliability in ASEAN. LNG terminal in Map Ta Phut (Rayong) provides alternative supply.',
      },
      infraSources: [
        {
          id: 'th-i1',
          url: 'https://www.nationthailand.com/business/economy/40049646',
          organization: 'Nation Thailand',
          description: 'NEPC Sets Electricity Price Cap at 3.99 Baht per Unit Until End of 2025',
          quote: 'NEPC approved electricity tariff for Sep-Dec 2025 period, capping rate at 3.99 baht per unit.',
          accessDate: '2026-05',
        },
      ],
    },

    port: {
      name: 'Laem Chabang International Port',
      distanceKm: 42,
      transportCostLocalPerKm: 750,    // THB/km (truck, EEC corridor, 2025)
      transportCostUSDPerKm: 21.7,
      totalTransportCostLocalOneway: 31500,
      totalTransportCostUSDOneway: 912.9,
      containerHandlingCostUSD: 165,
      stabilityScore: 8.9,
      congestionRisk: 'low',
      customsEfficiency: 'excellent',
      annualTEU: '8.0M TEU (2024)',
      portNotes: 'Laem Chabang is Thailand\'s premier deepwater port and ASEAN\'s 2nd busiest. 30km from Chonburi, 42km from Rayong industrial zones. 4 specialized automotive terminals. Direct shipping to Japan, Korea, Europe, US. Rail link to Bangkok available. Laem Chabang Phase 3 expansion targeting 18M TEU by 2030.',
      portSources: [
        {
          id: 'th-p1',
          url: 'https://hutchisonports.co.th/laem-chabang-port/',
          organization: 'Hutchison Ports Thailand — Laem Chabang',
          description: 'Laem Chabang Port Operations',
          quote: 'Laem Chabang Port handles approximately 8 million TEU annually and is fully integrated into Thailand\'s national logistics system with highway, rail, and airport connections.',
          accessDate: '2026-05',
        },
        {
          id: 'th-p2',
          url: 'https://www.rome2rio.com/s/Rayong/Laem-Chabang',
          organization: 'Rome2rio / Transport Database',
          description: 'Distance: Rayong to Laem Chabang',
          quote: 'The driving distance between Rayong to Laem Chabang is 40 miles (approximately 64 kilometers).',
          accessDate: '2026-05',
        },
      ],
    },

    permits: {
      estimatedMonthsGreenfield: 12,
      difficulty: 'low',
      worldBankEaseRank2024: 21,
      keyRequirements: [
        'BOI Investment Promotion application',
        'Factory License (Ministry of Industry)',
        'EIA (for factories >5,000 m² or significant environmental impact)',
        'Building Permit',
        'Work Permits for foreign staff',
      ],
      incentives: [
        'BOI: 5-13 years CIT exemption (heavy industries)',
        'Import duty exemption on machinery and raw materials',
        'EEC Act: 50-year land lease, 100% foreign ownership',
        'Reduced CIT 10% (vs 20% standard) for first 10 years in EEC',
        'WHA/Amata industrial park one-stop service',
      ],
      foreignOwnership: '100% foreign ownership in EEC; typically 49% cap outside EEC (manufacturing exceptions apply)',
      notes: 'Thailand BOI promotion is the most streamlined in ASEAN for heavy manufacturing. EEC Act provides EEC-specific extra incentives. One-stop shop at EEC Promotion Center reduces complexity. Main bottleneck: workforce housing for large plants.',
      permitSources: [
        {
          id: 'th-pm1',
          url: 'https://www.boi.go.th/en/index/',
          organization: 'Thailand Board of Investment (BOI)',
          description: 'BOI Investment Promotion — Heavy Industry Category',
          quote: 'Manufacturing industries in the automotive, machinery, and industrial equipment categories receive 5-8 years CIT exemption, with additional privileges for EEC locations.',
          accessDate: '2026-05',
        },
      ],
    },

    land: {
      purchasePriceLocalPerM2: null,      // Foreigners cannot own land in Thailand
      purchasePriceUSDPerM2: null,
      leasePriceLocalPerM2: 2588,         // THB/m2 (WHA/Amata EEC industrial land: USD 75/m2 one-time)
      leasePriceUSDPerM2: 75,             // EEC: USD 60-100/m2 (30-50yr lease, 2024-2025)
      leaseTerm: '30-50 year lease (EEC Act allows up to 50 years + 49yr renewal)',
      constructionCostLocalPerM2: 8050,   // THB/m2 (industrial factory, Thailand 2025: USD 230/m2)
      constructionCostUSDPerM2: 233,
      zone: 'EEC — WHA Industrial Estate Rayong / Amata City Chonburi',
      typicalPlotSize: '10,000–50,000 m²',
      notes: 'Thailand EEC: affordable leasehold land vs. Vietnam. WHA and Amata are premier industrial park operators with complete infrastructure. EEC Act allows 50yr+49yr lease for foreign entities. Land cost USD 60-100/m2 for 50yr. Construction USD 200-270/m2 for industrial heavy-spec.',
      landSources: [
        {
          id: 'th-ld1',
          url: 'https://www.wha-industrialestate.com/en/',
          organization: 'WHA Industrial Estate',
          description: 'WHA Eastern Seaboard Industrial Estate — Rayong EEC',
          quote: 'WHA Industrial Estates in EEC (Eastern Economic Corridor) offer long-term land leases with complete utilities — power, water, telecoms — for heavy manufacturing operations.',
          accessDate: '2026-05',
        },
      ],
    },

    supplyChain: {
      steel: {
        localAvailability: 'good',
        mainProducers: [
          { name: 'G Steel Public Company', url: 'https://www.ssi-steel.com', location: 'Rayong (EEC)', capacity: '2M ton/yr HRC' },
          { name: 'Sahaviriya Steel Industries (SSI)', url: 'https://www.ssi-steel.com', location: 'Prachuap Khiri Khan', capacity: '4M ton/yr HRC' },
          { name: 'NS BlueScope (Thailand)', url: 'https://www.nsbluescope.com/th', location: 'Rayong', capacity: '0.5M ton/yr coated' },
        ],
        hrcSS400PriceLocalPerTon: 19388,   // THB/ton (USD 562 × 34.5; 2025 Q1 Thai domestic HRC)
        hrcSS400PriceUSDPerTon: 562,
        hrcSS400PriceUSDPerKg: 0.562,
        leadTimeDays: 7,
        notes: 'G Steel in Rayong (EEC) — key domestic HRC supplier 3km from Amata City Rayong. Import from Japan/Korea supplementary. Thai domestic HRC SS400 available, quality meets JIS G3101 standard.',
      },
      parts: {
        fabrication: {
          availability: 'excellent',
          clusters: ['Chonburi (Amata City)', 'Rayong (WHA, Hemaraj)', 'Pathum Thani'],
          suppliers: [
            { name: 'SNC Former Public Co.', url: 'https://www.sncformer.com', product: 'Metal fabrication, automotive parts' },
            { name: 'Thai Summit Group', url: 'https://www.thaisummit.co.th', product: 'Press parts, steel fabrication' },
          ],
          notes: 'World-class automotive Tier 1/2 fabrication ecosystem in EEC. Frame/guard/carriage can be locally sourced from automotive parts manufacturers with qualification.',
        },
        powertrain: {
          availability: 'good',
          clusters: ['Chonburi', 'Ayutthaya', 'Rayong'],
          suppliers: [
            { name: 'Aisin Asia (Thailand)', url: 'https://www.aisin.com', product: 'Transmission components' },
            { name: 'ZF Thailand', url: 'https://www.zf.com', product: 'Transmission systems' },
          ],
          notes: 'Automotive powertrain (Toyota, Honda, Mitsubishi supply chain) in EEC. Heavy-duty forklift transmission must still be sourced from Japan/Germany/Korea.',
        },
        hydraulics: {
          availability: 'good',
          clusters: ['EEC (Rayong/Chonburi)'],
          suppliers: [
            { name: 'Yuken Thailand', url: 'https://www.yuken-ind.co.jp', product: 'Hydraulic valves, pumps' },
            { name: 'Parker Thailand', url: 'https://www.parker.com/th', product: 'Hydraulic systems' },
          ],
          notes: 'Yuken has Thailand manufacturing. Industrial hydraulic components largely available locally or regionally.',
        },
        electrical: {
          availability: 'good',
          clusters: ['Chonburi', 'Chachoengsao'],
          suppliers: [
            { name: 'Furukawa Electric Thailand', url: 'https://www.furukawa.co.jp', product: 'Wire harness' },
            { name: 'Thai Aviation Industries', url: '#', product: 'Wiring assemblies' },
          ],
          notes: 'Automotive wiring harness well-established. Controller electronics import from Japan.',
        },
        others: {
          availability: 'excellent',
          clusters: ['Rayong', 'Chonburi'],
          suppliers: [
            { name: 'Bridgestone Thailand', url: 'https://www.bridgestone.co.th', product: 'Industrial tires' },
            { name: 'IRC Thailand', url: 'https://www.irc-tire.com', product: 'Solid tires, industrial' },
          ],
          notes: 'Bridgestone Thailand is a major production hub. Industrial tires fully locally sourced.',
        },
        counterweight: {
          availability: 'good',
          clusters: ['Chonburi', 'Samut Prakan'],
          suppliers: [
            { name: 'Thai Die Casting', url: '#', product: 'Metal casting' },
            { name: 'Somboon Advance Technology (SAT)', url: 'https://www.sat.co.th', product: 'Iron castings' },
          ],
          notes: 'Strong foundry industry in Thailand EEC. Cast iron counterweight locally feasible at competitive cost.',
        },
      },
      scSources: [
        {
          id: 'th-sc1',
          url: 'https://www.ssi-steel.com',
          organization: 'G Steel Thailand',
          description: 'G Steel Rayong — HRC Production',
          quote: 'G Steel operates an electric arc furnace steelworks in Rayong with annual capacity of 2 million tons of HRC, supplying automotive and industrial customers in the EEC.',
          accessDate: '2026-05',
        },
      ],
    },

    competitors: [
      {
        name: 'Hangcha Forklift Thailand (Planned)',
        url: 'https://www.hcforklift.com/news/news_read/97',
        established: 2025,
        operationStart: 2026,
        capacity: 10000,
        capacityUnit: 'units/year (planned)',
        makeVsBuy: 'Medium Make: assembly plant with major import from China',
        automationLevel: 'medium',
        automationDetails: 'Planned semi-automated assembly line. Registered capital USD 20M.',
        coordinates: { lat: 13.09, lng: 101.0 },
        notes: 'Hangcha Group announced Thailand manufacturing base with $20M investment, initial 10,000 units/year capacity. Represents major Chinese OEM entry into ASEAN manufacturing.',
      },
    ],

    costSummary: {
      laborCostIndexVsKorea: 20,
      energyCostIndexVsKorea: 92,
      landCostIndexVsKorea: 35,
      supplyChainRisk: 'low',
      overallOpportunity: '아세안 최고 수준 자동차 공급망 + 라엠차방 항만 + BOI 세제 혜택 + 정치 안정성 우수.',
      overallRisk: '외국인 토지 소유 불가(임차만 가능), 태국어 행정 장벽, 노동력 다국적 구성(미얀마 이주 노동자).',
      estimatedManufacturingCostUSDPerUnit: 12400,
    },
  },

  // ============================================================
  // INDONESIA — Karawang, West Java
  // ============================================================
  {
    code: 'ID',
    name: 'Indonesia',
    nameKo: '인도네시아',
    flag: '🇮🇩',
    currency: 'IDR',
    currencySymbol: 'Rp',
    defaultExchangeRate: 16500,
    city: 'Karawang',
    cityKo: '까라왕',
    industrialZone: 'KIIC (Karawang International Industrial City) / JABABEKA',
    cityJustification: 'Indonesia\'s primary automotive/heavy manufacturing hub. Karawang hosts Toyota (200,000 car/yr), Honda, Mitsubishi, Suzuki factories — creating deep supply chain. 72km from Tanjung Priok (Jakarta) — Indonesia\'s #1 port. KIIC is Japan-developed world-class industrial estate with guaranteed utilities. Karawang UMSK 2025: IDR 5.63M/month — 2nd highest in West Java. Second largest economy in ASEAN — large domestic market opportunity.',
    coordinates: { lat: -6.32, lng: 107.3 },

    labor: {
      blueCollar: {
        minimumWage: {
          localMonthly: 5630000,    // IDR/month (UMSK 2025, Karawang, 7 industrial sectors)
          localHourly: 26990,       // IDR/hr (IDR 5,630,000 ÷ 209hr)
          usdMonthly: 341.2,
          usdHourly: 1.64,
          currency: 'IDR',
        },
        fringe: {
          pension: 3.7,              // BPJS Ketenagakerjaan (JHT employer share: 3.7%)
          health: 4.0,               // BPJS Kesehatan employer: 4% (capped at Rp480K/month)
          employment: 0.24,          // BPJS JKK (work accident): 0.24% for manufacturing
          workersComp: 0.0,          // Included in BPJS
          other: 8.33,               // THR (Annual bonus = 1 month = 1/12 = 8.33% monthly)
          total: 16.27,
        },
        totalBurdened: {
          localMonthly: 6546031,
          localHourly: 31339,
          usdMonthly: 396.7,
          usdHourly: 1.90,
          currency: 'IDR',
        },
        actualManufacturing: {
          localMonthly: 7500000,    // Market rate in Karawang automotive zone
          localHourly: 35885,
          usdMonthly: 454.5,
          usdHourly: 2.18,
          currency: 'IDR',
        },
        hiringDifficulty: {
          generalWorker: 'low',
          welder: 'medium',
          painter: 'low',
          notes: 'Indonesia has large labor supply. Karawang area benefits from automotive training ecosystem (Toyota, Honda training centers). Skilled certified welder supply growing through BNSP vocational programs. Labor relations: industrial zone history of strikes — strong FSPMI union presence.',
        },
      },
      indirect: {
        supervisor: { localMonthly: 9000000, usdMonthly: 545.5, currency: 'IDR' },
        qaEngineer: { localMonthly: 12000000, usdMonthly: 727.3, currency: 'IDR' },
        logisticsWorker: { localMonthly: 7000000, usdMonthly: 424.2, currency: 'IDR' },
      },
      whiteCollar: {
        productionPlanning: { localMonthly: 20000000, usdMonthly: 1212.1, currency: 'IDR' },
        productionEngineer: { localMonthly: 25000000, usdMonthly: 1515.2, currency: 'IDR' },
        qaManager: { localMonthly: 35000000, usdMonthly: 2121.2, currency: 'IDR' },
        procurement: { localMonthly: 30000000, usdMonthly: 1818.2, currency: 'IDR' },
        plantManager: { localMonthly: 70000000, usdMonthly: 4242.4, currency: 'IDR' },
      },
      laborSources: [
        {
          id: 'id-l1',
          url: 'https://databoks.katadata.co.id/en/employment/statistics/688ae2d4d4f78/minimum-wage-for-7-sectors-in-karawang-in-2025',
          organization: 'Databoks / Katadata',
          description: 'Minimum Wage for 7 Sectors in Karawang 2025',
          quote: 'Karawang UMSK (Sectoral Minimum Wage) for 7 sectors including automotive and metals is IDR 5,630,000 per month (West Java Governor\'s Decree No. 561.7/kep.798-kesra/2024).',
          accessDate: '2026-05',
        },
      ],
    },

    infrastructure: {
      electricity: {
        localPerKwh: 1444,          // IDR/kWh (PLN I-3 industrial tariff, 2025)
        currency: 'IDR',
        usdPerKwh: 0.0875,
        tariffStructure: 'PLN I-3 (medium industry, 200kVA-30MVA): IDR 1,444.70/kWh flat + demand charge',
        supplyStability: 'fair',
        powerOutageHoursPerYear: 280,
        notes: 'PLN monopoly. Java-Bali grid most stable in Indonesia but still below Thailand/Korea standard. Industrial parks (KIIC, Jababeka) have private substations and backup diesel. Government 35GW program improving reliability. Risk: grid frequency fluctuations affecting sensitive manufacturing equipment.',
      },
      water: {
        localPerM3: 8500,           // IDR/m3 (KIIC industrial estate rate, 2024)
        currency: 'IDR',
        usdPerM3: 0.515,
        supplyStability: 'good',
        notes: 'KIIC industrial park provides water supply from PDAM (local authority) + treated water system. Supply stable within park boundary.',
      },
      gas: {
        localPerUnit: 120000,       // IDR/MMBtu (PGN industrial rate, West Java 2025)
        unit: 'MMBtu',
        currency: 'IDR',
        usdPerUnit: 7.27,
        supplyStability: 'good',
        notes: 'PGN (Perusahaan Gas Negara) pipeline covers Karawang industrial zone. Natural gas supply reasonably stable. LNG supplement available.',
      },
      infraSources: [
        {
          id: 'id-i1',
          url: 'https://datacenter-pyc.org/data/economy/energy-price/electricity-tariff-in-indonesia/',
          organization: 'PYC Data Center / PLN Tariff Reference',
          description: 'PLN Electricity Tariff in Indonesia — I-3 Industrial Rate',
          quote: 'For medium industry category (I-3), the rate is Rp1,444.70 per kWh based on determinations effective through 2025.',
          accessDate: '2026-05',
        },
      ],
    },

    port: {
      name: 'Port of Tanjung Priok (Jakarta)',
      distanceKm: 72,
      transportCostLocalPerKm: 18000,    // IDR/km (heavy truck, Java toll road, 2025)
      transportCostUSDPerKm: 1.09,
      totalTransportCostLocalOneway: 1296000,
      totalTransportCostUSDOneway: 78.5,
      containerHandlingCostUSD: 155,
      stabilityScore: 7.5,
      congestionRisk: 'medium',
      customsEfficiency: 'good',
      annualTEU: '7.6M TEU (2024)',
      portNotes: 'Tanjung Priok is Indonesia\'s #1 and busiest port, handling 60%+ of Indonesia\'s container trade. 72km from Karawang (via Cikarang-Bekasi-Karawang toll road ~1hr drive). Congestion risk in peak season. Patimban deep-water port (Subang, 80km from Karawang) under development as relief port. Calms expected: full operation by 2027.',
      portSources: [
        {
          id: 'id-p1',
          url: 'https://en.wikipedia.org/wiki/Port_of_Tanjung_Priok',
          organization: 'Port of Tanjung Priok / Wikipedia',
          description: 'Port of Tanjung Priok — Indonesia\'s Main Gateway',
          quote: 'In 2024, Tanjung Priok achieved throughput of 7.6 million TEUs. The majority of heavy vehicles from Karawang and Bekasi industrial zones originate from this port corridor.',
          accessDate: '2026-05',
        },
        {
          id: 'id-p2',
          url: 'https://www.rome2rio.com/s/Port-of-Tanjung-Priok/Karawang',
          organization: 'Rome2rio',
          description: 'Port of Tanjung Priok to Karawang Distance',
          quote: 'The distance between Port of Tanjung Priok and Karawang is 45 miles (approximately 72 kilometers).',
          accessDate: '2026-05',
        },
      ],
    },

    permits: {
      estimatedMonthsGreenfield: 18,
      difficulty: 'medium',
      worldBankEaseRank2024: 73,
      keyRequirements: [
        'NIB (Nomor Induk Berusaha) via OSS-RBA system',
        'Business License (Izin Usaha) — BKPM/OSS',
        'Building Permit (PBG — Persetujuan Bangunan Gedung)',
        'Environmental Document (UKL-UPL or AMDAL for large factories)',
        'Manpower report (LKPM quarterly)',
      ],
      incentives: [
        'Investment Allowance: 30% of investment deductible over 6 years',
        'Import duty exemption on capital goods',
        'Tax Holiday: 5-20 years CIT exemption for priority sectors >Rp500B investment',
        'BKPM single window: OSS (Online Single Submission) platform',
        'West Java Province special incentives for manufacturing >USD 10M',
      ],
      foreignOwnership: '100% foreign ownership allowed in manufacturing (with KBLI-specific positive list)',
      notes: 'Indonesia OSS (Online Single Submission) system improved significantly post-2021. KIIC industrial park provides facilitated permitting support (Japan-managed). Main challenges: AMDAL (environmental assessment) for large factory, PLN connection agreement. Labor law (UU Cipta Kerja) provides flexibility.',
      permitSources: [
        {
          id: 'id-pm1',
          url: 'https://www.bkpm.go.id',
          organization: 'BKPM (Indonesia Investment Coordinating Board)',
          description: 'Indonesia Foreign Investment Guidelines',
          quote: 'Manufacturing sector qualifies for 100% foreign ownership. Tax holiday up to 20 years for investment in priority sectors exceeding Rp 500 billion.',
          accessDate: '2026-05',
        },
      ],
    },

    land: {
      purchasePriceLocalPerM2: 2970000,    // IDR/m2 (KIIC/Jababeka: ~USD 180/m2 purchase, 2025)
      purchasePriceUSDPerM2: 180,
      leasePriceLocalPerM2: 2640000,        // IDR/m2 (lease cycle, 30yr: ~USD 160/m2)
      leasePriceUSDPerM2: 160,
      leaseTerm: '30 year HGB (Hak Guna Bangunan) lease + 20yr renewal for foreign-owned companies',
      constructionCostLocalPerM2: 3465000,  // IDR/m2 (industrial factory, 2025: USD 210/m2)
      constructionCostUSDPerM2: 210,
      zone: 'KIIC (Karawang International Industrial City) / JABABEKA',
      typicalPlotSize: '10,000–60,000 m²',
      notes: 'Indonesia: foreigners cannot directly own land — HGB leasehold (30yr+20yr) via PT (local company). KIIC (Japan-managed) USD 160-200/m2 30yr HGB. Indonesian land prices rising as nearshoring increases. Construction USD 180-250/m2 for industrial heavy specification.',
      landSources: [
        {
          id: 'id-ld1',
          url: 'https://ktgindustrial.com/new/factory-leasing-cost-in-southeast-asia/',
          organization: 'KTG Industrial',
          description: 'Factory Leasing Cost in Southeast Asia',
          quote: 'Rent in industrial zones such as Bogor-Sukabumi, Tangerang, Bekasi and Karawang in Indonesia range from $160-$295 per sqm per rental cycle (30-year HGB lease).',
          accessDate: '2026-05',
        },
      ],
    },

    supplyChain: {
      steel: {
        localAvailability: 'good',
        mainProducers: [
          { name: 'Krakatau Steel', url: 'https://www.krakatausteel.com', location: 'Cilegon, Banten (120km from Karawang)', capacity: '3M ton/yr HRC' },
          { name: 'Krakatau Posco', url: 'https://www.krakatauposco.co.id', location: 'Cilegon (POSCO JV)', capacity: '3M ton/yr HRC' },
          { name: 'Gunung Raja Paksi (GRP)', url: 'https://www.gunungrajapaksi.com', location: 'Bekasi (20km from Karawang)', capacity: '3M ton/yr HRC+sections' },
        ],
        hrcSS400PriceLocalPerTon: 8910000,  // IDR/ton (USD 540, 2025 Indonesian domestic HRC)
        hrcSS400PriceUSDPerTon: 540,
        hrcSS400PriceUSDPerKg: 0.540,
        leadTimeDays: 10,
        notes: 'Krakatau-POSCO JV in Cilegon produces HRC SS400/equivalent grades. GRP Bekasi even closer to Karawang. Local supply competitive. Chinese import alternative at USD 505/ton CFR available.',
      },
      parts: {
        fabrication: {
          availability: 'good',
          clusters: ['Karawang', 'Bekasi', 'Cikarang (MM2100, Jababeka)'],
          suppliers: [
            { name: 'Astra Otoparts', url: 'https://www.astra.co.id', product: 'Pressed parts, metal fabrication' },
            { name: 'Krama Yudha Tiga Berlian (KTB)', url: '#', product: 'Truck/heavy equipment parts fabrication' },
          ],
          notes: 'Astra group ecosystem provides extensive fabrication capability. Karawang/Bekasi has strong automotive Tier 2/3 base for forklift frame/guard fabrication.',
        },
        powertrain: {
          availability: 'good',
          clusters: ['Karawang', 'Bekasi-Cikarang'],
          suppliers: [
            { name: 'PT. Astra Daihatsu Motor (ADM)', url: 'https://www.daihatsu.co.id', product: 'Transmission supply chain' },
            { name: 'PT. Toyota Motor Manufacturing Indonesia (TMMIN)', url: 'https://www.toyota.co.id', product: 'Automotive drivetrain' },
          ],
          notes: 'Toyota and Daihatsu powertrain ecosystem in Karawang creates deep supply chain. Heavy-duty forklift-specific transmission still import.',
        },
        hydraulics: {
          availability: 'fair',
          clusters: ['Bekasi', 'Cikarang'],
          suppliers: [
            { name: 'Parker Hannifin Indonesia', url: 'https://www.parker.com/id', product: 'Hydraulic components' },
            { name: 'Yuken Indonesia', url: 'https://www.yuken-ind.co.jp', product: 'Hydraulic valves, pumps' },
          ],
          notes: 'Assembly and distribution centers for hydraulics. Component manufacturing limited. Import dominates for pumps/motors.',
        },
        electrical: {
          availability: 'good',
          clusters: ['Cikarang', 'Bekasi', 'Tangerang'],
          suppliers: [
            { name: 'PT. Sumitomo Wiring Systems Indonesia', url: 'https://www.sws.co.jp', product: 'Wire harness' },
            { name: 'PT. Yazaki Indonesia', url: 'https://www.yazaki-group.com', product: 'Automotive wiring' },
          ],
          notes: 'Strong automotive wire harness ecosystem in West Java. Japanese-managed quality. Controller electronics: import.',
        },
        others: {
          availability: 'good',
          clusters: ['Karawang', 'Bekasi'],
          suppliers: [
            { name: 'PT. Bridgestone Tire Indonesia', url: 'https://www.bridgestone.co.id', product: 'Industrial tires' },
            { name: 'PT. DAS Indonesia Motor', url: '#', product: 'Seats, trim' },
          ],
          notes: 'Bridgestone Indonesia manufactures in Bekasi. Tire supply complete locally. Seat assembly available.',
        },
        counterweight: {
          availability: 'good',
          clusters: ['Bekasi', 'Cilegon'],
          suppliers: [
            { name: 'PT. Krakatau Wajatama', url: 'https://www.krakatauwajatama.co.id', product: 'Steel sections and castings' },
            { name: 'Local foundries, Bekasi industrial area', url: '#', product: 'Cast iron counterweight' },
          ],
          notes: 'Iron foundry capacity in Bekasi/Cilegon. Counterweight locally sourceable at competitive cost.',
        },
      },
      scSources: [
        {
          id: 'id-sc1',
          url: 'https://www.krakatauposco.co.id',
          organization: 'Krakatau POSCO',
          description: 'Krakatau POSCO Cilegon — HRC Production',
          quote: 'Krakatau POSCO produces hot rolled coil and other flat steel products at its integrated steelworks in Cilegon, with annual capacity of 3 million tons, supplying industrial and automotive customers across Indonesia.',
          accessDate: '2026-05',
        },
      ],
    },

    competitors: [
      {
        name: 'No confirmed major forklift OEM production plant in Karawang (2026)',
        url: 'https://www.kiongroup.com',
        established: 2024,
        capacity: 0,
        capacityUnit: 'N/A',
        makeVsBuy: 'N/A',
        automationLevel: 'N/A',
        automationDetails: 'No confirmed full-scale forklift production plant in Karawang as of 2026. Opportunity for first-mover.',
        coordinates: { lat: -6.32, lng: 107.3 },
        notes: 'Several forklift brands have sales/assembly operations in Indonesia but no large-scale manufacturing. First-mover opportunity in this market.',
      },
    ],

    costSummary: {
      laborCostIndexVsKorea: 18,
      energyCostIndexVsKorea: 69,
      landCostIndexVsKorea: 37,
      supplyChainRisk: 'medium',
      overallOpportunity: '2.7억 내수 시장 + Toyota/Honda 공급망 생태계 + Krakatau-POSCO 철강 근접 + 낮은 지게차 OEM 경쟁.',
      overallRisk: '노동 분쟁 이력, 관료주의, 전력 신뢰도, Tanjung Priok 혼잡, 외국인 토지 소유 제한.',
      estimatedManufacturingCostUSDPerUnit: 11800,
    },
  },
];

export default COUNTRIES;
