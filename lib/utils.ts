import { CountryData } from '@/data/countries';

export function fmtUSD(val: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function fmtLocal(val: number, symbol: string, decimals = 0): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
  return `${symbol}${formatted}`;
}

export function fmtNum(val: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function toUSD(localVal: number, fxRate: number): number {
  return localVal / fxRate;
}

// Given country data + current FX rates, compute key USD figures
export function getUSDValues(country: CountryData, fxRates: Record<string, number>) {
  const rate = fxRates[country.currency] ?? country.defaultExchangeRate;
  return {
    rate,
    minWageMonthlyUSD: toUSD(country.labor.blueCollar.minimumWage.localMonthly, rate),
    minWageHourlyUSD: toUSD(country.labor.blueCollar.minimumWage.localHourly ?? 0, rate),
    actualMfgMonthlyUSD: toUSD(country.labor.blueCollar.actualManufacturing.localMonthly, rate),
    actualMfgHourlyUSD: toUSD(country.labor.blueCollar.actualManufacturing.localHourly ?? 0, rate),
    electricityUSD: toUSD(country.infrastructure.electricity.localPerKwh, rate),
    waterUSD: toUSD(country.infrastructure.water.localPerM3, rate),
    gasUSD: toUSD(country.infrastructure.gas.localPerUnit, rate),
    leaseLandUSD: toUSD(country.land.leasePriceLocalPerM2, rate),
    constructionUSD: toUSD(country.land.constructionCostLocalPerM2, rate),
    steelUSDPerTon: toUSD(country.supplyChain.steel.hrcSS400PriceLocalPerTon, rate),
    steelUSDPerKg: toUSD(country.supplyChain.steel.hrcSS400PriceLocalPerTon, rate) / 1000,
    portTransportUSD: toUSD(country.port.totalTransportCostLocalOneway, rate),
    supervisorUSD: toUSD(country.labor.indirect.supervisor.localMonthly, rate),
    qaEngUSD: toUSD(country.labor.indirect.qaEngineer.localMonthly, rate),
    logUSD: toUSD(country.labor.indirect.logisticsWorker.localMonthly, rate),
    plantMgrUSD: toUSD(country.labor.whiteCollar.plantManager.localMonthly, rate),
    prodPlanUSD: toUSD(country.labor.whiteCollar.productionPlanning.localMonthly, rate),
    prodEngUSD: toUSD(country.labor.whiteCollar.productionEngineer.localMonthly, rate),
    qaMgrUSD: toUSD(country.labor.whiteCollar.qaManager.localMonthly, rate),
    procUSD: toUSD(country.labor.whiteCollar.procurement.localMonthly, rate),
  };
}

export const COUNTRY_COLORS: Record<string, string> = {
  KR: '#ef4444',
  MX: '#10b981',
  VN: '#f59e0b',
  TH: '#8b5cf6',
  ID: '#f97316',
};

export const COUNTRY_BG: Record<string, string> = {
  KR: 'rgba(239,68,68,0.1)',
  MX: 'rgba(16,185,129,0.1)',
  VN: 'rgba(245,158,11,0.1)',
  TH: 'rgba(139,92,246,0.1)',
  ID: 'rgba(249,115,22,0.1)',
};

export function getAvailClass(avail: string): string {
  const map: Record<string, string> = {
    'excellent': 'avail-excellent',
    'good': 'avail-good',
    'fair': 'avail-fair',
    'limited': 'avail-limited',
    'import-only': 'avail-import-only',
  };
  return map[avail] ?? 'avail-fair';
}

export function getAvailLabel(avail: string): string {
  const map: Record<string, string> = {
    'excellent': '✅ 매우 좋음',
    'good': '🔵 좋음',
    'fair': '🟡 보통',
    'limited': '🔴 제한적',
    'import-only': '🟣 수입 의존',
  };
  return map[avail] ?? avail;
}

export function getDiffClass(d: string): string {
  return d === 'low' ? 'diff-low' : d === 'medium' ? 'diff-medium' : 'diff-high';
}

export function getDiffLabel(d: string): string {
  return d === 'low' ? '🟢 쉬움' : d === 'medium' ? '🟡 보통' : '🔴 어려움';
}

export function getStabClass(d: string): string {
  return `stab-${d}`;
}

export function getStabLabel(d: string): string {
  const map: Record<string, string> = {
    excellent: '✅ 매우 안정', good: '🔵 안정', fair: '🟡 불안정 우려', poor: '🔴 불안정'
  };
  return map[d] ?? d;
}
