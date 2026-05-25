'use client';
import { useAtom } from 'jotai';
import { fxRatesAtom } from '@/lib/store';
import COUNTRIES from '@/data/countries';
import { getUSDValues, fmtUSD, COUNTRY_COLORS } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

const COUNTRY_PATHS: Record<string, string> = {
  KR: '/country/kr', MX: '/country/mx', VN: '/country/vn', TH: '/country/th', ID: '/country/id',
};

export default function HomePage() {
  const [fxRates] = useAtom(fxRatesAtom);
  const data = COUNTRIES.map((c) => ({ ...c, usd: getUSDValues(c, fxRates) }));
  const koreaUSD = getUSDValues(COUNTRIES[0], fxRates);

  const laborBarData = data.map((c) => ({
    name: c.cityKo,
    '최저시급(법정)': +c.usd.minWageHourlyUSD.toFixed(2),
    '제조공 실시급': +c.usd.actualMfgHourlyUSD.toFixed(2),
  }));

  const infraBarData = data.map((c) => ({
    name: c.cityKo,
    '전력(USD/kWh)': +c.usd.electricityUSD.toFixed(4),
    '용수(USD/m³)': +c.usd.waterUSD.toFixed(3),
    '가스(USD/MMBtu)': +c.usd.gasUSD.toFixed(2),
  }));

  const steelBarData = data.map((c) => ({
    name: c.cityKo,
    'HRC SS400(USD/ton)': Math.round(c.usd.steelUSDPerTon),
    fill: COUNTRY_COLORS[c.code],
  }));

  const landBarData = data.map((c) => ({
    name: c.cityKo,
    '대지임차(USD/m²)': Math.round(c.usd.leaseLandUSD),
    '공장건축(USD/m²)': Math.round(c.usd.constructionUSD),
  }));

  const radarData = [
    { subject: '노무비', ...Object.fromEntries(data.map((c) => [c.code, Math.round((c.usd.actualMfgHourlyUSD / koreaUSD.actualMfgHourlyUSD) * 100)])) },
    { subject: '전력단가', ...Object.fromEntries(data.map((c) => [c.code, Math.round((c.usd.electricityUSD / koreaUSD.electricityUSD) * 100)])) },
    { subject: '대지비', ...Object.fromEntries(data.map((c) => [c.code, Math.round((c.usd.leaseLandUSD / koreaUSD.leaseLandUSD) * 100)])) },
    { subject: '건축비', ...Object.fromEntries(data.map((c) => [c.code, Math.round((c.usd.constructionUSD / koreaUSD.constructionUSD) * 100)])) },
    { subject: '철강단가', ...Object.fromEntries(data.map((c) => [c.code, Math.round((c.usd.steelUSDPerTon / koreaUSD.steelUSDPerTon) * 100)])) },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">📋 국가별 핵심 원가 요소 한눈에 보기
          <span className="text-sm font-normal text-slate-500 ml-3">상단 FX 슬라이더로 환율 변경 → 전체 자동 재계산</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {data.map((c) => (
            <Link key={c.code} href={COUNTRY_PATHS[c.code]}>
              <div className="metric-card hover:border-blue-600 cursor-pointer transition-all"
                style={{ borderLeftWidth: 4, borderLeftColor: COUNTRY_COLORS[c.code] }}>
                <div className="flex justify-between mb-2">
                  <span className="text-2xl">{c.flag}</span>
                  <span className="text-[10px] bg-[#0f172a] px-2 py-0.5 rounded text-slate-500">{c.code}</span>
                </div>
                <div className="text-sm font-bold text-white">{c.nameKo}</div>
                <div className="text-[10px] text-slate-500 mb-3">{c.cityKo}</div>
                <div className="space-y-1">
                  <KPI label="최저시급" value={fmtUSD(c.usd.minWageHourlyUSD, 2) + '/hr'} />
                  <KPI label="제조공 실급" value={fmtUSD(c.usd.actualMfgHourlyUSD, 2) + '/hr'} />
                  <KPI label="전력" value={fmtUSD(c.usd.electricityUSD, 4) + '/kWh'} />
                  <KPI label="대지임차" value={fmtUSD(c.usd.leaseLandUSD, 0) + '/m²'} />
                  <KPI label="HRC SS400" value={fmtUSD(c.usd.steelUSDPerTon, 0) + '/ton'} />
                </div>
                <div className="mt-3 pt-3 border-t border-[#2d3748]">
                  <div className="text-[10px] text-slate-500">추정 제조원가/대</div>
                  <div className="text-lg font-bold" style={{ color: COUNTRY_COLORS[c.code] }}>
                    {fmtUSD(c.costSummary.estimatedManufacturingCostUSDPerUnit)}
                  </div>
                  <div className="text-[10px] text-slate-600">vs 한국 노무비 {c.costSummary.laborCostIndexVsKorea}%</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Opportunity/Risk */}
      <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">⚖️ 그린필드 기회 & 리스크 요약</h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {data.map((c) => (
            <div key={c.code}>
              <div className="font-semibold text-[13px] mb-2" style={{ color: COUNTRY_COLORS[c.code] }}>
                {c.flag} {c.nameKo}
              </div>
              <div className="bg-emerald-950/40 border border-emerald-900/30 rounded-lg p-2.5 mb-2">
                <div className="text-[10px] font-bold text-emerald-400 mb-1">✅ 기회</div>
                <div className="text-[11px] text-emerald-300 leading-relaxed">{c.costSummary.overallOpportunity}</div>
              </div>
              <div className="bg-red-950/30 border border-red-900/30 rounded-lg p-2.5">
                <div className="text-[10px] font-bold text-red-400 mb-1">⚠️ 리스크</div>
                <div className="text-[11px] text-red-300 leading-relaxed">{c.costSummary.overallRisk}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="💼 시급 비교 (USD/hr)" subtitle="법정 최저 vs 제조공 실제 시급">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={laborBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} unit="$" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                formatter={(v: unknown) => [`$${v}`, '']} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="최저시급(법정)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="제조공 실시급" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="⚡ 에너지 단가 비교 (USD)" subtitle="전력/kWh · 용수/m³ · 가스/MMBtu">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={infraBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="전력(USD/kWh)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="용수(USD/m³)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="가스(USD/MMBtu)" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="🔩 HRC SS400 철강 단가 (USD/ton)" subtitle="현지 조달 기준">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={steelBarData} layout="vertical" margin={{ top: 5, right: 30, left: 15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} unit="$" />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={65} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                formatter={(v: unknown) => [`$${v}/ton`, '']} />
              <Bar dataKey="HRC SS400(USD/ton)" radius={[0, 4, 4, 0]}
                fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="🏗️ 대지 임차 + 공장 건축비 (USD/m²)" subtitle="임차 = 30-50년 기준 / 건축 = 중공업 사양">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={landBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} unit="$" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                formatter={(v: unknown) => [`$${v}/m²`, '']} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="대지임차(USD/m²)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="공장건축(USD/m²)" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Radar */}
      <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5">
        <h2 className="text-sm font-bold text-white mb-1">🕸️ 원가 경쟁력 레이더 (한국=100 기준)</h2>
        <p className="text-[11px] text-slate-500 mb-4">낮을수록 비용 경쟁력 우수</p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            {COUNTRIES.map((c) => (
              <Radar key={c.code} name={`${c.flag} ${c.cityKo}`} dataKey={c.code}
                stroke={COUNTRY_COLORS[c.code]} fill={COUNTRY_COLORS[c.code]} fillOpacity={0.1} strokeWidth={2} />
            ))}
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
              formatter={(v: unknown) => [`${v} (한국=100)`, '']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Full Comparison Table */}
      <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2d3748]">
          <h2 className="text-sm font-bold text-white">📊 종합 비교 테이블</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">현재 환율 적용 USD 환산 | 항목 클릭 시 상세 페이지 이동</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sticky left-0 bg-[#0f172a] z-10">항목</th>
                {data.map((c) => (
                  <th key={c.code} style={{ color: COUNTRY_COLORS[c.code] }}>
                    {c.flag} {c.nameKo}<br />
                    <span className="font-normal text-slate-500 text-[10px]">{c.cityKo}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <SecRow label="💼 노무비" />
              <DataRow label="최저시급 (USD/hr)" values={data.map((c) => fmtUSD(c.usd.minWageHourlyUSD, 2))} />
              <DataRow label="제조공 실시급 (USD/hr)" values={data.map((c) => fmtUSD(c.usd.actualMfgHourlyUSD, 2))} hi />
              <DataRow label="법정 프링지 합계" values={data.map((c) => c.labor.blueCollar.fringe.total.toFixed(1) + '%')} />
              <DataRow label="용접공 구인 난이도" values={data.map((c) => {
                const d = c.labor.blueCollar.hiringDifficulty.welder;
                return d === 'low' ? '🟢 쉬움' : d === 'medium' ? '🟡 보통' : '🔴 어려움';
              })} />
              <DataRow label="현장직반장 월급(USD)" values={data.map((c) => fmtUSD(c.usd.supervisorUSD, 0))} />
              <DataRow label="공장장 월급(USD)" values={data.map((c) => fmtUSD(c.usd.plantMgrUSD, 0))} />

              <SecRow label="⚡ 인프라" />
              <DataRow label="전력 (USD/kWh)" values={data.map((c) => fmtUSD(c.usd.electricityUSD, 4))} hi />
              <DataRow label="용수 (USD/m³)" values={data.map((c) => fmtUSD(c.usd.waterUSD, 3))} />
              <DataRow label="가스 (USD/MMBtu)" values={data.map((c) => fmtUSD(c.usd.gasUSD, 2))} />
              <DataRow label="전력 공급 안정성" values={data.map((c) => {
                const s = c.infrastructure.electricity.supplyStability;
                return s === 'excellent' ? '✅ 최우수' : s === 'good' ? '🔵 안정' : s === 'fair' ? '🟡 불안정우려' : '🔴 불안정';
              })} />
              <DataRow label="연간 정전시간" values={data.map((c) => c.infrastructure.electricity.powerOutageHoursPerYear + 'hr')} />

              <SecRow label="🚢 항만 물류" />
              <DataRow label="주요 항만" values={data.map((c) => c.port.name.replace('International', 'Int\'l').slice(0, 20))} />
              <DataRow label="항만까지 거리" values={data.map((c) => c.port.distanceKm + ' km')} hi />
              <DataRow label="편도 운송비(USD)" values={data.map((c) => fmtUSD(c.usd.portTransportUSD, 0))} />
              <DataRow label="항만 안정성" values={data.map((c) => `${c.port.stabilityScore}/10`)} />

              <SecRow label="🏗️ 대지·건축·인허가" />
              <DataRow label="대지 임차(USD/m²)" values={data.map((c) => fmtUSD(c.usd.leaseLandUSD, 0))} hi />
              <DataRow label="공장 건축(USD/m²)" values={data.map((c) => fmtUSD(c.usd.constructionUSD, 0))} />
              <DataRow label="인허가 소요기간" values={data.map((c) => `~${c.permits.estimatedMonthsGreenfield}개월`)} />
              <DataRow label="WB 사업환경 순위" values={data.map((c) => `#${c.permits.worldBankEaseRank2024}`)} />

              <SecRow label="🔩 공급망" />
              <DataRow label="HRC SS400(USD/ton)" values={data.map((c) => fmtUSD(c.usd.steelUSDPerTon, 0))} hi />
              <DataRow label="현지 철강 조달" values={data.map((c) => {
                const a = c.supplyChain.steel.localAvailability;
                return a === 'excellent' ? '✅ 매우 좋음' : a === 'good' ? '🔵 좋음' : '🟡 보통';
              })} />
              <DataRow label="철강 리드타임" values={data.map((c) => c.supplyChain.steel.leadTimeDays + '일')} />

              <SecRow label="💰 종합 원가" />
              <DataRow label="추정 제조원가/대(USD)" values={data.map((c) => fmtUSD(c.costSummary.estimatedManufacturingCostUSDPerUnit))} hi />
              <DataRow label="노무비 지수(한국=100)" values={data.map((c) => c.costSummary.laborCostIndexVsKorea + '')} />
              <DataRow label="에너지 지수(한국=100)" values={data.map((c) => c.costSummary.energyCostIndexVsKorea + '')} />
              <DataRow label="대지비 지수(한국=100)" values={data.map((c) => c.costSummary.landCostIndexVsKorea + '')} />
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-[#0f172a] border-t border-[#1e293b]">
          <p className="text-[10px] text-slate-600">
            ※ 추정 제조원가: 노무비(40%)·에너지비(15%)·대지건축 감가(15%)·자재비(20%)·기타간접(10%) 가중합산. McKinsey/BCG Operations 표준 방법론 준용.
            실제 수치는 생산량·자동화 수준·MvB 비율에 따라 ±20-30% 편차 가능.
          </p>
        </div>
      </div>

      {/* Country links */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {data.map((c) => (
          <Link key={c.code} href={COUNTRY_PATHS[c.code]}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-[#2d3748] bg-[#1a1f2e] hover:border-blue-600 transition-colors text-center">
            <span className="text-3xl">{c.flag}</span>
            <span className="text-sm font-semibold text-white">{c.nameKo}</span>
            <span className="text-[11px] text-slate-500">{c.cityKo} 상세 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-slate-500">{label}</span>
      <span className="text-[11px] font-mono text-slate-200">{value}</span>
    </div>
  );
}
function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-[11px] text-slate-500 mb-3">{subtitle}</p>
      {children}
    </div>
  );
}
function SecRow({ label }: { label: string }) {
  return <tr><td colSpan={6} className="bg-[#0f172a] px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</td></tr>;
}
function DataRow({ label, values, hi }: { label: string; values: string[]; hi?: boolean }) {
  return (
    <tr>
      <td className="text-[12px] text-slate-400 font-medium whitespace-nowrap sticky left-0 bg-[#1a1f2e]">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`font-mono text-[12px] ${hi ? 'text-amber-300 font-semibold' : 'text-slate-200'}`}>{v}</td>
      ))}
    </tr>
  );
}
