/**
 * Excel export utilities using SheetJS (xlsx)
 * Supports: per-country detail export & integrated 5-country comparison export
 */
import * as XLSX from 'xlsx';
import { CountryData } from '@/data/countries';
import { getUSDValues } from '@/lib/utils';

type FxRates = Record<string, number>;

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────
function pct(n: number) { return `${n.toFixed(1)}%`; }
function usd(n: number, d = 0) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}
function addSheet(wb: XLSX.WorkBook, name: string, rows: (string | number | null)[][]) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  // Auto-width
  const colWidths = rows.reduce<number[]>((acc, row) => {
    row.forEach((cell, i) => {
      const len = cell == null ? 0 : String(cell).length;
      if (!acc[i] || acc[i] < len) acc[i] = len;
    });
    return acc;
  }, []);
  ws['!cols'] = colWidths.map((w) => ({ wch: Math.min(w + 2, 50) }));
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
}

// ─────────────────────────────────────────────────────────────
// 1. 개별 국가 상세 엑셀
// ─────────────────────────────────────────────────────────────
export function exportCountryExcel(country: CountryData, fxRates: FxRates) {
  const u = getUSDValues(country, fxRates);
  const rate = fxRates[country.currency] ?? country.defaultExchangeRate;
  const sym = country.currencySymbol;
  const wb = XLSX.utils.book_new();

  // Sheet 1: 노무비
  addSheet(wb, '1.노무비', [
    [`${country.flag} ${country.nameKo} (${country.cityKo}) — 노무비 상세`],
    [`환율: 1 USD = ${rate} ${country.currency}`, '', `기준일: ${new Date().toLocaleDateString('ko-KR')}`],
    [],
    ['항목', `현지 (${country.currency})`, 'USD 환산'],
    ['최저시급 (법정)', `${sym}${country.labor.blueCollar.minimumWage.localHourly?.toLocaleString()}/hr`, usd(u.minWageHourlyUSD, 2) + '/hr'],
    ['최저월급 (법정)', `${sym}${country.labor.blueCollar.minimumWage.localMonthly.toLocaleString()}/mo`, usd(u.minWageMonthlyUSD) + '/mo'],
    ['제조공 실제시급 (시장)', `${sym}${country.labor.blueCollar.actualManufacturing.localHourly?.toLocaleString()}/hr`, usd(u.actualMfgHourlyUSD, 2) + '/hr'],
    ['제조공 실제월급 (시장)', `${sym}${country.labor.blueCollar.actualManufacturing.localMonthly.toLocaleString()}/mo`, usd(u.actualMfgMonthlyUSD) + '/mo'],
    [],
    ['법정 프링지 합계', '', pct(country.labor.blueCollar.fringe.total)],
    ['  - 국민연금 (고용주)', '', pct(country.labor.blueCollar.fringe.pension)],
    ['  - 건강보험 (고용주)', '', pct(country.labor.blueCollar.fringe.health)],
    ['  - 고용보험', '', pct(country.labor.blueCollar.fringe.employment)],
    ['  - 산재보험', '', pct(country.labor.blueCollar.fringe.workersComp)],
    ['  - 기타', '', pct(country.labor.blueCollar.fringe.other)],
    [],
    ['구인 난이도'],
    ['일반공', '', country.labor.blueCollar.hiringDifficulty.generalWorker === 'low' ? '쉬움' : country.labor.blueCollar.hiringDifficulty.generalWorker === 'medium' ? '보통' : '어려움'],
    ['용접공', '', country.labor.blueCollar.hiringDifficulty.welder === 'low' ? '쉬움' : country.labor.blueCollar.hiringDifficulty.welder === 'medium' ? '보통' : '어려움'],
    ['도장공', '', country.labor.blueCollar.hiringDifficulty.painter === 'low' ? '쉬움' : country.labor.blueCollar.hiringDifficulty.painter === 'medium' ? '보통' : '어려움'],
    ['비고', '', country.labor.blueCollar.hiringDifficulty.notes],
    [],
    ['간접 인력 월급 (USD 환산)'],
    ['현장 반장', '', usd(u.supervisorUSD)],
    ['품질 엔지니어', '', usd(u.qaEngUSD)],
    ['물류 담당자', '', usd(u.logUSD)],
    [],
    ['사무직 월급 (USD 환산)'],
    ['공장장', '', usd(u.plantMgrUSD)],
    ['생산계획', '', usd(u.prodPlanUSD)],
    ['생산 엔지니어', '', usd(u.prodEngUSD)],
    ['품질관리 매니저', '', usd(u.qaMgrUSD)],
    ['구매', '', usd(u.procUSD)],
  ]);

  // Sheet 2: 인프라
  addSheet(wb, '2.인프라', [
    [`${country.flag} ${country.nameKo} — 인프라 & 유틸리티`],
    [`환율: 1 USD = ${rate} ${country.currency}`],
    [],
    ['항목', `현지 단가 (${country.currency})`, 'USD 단가', '안정성'],
    ['전력 (산업용)', `${sym}${country.infrastructure.electricity.localPerKwh}/kWh`, usd(u.electricityUSD, 4) + '/kWh', country.infrastructure.electricity.supplyStability],
    ['용수', `${sym}${country.infrastructure.water.localPerM3}/m³`, usd(u.waterUSD, 3) + '/m³', country.infrastructure.water.supplyStability],
    ['가스/LNG', `${sym}${country.infrastructure.gas.localPerUnit}/${country.infrastructure.gas.unit}`, usd(u.gasUSD, 2) + `/${country.infrastructure.gas.unit}`, country.infrastructure.gas.supplyStability],
    [],
    ['연간 정전 시간', '', `${country.infrastructure.electricity.powerOutageHoursPerYear}시간`],
    ['전력 요금 구조', '', country.infrastructure.electricity.tariffStructure],
    ['전력 비고', '', country.infrastructure.electricity.notes],
    [],
    ['항만 정보'],
    ['항만명', '', country.port.name],
    ['항만까지 거리', '', `${country.port.distanceKm} km`],
    ['편도 운송비', `${sym}${country.port.totalTransportCostLocalOneway.toLocaleString()}`, usd(u.portTransportUSD)],
    ['항만 안정성 점수', '', `${country.port.stabilityScore}/10`],
    ['혼잡 리스크', '', country.port.congestionRisk],
    ['통관 효율', '', country.port.customsEfficiency],
    ['연간 처리량 (TEU)', '', country.port.annualTEU],
  ]);

  // Sheet 3: 대지·건축·인허가
  addSheet(wb, '3.대지·건축', [
    [`${country.flag} ${country.nameKo} — 대지·건축·인허가`],
    [`환율: 1 USD = ${rate} ${country.currency}`],
    [],
    ['항목', `현지 (${country.currency})`, 'USD 환산'],
    ['대지 임차 단가', `${sym}${country.land.leasePriceLocalPerM2}/m²`, usd(u.leaseLandUSD) + '/m²'],
    ['대지 임차 기간', '', country.land.leaseTerm],
    ['공장 건축비', `${sym}${country.land.constructionCostLocalPerM2}/m²`, usd(u.constructionUSD) + '/m²'],
    ['공업 단지', '', country.land.zone],
    ['일반 부지 규모', '', country.land.typicalPlotSize],
    [],
    ['인허가'],
    ['예상 소요 기간', '', `${country.permits.estimatedMonthsGreenfield}개월`],
    ['난이도', '', country.permits.difficulty],
    ['WB 사업환경 순위 (2024)', '', `#${country.permits.worldBankEaseRank2024}`],
    ['외국인 소유 제한', '', country.permits.foreignOwnership],
    ['주요 인센티브', '', country.permits.incentives.join(' | ')],
    ['비고', '', country.permits.notes],
  ]);

  // Sheet 4: 공급망
  addSheet(wb, '4.공급망', [
    [`${country.flag} ${country.nameKo} — 공급망 & 철강`],
    [`환율: 1 USD = ${rate} ${country.currency}`],
    [],
    ['항목', '내용'],
    ['HRC SS400 단가', usd(u.steelUSDPerTon) + '/ton  |  ' + usd(u.steelUSDPerKg, 2) + '/kg'],
    ['현지 조달 가능성', country.supplyChain.steel.localAvailability],
    ['주요 현지 철강사', country.supplyChain.steel.mainProducers.map((p) => p.name).join(', ')],
    ['리드타임', `${country.supplyChain.steel.leadTimeDays}일`],
    [],
    ['부품 현지 조달성'],
    ['제관품', country.supplyChain.parts.fabrication.availability, country.supplyChain.parts.fabrication.clusters.join(', ')],
    ['파워트레인', country.supplyChain.parts.powertrain.availability, country.supplyChain.parts.powertrain.clusters.join(', ')],
    ['유압', country.supplyChain.parts.hydraulics.availability, country.supplyChain.parts.hydraulics.clusters.join(', ')],
    ['전장', country.supplyChain.parts.electrical.availability, country.supplyChain.parts.electrical.clusters.join(', ')],
    ['카운터웨이트', country.supplyChain.parts.counterweight.availability, country.supplyChain.parts.counterweight.clusters.join(', ')],
  ]);

  // Sheet 5: 원가 요약
  addSheet(wb, '5.원가요약', [
    [`${country.flag} ${country.nameKo} — 종합 원가 요약`],
    [`환율: 1 USD = ${rate} ${country.currency}`],
    [],
    ['항목', '수치 (한국=100 기준)'],
    ['노무비 지수', country.costSummary.laborCostIndexVsKorea],
    ['에너지 지수', country.costSummary.energyCostIndexVsKorea],
    ['대지비 지수', country.costSummary.landCostIndexVsKorea],
    ['공급망 리스크', country.costSummary.supplyChainRisk],
    [],
    ['추정 제조원가/대 (USD)', usd(country.costSummary.estimatedManufacturingCostUSDPerUnit)],
    [],
    ['핵심 기회', country.costSummary.overallOpportunity],
    ['핵심 리스크', country.costSummary.overallRisk],
  ]);

  const filename = `Footprint_${country.code}_${country.cityKo}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

// ─────────────────────────────────────────────────────────────
// 2. 5개국 통합 비교 엑셀
// ─────────────────────────────────────────────────────────────
export function exportIntegratedExcel(countries: CountryData[], fxRates: FxRates) {
  const wb = XLSX.utils.book_new();
  const allU = countries.map((c) => getUSDValues(c, fxRates));
  const headers = ['항목', ...countries.map((c) => `${c.flag} ${c.nameKo} (${c.cityKo})`)];

  // Sheet 1: 종합 비교 (Overview)
  addSheet(wb, '1.종합비교', [
    ['🌏 글로벌 풋프린트 타당성 — 5개국 종합 비교'],
    [`기준일: ${new Date().toLocaleDateString('ko-KR')}`, '', '', '환율은 각 국가 실시간 FX 적용'],
    [],
    headers,
    // 노무비
    ['━━ 노무비', ...countries.map(() => '')],
    ['최저시급 (USD/hr)', ...allU.map((u) => usd(u.minWageHourlyUSD, 2))],
    ['제조공 실제시급 (USD/hr)', ...allU.map((u) => usd(u.actualMfgHourlyUSD, 2))],
    ['법정 프링지 합계 (%)', ...countries.map((c) => pct(c.labor.blueCollar.fringe.total))],
    ['용접공 구인 난이도', ...countries.map((c) => c.labor.blueCollar.hiringDifficulty.welder === 'low' ? '🟢 쉬움' : c.labor.blueCollar.hiringDifficulty.welder === 'medium' ? '🟡 보통' : '🔴 어려움')],
    ['노무비 지수 (한국=100)', ...countries.map((c) => c.costSummary.laborCostIndexVsKorea)],
    // 인프라
    ['━━ 인프라', ...countries.map(() => '')],
    ['전력 (USD/kWh)', ...allU.map((u) => usd(u.electricityUSD, 4))],
    ['용수 (USD/m³)', ...allU.map((u) => usd(u.waterUSD, 3))],
    ['가스 (USD/MMBtu)', ...allU.map((u) => usd(u.gasUSD, 2))],
    ['전력 공급 안정성', ...countries.map((c) => c.infrastructure.electricity.supplyStability)],
    ['연간 정전 시간 (hr)', ...countries.map((c) => c.infrastructure.electricity.powerOutageHoursPerYear)],
    ['에너지 지수 (한국=100)', ...countries.map((c) => c.costSummary.energyCostIndexVsKorea)],
    // 대지·건축
    ['━━ 대지·건축', ...countries.map(() => '')],
    ['대지 임차 (USD/m²)', ...allU.map((u) => usd(u.leaseLandUSD))],
    ['공장 건축비 (USD/m²)', ...allU.map((u) => usd(u.constructionUSD))],
    ['인허가 소요 (개월)', ...countries.map((c) => c.permits.estimatedMonthsGreenfield)],
    ['WB 사업환경 순위', ...countries.map((c) => `#${c.permits.worldBankEaseRank2024}`)],
    ['대지비 지수 (한국=100)', ...countries.map((c) => c.costSummary.landCostIndexVsKorea)],
    // 물류
    ['━━ 항만·물류', ...countries.map(() => '')],
    ['주요 항만', ...countries.map((c) => c.port.name)],
    ['항만까지 거리 (km)', ...countries.map((c) => c.port.distanceKm)],
    ['편도 운송비 (USD)', ...allU.map((u) => usd(u.portTransportUSD))],
    ['항만 안정성 점수 (/10)', ...countries.map((c) => c.port.stabilityScore)],
    // 철강·공급망
    ['━━ 철강·공급망', ...countries.map(() => '')],
    ['HRC SS400 (USD/ton)', ...allU.map((u) => usd(u.steelUSDPerTon))],
    ['현지 철강 조달성', ...countries.map((c) => c.supplyChain.steel.localAvailability)],
    ['철강 리드타임 (일)', ...countries.map((c) => c.supplyChain.steel.leadTimeDays)],
    ['공급망 리스크', ...countries.map((c) => c.costSummary.supplyChainRisk)],
    // 종합 원가
    ['━━ 종합 원가', ...countries.map(() => '')],
    ['추정 제조원가/대 (USD)', ...allU.map((_, i) => usd(countries[i].costSummary.estimatedManufacturingCostUSDPerUnit))],
    ['핵심 기회', ...countries.map((c) => c.costSummary.overallOpportunity)],
    ['핵심 리스크', ...countries.map((c) => c.costSummary.overallRisk)],
  ]);

  // Sheet 2: FX 민감도
  const baseRates = countries.map((c) => fxRates[c.currency] ?? c.defaultExchangeRate);
  const scenarios = [
    { label: 'Base (현재 FX)', mult: 1 },
    { label: '현지화폐 +10% (강세)', mult: 1 / 1.1 },   // local currency appreciates → rate decreases
    { label: '현지화폐 -10% (약세)', mult: 1 / 0.9 },
  ];

  const fxRows: (string | number | null)[][] = [
    ['📉 환율 민감도 분석 — 제조원가/대 (USD)'],
    ['현지화폐 +10% = USD 환산 비용 상승 (조달/임금 상승 효과)'],
    [],
    ['시나리오', ...countries.map((c) => `${c.flag} ${c.nameKo}`)],
  ];
  scenarios.forEach(({ label, mult }) => {
    const row: (string | number | null)[] = [label];
    countries.forEach((c) => {
      // FX-sensitive portion ≈ 85% (labor, energy, land, local materials)
      // USD-denominated portion ≈ 15% (imported parts) — FX-insensitive
      const LOCAL_PORTION = 0.85;
      const base = c.costSummary.estimatedManufacturingCostUSDPerUnit;
      const adjusted = Math.round(base * (1 - LOCAL_PORTION) + base * LOCAL_PORTION / mult);
      row.push(adjusted);
    });
    fxRows.push(row);
  });
  fxRows.push(
    [],
    ['─ 기준 환율', ...countries.map((c, i) => `1 USD = ${baseRates[i]} ${c.currency}`)],
  );
  addSheet(wb, '2.FX민감도', fxRows);

  // Sheet 3: 경쟁사
  const compRows: (string | number | null)[][] = [
    ['🏭 글로벌 지게차 OEM 후보국 생산거점 현황'],
    [],
    ['국가', '경쟁사', '설립연도', '생산 개시', '연간 생산능력', 'Make vs Buy 전략', '자동화 수준', '비고'],
  ];
  countries.forEach((c) => {
    c.competitors.forEach((comp) => {
      compRows.push([
        `${c.flag} ${c.nameKo}`,
        comp.name,
        comp.established,
        comp.operationStart ?? '-',
        `${comp.capacity.toLocaleString()} ${comp.capacityUnit}`,
        comp.makeVsBuy,
        comp.automationLevel,
        comp.notes,
      ]);
    });
  });
  addSheet(wb, '3.경쟁사현황', compRows);

  // Sheet 4: 국가별 원데이터
  countries.forEach((c, i) => {
    const u = allU[i];
    const rate = fxRates[c.currency] ?? c.defaultExchangeRate;
    addSheet(wb, `RAW_${c.code}`, [
      [`${c.flag} ${c.nameKo} 원데이터`],
      [`환율: 1 USD = ${rate} ${c.currency}`],
      [],
      ['최저시급 (현지)', c.labor.blueCollar.minimumWage.localHourly ?? 0],
      ['최저시급 (USD)', u.minWageHourlyUSD],
      ['실제시급 (현지)', c.labor.blueCollar.actualManufacturing.localHourly ?? 0],
      ['실제시급 (USD)', u.actualMfgHourlyUSD],
      ['전력 (현지/kWh)', c.infrastructure.electricity.localPerKwh],
      ['전력 (USD/kWh)', u.electricityUSD],
      ['용수 (현지/m³)', c.infrastructure.water.localPerM3],
      ['용수 (USD/m³)', u.waterUSD],
      ['가스 (현지)', c.infrastructure.gas.localPerUnit],
      ['가스 (USD)', u.gasUSD],
      ['대지임차 (현지/m²)', c.land.leasePriceLocalPerM2],
      ['대지임차 (USD/m²)', u.leaseLandUSD],
      ['건축비 (현지/m²)', c.land.constructionCostLocalPerM2],
      ['건축비 (USD/m²)', u.constructionUSD],
      ['SS400 (현지/ton)', c.supplyChain.steel.hrcSS400PriceLocalPerTon],
      ['SS400 (USD/ton)', u.steelUSDPerTon],
      ['항만 운송비 (현지)', c.port.totalTransportCostLocalOneway],
      ['항만 운송비 (USD)', u.portTransportUSD],
      ['추정 제조원가/대 (USD)', c.costSummary.estimatedManufacturingCostUSDPerUnit],
    ]);
  });

  const filename = `Footprint_5Countries_Integrated_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}
