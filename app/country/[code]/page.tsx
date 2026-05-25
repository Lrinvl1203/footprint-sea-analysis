'use client';
import { useParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { fxRatesAtom } from '@/lib/store';
import COUNTRIES from '@/data/countries';
import { getUSDValues, fmtUSD, fmtLocal, COUNTRY_COLORS, getAvailClass, getAvailLabel, getDiffClass, getDiffLabel, getStabClass, getStabLabel } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const SupplyMap = dynamic(() => import('@/components/SupplyMap'), { ssr: false });

const CODE_MAP: Record<string, string> = {
  kr: 'KR', mx: 'MX', vn: 'VN', th: 'TH', id: 'ID',
};

type Tab = 'labor' | 'infra' | 'land' | 'supply' | 'competitors';

export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const [fxRates] = useAtom(fxRatesAtom);
  const [tab, setTab] = useState<Tab>('labor');

  const countryCode = CODE_MAP[code?.toLowerCase() ?? ''];
  const country = COUNTRIES.find((c) => c.code === countryCode);

  if (!country) {
    return <div className="text-red-400 p-8">국가를 찾을 수 없습니다: {code}</div>;
  }

  const u = getUSDValues(country, fxRates);
  const rate = fxRates[country.currency] ?? country.defaultExchangeRate;
  const color = COUNTRY_COLORS[country.code];
  const sym = country.currencySymbol;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'labor', label: '💼 노무비·인력' },
    { id: 'infra', label: '⚡ 인프라·항만' },
    { id: 'land', label: '🏗️ 대지·건축·인허가' },
    { id: 'supply', label: '🔩 공급망·철강' },
    { id: 'competitors', label: '🏭 경쟁사 현황' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1a1f2e] border rounded-xl p-5 flex items-start justify-between gap-4"
        style={{ borderColor: color + '40' }}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{country.flag}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{country.nameKo} — {country.cityKo}</h1>
              <div className="text-sm text-slate-400">{country.industrialZone}</div>
            </div>
          </div>
          <p className="text-[12px] text-slate-400 max-w-2xl leading-relaxed">{country.cityJustification}</p>
        </div>
        <div className="text-right shrink-0 hidden md:block">
          <div className="text-[11px] text-slate-500 mb-1">추정 제조원가/대</div>
          <div className="text-2xl font-bold" style={{ color }}>
            {fmtUSD(country.costSummary.estimatedManufacturingCostUSDPerUnit)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            1 USD = {sym}{rate.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── LABOR TAB ─────────────────────────────── */}
      {tab === 'labor' && (
        <div className="space-y-6">
          {/* Blue Collar */}
          <Section title="👷 Blue Collar — 생산직 임금">
            <table className="data-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th>현지통화 ({country.currency})</th>
                  <th>USD (현재 환율)</th>
                  <th>근거</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-slate-400">법정 최저 월급 (최저임금)</td>
                  <td className="font-mono text-amber-300">{sym}{country.labor.blueCollar.minimumWage.localMonthly.toLocaleString()}</td>
                  <td className="font-mono text-amber-300">{fmtUSD(u.minWageMonthlyUSD, 0)}</td>
                  <td><SourceLink src={country.labor.laborSources[0]} /></td>
                </tr>
                <tr>
                  <td className="text-slate-400">법정 최저 시급</td>
                  <td className="font-mono text-slate-200">{sym}{(country.labor.blueCollar.minimumWage.localHourly ?? 0).toLocaleString()}/hr</td>
                  <td className="font-mono text-slate-200">{fmtUSD(u.minWageHourlyUSD, 2)}/hr</td>
                  <td><SourceLink src={country.labor.laborSources[0]} /></td>
                </tr>
                <tr>
                  <td className="text-slate-400 font-semibold">제조공 실제 시급 (시장임률)</td>
                  <td className="font-mono text-emerald-300 font-bold">{sym}{(country.labor.blueCollar.actualManufacturing.localHourly ?? 0).toLocaleString()}/hr</td>
                  <td className="font-mono text-emerald-300 font-bold">{fmtUSD(u.actualMfgHourlyUSD, 2)}/hr</td>
                  <td className="text-[10px] text-slate-500">시장조사 기반 추정</td>
                </tr>
                <tr>
                  <td className="text-slate-400 font-semibold">Total Burdened (최저+프링지)</td>
                  <td className="font-mono text-blue-300">{sym}{country.labor.blueCollar.totalBurdened.localMonthly.toLocaleString()}/월</td>
                  <td className="font-mono text-blue-300">{fmtUSD(u.minWageMonthlyUSD * (1 + country.labor.blueCollar.fringe.total / 100), 0)}/월</td>
                  <td className="text-[10px] text-slate-500">최저임금 × (1+{country.labor.blueCollar.fringe.total}%)</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Fringe Detail */}
          <Section title="📋 법정 복리후생 (Fringe Benefits) 상세">
            <table className="data-table">
              <thead>
                <tr><th>항목</th><th>사용자 부담률</th><th>설명</th></tr>
              </thead>
              <tbody>
                {[
                  ['연금 (Pension)', country.labor.blueCollar.fringe.pension, ''],
                  ['건강보험 (Health)', country.labor.blueCollar.fringe.health, ''],
                  ['고용보험 (Employment)', country.labor.blueCollar.fringe.employment, ''],
                  ['산재보험 (Workers Comp)', country.labor.blueCollar.fringe.workersComp, ''],
                  ['기타 (퇴직금·상여 등)', country.labor.blueCollar.fringe.other, ''],
                ].map(([label, pct]) => (
                  <tr key={label as string}>
                    <td className="text-slate-400">{label as string}</td>
                    <td className="font-mono text-slate-200">{(pct as number).toFixed(2)}%</td>
                    <td className="text-[11px] text-slate-500">기준 월급 대비</td>
                  </tr>
                ))}
                <tr className="bg-[#0f172a]">
                  <td className="font-bold text-white">합계 프링지 비율</td>
                  <td className="font-mono font-bold text-amber-300">{country.labor.blueCollar.fringe.total.toFixed(2)}%</td>
                  <td className="text-[11px] text-slate-500">사용자 부담 합계</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 text-[11px] text-slate-500">
              <SourceLink src={country.labor.laborSources[0]} />
              {country.labor.laborSources[1] && <> | <SourceLink src={country.labor.laborSources[1]} /></>}
            </div>
          </Section>

          {/* Hiring Difficulty */}
          <Section title="🔍 직종별 구인 난이도">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: '일반 생산직', key: 'generalWorker' as const },
                { label: '용접공 (Welder)', key: 'welder' as const },
                { label: '도장공 (Painter)', key: 'painter' as const },
              ].map(({ label, key }) => {
                const d = country.labor.blueCollar.hiringDifficulty[key];
                return (
                  <div key={key} className="metric-card">
                    <div className="text-[12px] text-slate-400 mb-2">{label}</div>
                    <span className={getDiffClass(d)}>{getDiffLabel(d)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[12px] text-slate-400 bg-[#0f172a] rounded-lg p-3">
              {country.labor.blueCollar.hiringDifficulty.notes}
            </div>
          </Section>

          {/* Indirect & White Collar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="🔧 간접 인력 (Indirect) 월급">
              <table className="data-table">
                <thead><tr><th>직책</th><th>{country.currency}</th><th>USD</th></tr></thead>
                <tbody>
                  <tr><td className="text-slate-400">현장 직·반장 (Supervisor)</td>
                    <td className="font-mono text-slate-200">{sym}{country.labor.indirect.supervisor.localMonthly.toLocaleString()}</td>
                    <td className="font-mono text-amber-300">{fmtUSD(u.supervisorUSD, 0)}</td>
                  </tr>
                  <tr><td className="text-slate-400">품질 관리 요원 (QA Tech)</td>
                    <td className="font-mono text-slate-200">{sym}{country.labor.indirect.qaEngineer.localMonthly.toLocaleString()}</td>
                    <td className="font-mono text-amber-300">{fmtUSD(u.qaEngUSD, 0)}</td>
                  </tr>
                  <tr><td className="text-slate-400">물류 담당 (Logistics)</td>
                    <td className="font-mono text-slate-200">{sym}{country.labor.indirect.logisticsWorker.localMonthly.toLocaleString()}</td>
                    <td className="font-mono text-amber-300">{fmtUSD(u.logUSD, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section title="👔 White Collar 월급 (연봉/12)">
              <table className="data-table">
                <thead><tr><th>직책</th><th>{country.currency}</th><th>USD</th></tr></thead>
                <tbody>
                  {[
                    ['생산 계획', country.labor.whiteCollar.productionPlanning.localMonthly, u.prodPlanUSD],
                    ['생산 기술', country.labor.whiteCollar.productionEngineer.localMonthly, u.prodEngUSD],
                    ['QA 관리자', country.labor.whiteCollar.qaManager.localMonthly, u.qaMgrUSD],
                    ['구매', country.labor.whiteCollar.procurement.localMonthly, u.procUSD],
                    ['공장장', country.labor.whiteCollar.plantManager.localMonthly, u.plantMgrUSD],
                  ].map(([label, local, usd]) => (
                    <tr key={label as string}>
                      <td className="text-slate-400">{label as string}</td>
                      <td className="font-mono text-slate-200">{sym}{(local as number).toLocaleString()}</td>
                      <td className="font-mono text-amber-300">{fmtUSD(usd as number, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          </div>
        </div>
      )}

      {/* ── INFRA TAB ─────────────────────────────── */}
      {tab === 'infra' && (
        <div className="space-y-6">
          <Section title="⚡ 에너지 단가 & 수급 안정성">
            <table className="data-table">
              <thead>
                <tr><th>에너지 종류</th><th>현지 단가</th><th>USD 단가</th><th>수급 안정성</th><th>비고</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-slate-400 font-semibold">산업용 전력</td>
                  <td className="font-mono text-amber-300">{sym}{country.infrastructure.electricity.localPerKwh.toLocaleString()}/kWh</td>
                  <td className="font-mono text-amber-300">{fmtUSD(u.electricityUSD, 4)}/kWh</td>
                  <td><span className={getStabClass(country.infrastructure.electricity.supplyStability)}>
                    {getStabLabel(country.infrastructure.electricity.supplyStability)}
                  </span></td>
                  <td className="text-[11px] text-slate-500">{country.infrastructure.electricity.tariffStructure}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 font-semibold">공업용 용수</td>
                  <td className="font-mono text-blue-300">{sym}{country.infrastructure.water.localPerM3.toLocaleString()}/m³</td>
                  <td className="font-mono text-blue-300">{fmtUSD(u.waterUSD, 3)}/m³</td>
                  <td><span className={getStabClass(country.infrastructure.water.supplyStability)}>
                    {getStabLabel(country.infrastructure.water.supplyStability)}
                  </span></td>
                  <td className="text-[11px] text-slate-500">{country.infrastructure.water.notes}</td>
                </tr>
                <tr>
                  <td className="text-slate-400 font-semibold">산업 가스</td>
                  <td className="font-mono text-orange-300">{sym}{country.infrastructure.gas.localPerUnit.toLocaleString()}/{country.infrastructure.gas.unit}</td>
                  <td className="font-mono text-orange-300">{fmtUSD(u.gasUSD, 2)}/{country.infrastructure.gas.unit}</td>
                  <td><span className={getStabClass(country.infrastructure.gas.supplyStability)}>
                    {getStabLabel(country.infrastructure.gas.supplyStability)}
                  </span></td>
                  <td className="text-[11px] text-slate-500">{country.infrastructure.gas.notes}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard icon="⚡" label="전력 공급 안정성 분석" value={country.infrastructure.electricity.notes}
                sub={`연간 정전 시간: ~${country.infrastructure.electricity.powerOutageHoursPerYear}시간`} />
              <InfoCard icon="💧" label="용수 공급" value={country.infrastructure.water.notes} sub="" />
              <InfoCard icon="🔥" label="가스 공급" value={country.infrastructure.gas.notes} sub="" />
            </div>

            <div className="mt-2 text-[10px] text-slate-600">
              <SourceLink src={country.infrastructure.infraSources[0]} />
            </div>
          </Section>

          <Section title="🚢 항만 현황 & 내륙 운송">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="주요 항만" value={country.port.name} sub="" />
              <StatCard label="공단 → 항만 거리" value={`${country.port.distanceKm} km`} sub="" />
              <StatCard label="편도 내륙 운송비" value={fmtUSD(u.portTransportUSD, 0)} sub={`${sym}${country.port.totalTransportCostLocalOneway.toLocaleString()} 기준`} />
              <StatCard label="항만 안정성 점수" value={`${country.port.stabilityScore}/10`} sub={country.port.congestionRisk === 'low' ? '🟢 혼잡 위험 낮음' : country.port.congestionRisk === 'medium' ? '🟡 중간' : '🔴 높음'} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <StatCard label="연간 처리량" value={country.port.annualTEU} sub="" />
              <StatCard label="통관 효율" value={country.port.customsEfficiency === 'excellent' ? '✅ 최우수' : country.port.customsEfficiency === 'good' ? '🔵 양호' : '🟡 보통'} sub="" />
              <StatCard label="컨테이너 THC" value={`$${country.port.containerHandlingCostUSD}/TEU`} sub="추정치" />
            </div>
            <div className="bg-[#0f172a] rounded-lg p-3 text-[12px] text-slate-400">
              {country.port.portNotes}
            </div>
            <div className="mt-2 text-[10px] text-slate-600">
              {country.port.portSources.map((s) => <><SourceLink key={s.id} src={s} /> </>)}
            </div>
          </Section>
        </div>
      )}

      {/* ── LAND TAB ──────────────────────────────── */}
      {tab === 'land' && (
        <div className="space-y-6">
          <Section title="🏗️ 대지비 & 건축비">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {country.land.purchasePriceUSDPerM2 && (
                <StatCard label="대지 매입가" value={fmtUSD(country.land.purchasePriceUSDPerM2, 0) + '/m²'}
                  sub={`${sym}${(country.land.purchasePriceLocalPerM2 ?? 0).toLocaleString()}/m²`} />
              )}
              <StatCard label="대지 임차가 (일시납)" value={fmtUSD(u.leaseLandUSD, 0) + '/m²'}
                sub={`${sym}${country.land.leasePriceLocalPerM2.toLocaleString()}/m² · ${country.land.leaseTerm}`} />
              <StatCard label="공장 건축비" value={fmtUSD(u.constructionUSD, 0) + '/m²'}
                sub={`${sym}${country.land.constructionCostLocalPerM2.toLocaleString()}/m²`} />
              <StatCard label="산업단지" value={country.land.zone.split('/')[0].trim()} sub={country.land.typicalPlotSize + ' 표준 부지'} />
            </div>
            <div className="bg-[#0f172a] rounded-lg p-3 text-[12px] text-slate-400 mb-2">
              {country.land.notes}
            </div>
            <div className="text-[10px] text-slate-600">
              {country.land.landSources.map((s) => <><SourceLink key={s.id} src={s} /> </>)}
            </div>
          </Section>

          <Section title="📋 인허가 & 행정 성숙도">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="그린필드 인허가 소요" value={`~${country.permits.estimatedMonthsGreenfield}개월`} sub="" />
              <StatCard label="난이도" value={country.permits.difficulty === 'low' ? '🟢 쉬움' : country.permits.difficulty === 'medium' ? '🟡 보통' : '🔴 어려움'} sub="" />
              <StatCard label="World Bank 사업환경" value={`#${country.permits.worldBankEaseRank2024}`} sub="2024년 기준" />
              <StatCard label="외국인 지분" value={country.permits.foreignOwnership} sub="" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-2">📌 주요 인허가 요구사항</div>
                <ul className="space-y-1">
                  {country.permits.keyRequirements.map((r, i) => (
                    <li key={i} className="text-[12px] text-slate-300 flex gap-2">
                      <span className="text-slate-600 shrink-0">{i + 1}.</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-emerald-400 mb-2">✅ 투자 인센티브</div>
                <ul className="space-y-1">
                  {country.permits.incentives.map((r, i) => (
                    <li key={i} className="text-[12px] text-emerald-300 flex gap-2">
                      <span className="text-emerald-700 shrink-0">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-[#0f172a] rounded-lg p-3 text-[12px] text-slate-400">
              {country.permits.notes}
            </div>
            <div className="mt-2 text-[10px] text-slate-600">
              {country.permits.permitSources.map((s) => <><SourceLink key={s.id} src={s} /> </>)}
            </div>
          </Section>
        </div>
      )}

      {/* ── SUPPLY CHAIN TAB ──────────────────────── */}
      {tab === 'supply' && (
        <div className="space-y-6">
          {/* Steel */}
          <Section title="🔩 철강 조달 분석 (HRC SS400 / JIS G3101)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="현지 조달 가능성" value={getAvailLabel(country.supplyChain.steel.localAvailability)} sub="" />
              <StatCard label="HRC SS400 단가" value={fmtUSD(u.steelUSDPerTon, 0) + '/ton'}
                sub={`${sym}${country.supplyChain.steel.hrcSS400PriceLocalPerTon.toLocaleString()}/ton`} />
              <StatCard label="kg당 단가" value={'$' + u.steelUSDPerKg.toFixed(3) + '/kg'} sub="" />
              <StatCard label="조달 리드타임" value={country.supplyChain.steel.leadTimeDays + '일'} sub="EXW/FCA 기준" />
            </div>
            <div className="bg-[#0f172a] rounded-lg p-3 text-[12px] text-slate-400 mb-3">
              {country.supplyChain.steel.notes}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mb-2">주요 철강사</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {country.supplyChain.steel.mainProducers.map((p) => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="bg-[#0f172a] border border-[#2d3748] rounded-lg p-3 hover:border-blue-600 transition-colors block">
                  <div className="text-[13px] font-semibold text-blue-400">{p.name} ↗</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">📍 {p.location}</div>
                  {p.capacity && <div className="text-[11px] text-slate-500">⚙️ {p.capacity}</div>}
                </a>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-slate-600">
              {country.supplyChain.scSources.map((s) => <><SourceLink key={s.id} src={s} /> </>)}
            </div>
          </Section>

          {/* Parts */}
          <Section title="⚙️ 6대 부품군 현지 조달성 분석">
            <div className="space-y-4">
              {[
                { key: 'fabrication', label: '제관품 (Frame, Overhead Guard, Carriage, Mast, LBR)', data: country.supplyChain.parts.fabrication },
                { key: 'powertrain', label: '파워트레인 (Transmission, Drive Axle)', data: country.supplyChain.parts.powertrain },
                { key: 'hydraulics', label: '유압 (실린더, 펌프, 모터, 밸브)', data: country.supplyChain.parts.hydraulics },
                { key: 'electrical', label: '전장 (하네스, 컨트롤러)', data: country.supplyChain.parts.electrical },
                { key: 'others', label: '기타 (시트, 타이어, 휠)', data: country.supplyChain.parts.others },
                { key: 'counterweight', label: '카운터 웨이트 (Counter Weight)', data: country.supplyChain.parts.counterweight },
              ].map(({ key, label, data: pd }) => (
                <div key={key} className="bg-[#0f172a] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[13px] font-semibold text-white">{label}</div>
                    <span className={getAvailClass(pd.availability)}>{getAvailLabel(pd.availability)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">
                    📍 클러스터: {pd.clusters.join(' · ')}
                  </div>
                  <div className="text-[11px] text-slate-400 mb-3">{pd.notes}</div>
                  <div className="flex flex-wrap gap-2">
                    {pd.suppliers.map((s) => (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[#1a1f2e] border border-[#2d3748] rounded px-2 py-1 text-[11px] text-blue-400 hover:border-blue-600 transition-colors">
                        {s.name} <span className="text-[9px] text-slate-600">({s.product})</span> ↗
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Map */}
          <Section title="🗺️ 공급망 클러스터 지도">
            <SupplyMap country={country} />
          </Section>
        </div>
      )}

      {/* ── COMPETITORS TAB ───────────────────────── */}
      {tab === 'competitors' && (
        <div className="space-y-6">
          <Section title="🏭 지게차 완성차 OEM 현황 (판매법인 제외, 생산 공장만)">
            {country.competitors.length === 0 || (country.competitors.length === 1 && country.competitors[0].capacity === 0) ? (
              <div className="bg-emerald-950/30 border border-emerald-900/30 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <div className="text-lg font-bold text-emerald-400 mb-2">퍼스트 무버 기회</div>
                <div className="text-[12px] text-emerald-300">
                  {country.nameKo} {country.cityKo}에 지게차 완성차 생산 공장을 보유한 글로벌 OEM이 확인되지 않습니다.
                  그린필드 진출 시 퍼스트 무버로서의 경쟁 우위를 선점할 수 있습니다.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {country.competitors.map((comp) => (
                  comp.capacity > 0 && (
                    <div key={comp.name} className="bg-[#0f172a] border border-[#2d3748] rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <a href={comp.url} target="_blank" rel="noopener noreferrer"
                            className="text-[14px] font-bold text-blue-400 hover:underline">
                            {comp.name} ↗
                          </a>
                          {comp.nameKo && <div className="text-[11px] text-slate-500">{comp.nameKo}</div>}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[12px] font-bold text-amber-300">{comp.capacity.toLocaleString()} {comp.capacityUnit}</div>
                          <div className="text-[10px] text-slate-500">설립 {comp.established}년</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InfoCard icon="⚙️" label="Make vs Buy" value={comp.makeVsBuy} sub="" />
                        <InfoCard icon="🤖" label="자동화 수준" value={comp.automationLevel === 'high' ? '높음 (로봇 용접+)' : comp.automationLevel === 'medium' ? '중간 (반자동)' : '낮음'} sub={comp.automationDetails} />
                        <InfoCard icon="📝" label="비고" value={comp.notes} sub="" />
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </Section>

          <Section title="🗺️ 경쟁사 위치 지도">
            <SupplyMap country={country} showCompetitors />
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5">
      <h2 className="text-sm font-bold text-white mb-4 pb-3 border-b border-[#2d3748]">{title}</h2>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="metric-card">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="text-[14px] font-bold text-amber-300">{value}</div>
      {sub && <div className="text-[10px] text-slate-600 mt-0.5">{sub}</div>}
    </div>
  );
}

function InfoCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-lg p-3">
      <div className="text-[11px] text-slate-500 mb-1">{icon} {label}</div>
      <div className="text-[12px] text-slate-200 leading-relaxed">{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function SourceLink({ src }: { src: { url: string; organization: string; quote: string } | undefined }) {
  if (!src) return null;
  return (
    <span>
      <a href={src.url} target="_blank" rel="noopener noreferrer" className="source-link">
        📎 {src.organization}
      </a>
      <span className="text-[9px] text-slate-600 ml-1">"{src.quote.slice(0, 80)}..."</span>
    </span>
  );
}
