'use client';
import { useAtom } from 'jotai';
import { fxRatesAtom } from '@/lib/store';
import COUNTRIES from '@/data/countries';
import { getUSDValues, fmtUSD, COUNTRY_COLORS } from '@/lib/utils';
import { exportIntegratedExcel } from '@/lib/excel';
import Link from 'next/link';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ReferenceLine,
  ScatterChart, Scatter, ZAxis,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const CAPEX_USD = 28_000_000;
const ANNUAL_UNITS = 1200;
const KOREA_COST = 18500;
const LOCAL_PORTION = 0.85;

function payback(cost: number) {
  const saving = (KOREA_COST - cost) * ANNUAL_UNITS;
  return saving <= 0 ? 99 : Math.round((CAPEX_USD / saving) * 10) / 10;
}

// ─────────────────────────────────────────────────────────────
// Scoring (1-5, higher = more competitive)
// ─────────────────────────────────────────────────────────────
function scoreAll(allU: ReturnType<typeof getUSDValues>[]) {
  function rank5(arr: number[], v: number, lowGood: boolean): number {
    const sorted = [...arr].sort((a, b) => lowGood ? a - b : b - a);
    const r = sorted.indexOf(v);
    return 5 - Math.round((r / (arr.length - 1)) * 4);
  }
  const laborArr  = allU.map(u => u.actualMfgHourlyUSD);
  const energyArr = allU.map(u => u.electricityUSD + u.gasUSD * 0.05);
  const landArr   = allU.map(u => u.leaseLandUSD + u.constructionUSD * 0.5);
  const supplyArr = allU.map(u => u.steelUSDPerTon);
  const riskMap: Record<string,number> = { KR:2, MX:3, VN:4, TH:4, ID:3 };
  return COUNTRIES.map((c, i) => ({
    code: c.code,
    labor:  rank5(laborArr, allU[i].actualMfgHourlyUSD, true),
    energy: rank5(energyArr, energyArr[i], true),
    land:   rank5(landArr, landArr[i], true),
    supply: rank5(supplyArr, allU[i].steelUSDPerTon, true),
    risk:   riskMap[c.code] ?? 3,
    weighted: Math.round(
      (rank5(laborArr, allU[i].actualMfgHourlyUSD, true) * 0.30 +
       rank5(energyArr, energyArr[i], true) * 0.15 +
       rank5(landArr, landArr[i], true) * 0.15 +
       rank5(supplyArr, allU[i].steelUSDPerTon, true) * 0.20 +
       (riskMap[c.code] ?? 3) * 0.20) * 20
    ),
  }));
}

// ─────────────────────────────────────────────────────────────
// Static risk data
// ─────────────────────────────────────────────────────────────
const RISKS = [
  { name: '노무 리스크',    prob: 4, impact: 4, level: 'high',   problem: '강성 노조 형성, 멕시코 최저임금 연 10%+ 인상',           mitigation: '온건 노조 지역(누에보레온) 선정, 로봇 용접 라인 사전 설계, 이익공유제 도입' },
  { name: '공급망 지연',    prob: 3, impact: 4, level: 'medium', problem: '유압·전장 부품 현지 조달 품질 미달, 수입 리드타임 12주+', mitigation: 'Phase 1 CKD(한국 부품 수입), Phase 2 현지 인증 협력사 개발 3년 로드맵' },
  { name: '인허가 지연',    prob: 4, impact: 3, level: 'medium', problem: '토지 사용권·환경평가(EIA) 지연 — 베트남/인도네시아 최대 36개월', mitigation: 'KOTRA KBC 채널 활용, 전문 로컬 컨설팅+EPC 컨소시엄 구성' },
  { name: '환율 변동성',    prob: 3, impact: 3, level: 'medium', problem: 'MXN/VND ±15% 변동 시 CAPEX 환산 $3-4M 차이',               mitigation: 'USD 계약 기준, 운전자금 Hedge (최대 12개월 선물)' },
  { name: '인프라 불안정',  prob: 2, impact: 3, level: 'low',    problem: '베트남/인도네시아 전력망 불안 — 연간 100-300hr 정전',     mitigation: '자가발전기 250kVA + UPS (CAPEX +$800K), 전용 수전 계약' },
  { name: '지정학 리스크',  prob: 2, impact: 4, level: 'low',    problem: '미-중 갈등 심화 시 관세 정책 변화 (USMCA 재협상)',         mitigation: 'RVC 75%+ 확보 설계, 베트남 백업 거점 옵션 유지' },
];

const ROADMAP = [
  { phase:'Phase 1', period:'2025 Q4–2026 Q2', title:'풋프린트 타당성 조사 완료', items:['5개국 원가 비교 분석 (본 보고)','종합 비교 매트릭스 완성','임원 보고 및 최적 후보지 2개국 압축'], status:'done' },
  { phase:'Phase 2', period:'2026 Q3',          title:'현지 실사 & 인센티브 협상', items:['압축 후보지 2개국 현장 실사 (2주)','현지 정부 인센티브 공식 협상 (KOTRA 지원)','부지 선정 및 기본 계약 조건 협의'], status:'next' },
  { phase:'Phase 3', period:'2026 Q4–2027 Q1',  title:'인허가 착수 & EPC 선정',    items:['환경영향평가(EIA) 제출','EPC 컨소시엄 입찰 및 계약','설비 발주 (장납기 아이템 선착수)'], status:'plan' },
  { phase:'Phase 4', period:'2027 Q1–Q3',        title:'건축 착공 & 설비 반입',     items:['공장 건축 착공 (예상 14~18개월)','한국 주요 설비 이설/구매','현지 인력 채용 및 교육 시작'], status:'plan' },
  { phase:'SOP',     period:'2028 Q2 (목표)',     title:'양산 개시 (Start of Production)', items:['초기 CKD 방식 1,000대/yr 생산','현지화 목표 60% 달성 (Year 3)','연간 OPEX 절감 효과 실현'], status:'target' },
];

// ─────────────────────────────────────────────────────────────
// Custom tooltip
// ─────────────────────────────────────────────────────────────
const darkTooltip = { background:'#1e293b', border:'1px solid #334155', borderRadius:8, fontSize:12 };

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
export default function ReportPage() {
  const [fxRates] = useAtom(fxRatesAtom);
  const allU  = COUNTRIES.map(c => getUSDValues(c, fxRates));
  const scores = scoreAll(allU);

  const candidates = COUNTRIES.slice(1).map((c, i) => ({ c, s: scores[i+1] }));
  const best = candidates.reduce((a, b) => a.s.weighted > b.s.weighted ? a : b);
  const bestU = allU[COUNTRIES.findIndex(c => c.code === best.c.code)];
  const opexSaving = Math.round((KOREA_COST - best.c.costSummary.estimatedManufacturingCostUSDPerUnit) * ANNUAL_UNITS);
  const pb = payback(best.c.costSummary.estimatedManufacturingCostUSDPerUnit);

  // ── Radar data (higher=better, all 0-100 scale) ──
  const radarData = [
    { subject:'노무비 경쟁력', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.code, scores[i].labor*20])) },
    { subject:'에너지 경쟁력', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.code, scores[i].energy*20])) },
    { subject:'대지비 경쟁력', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.code, scores[i].land*20])) },
    { subject:'공급망 성숙도', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.code, scores[i].supply*20])) },
    { subject:'사업환경 점수', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.code, scores[i].risk*20])) },
  ];

  // ── Cost comparison bar ──
  const costBarData = COUNTRIES.map((c,i) => ({
    name: c.cityKo,
    원가: c.costSummary.estimatedManufacturingCostUSDPerUnit,
    fill: COUNTRY_COLORS[c.code],
  }));

  // ── Cost breakdown (estimated components) ──
  const breakdownData = COUNTRIES.map((c,i) => {
    const u = allU[i];
    const labor  = Math.round(u.actualMfgHourlyUSD * 8 * 22 * 300 * 0.40 / ANNUAL_UNITS);
    const energy = Math.round(u.electricityUSD * 600000 * 0.15 / ANNUAL_UNITS);
    const land   = Math.round(u.leaseLandUSD * 20000 / 240 * 0.15 / ANNUAL_UNITS);
    const steel  = Math.round(u.steelUSDPerTon * 1.2 * 0.20);
    const other  = c.costSummary.estimatedManufacturingCostUSDPerUnit - labor - energy - land - steel;
    return { name: c.cityKo, 노무비:labor, 에너지:energy, 대지·건축:land, '자재(철강중심)':steel, 기타간접:Math.max(0,other) };
  });

  // ── FX sensitivity line chart ──
  const fxLineData = [
    { scenario:'현지화 +10%\n(강세)', mult: 1/1.1 },
    { scenario:'Base\n(현재)', mult: 1 },
    { scenario:'현지화 -10%\n(약세)', mult: 1/0.9 },
  ].map(({ scenario, mult }) => {
    const row: Record<string,number|string> = { scenario };
    COUNTRIES.slice(1).forEach(c => {
      const base = c.costSummary.estimatedManufacturingCostUSDPerUnit;
      row[c.cityKo] = Math.round(base * (1 - LOCAL_PORTION) + base * LOCAL_PORTION / mult);
    });
    return row;
  });

  // ── Score bar data ──
  const scoreBarData = [
    { criterion:'노무비 경쟁력 (30%)', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.cityKo, scores[i].labor*20])) },
    { criterion:'에너지 경쟁력 (15%)', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.cityKo, scores[i].energy*20])) },
    { criterion:'대지비 경쟁력 (15%)', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.cityKo, scores[i].land*20])) },
    { criterion:'공급망 성숙도 (20%)', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.cityKo, scores[i].supply*20])) },
    { criterion:'사업환경 점수 (20%)', ...Object.fromEntries(COUNTRIES.map((c,i) => [c.cityKo, scores[i].risk*20])) },
  ];

  const SECTION_NAV = [
    { id:'s0', label:'0. 요약' },
    { id:'s1', label:'1. 추진 배경' },
    { id:'s2', label:'2. 비교 매트릭스' },
    { id:'s3', label:'3. 원가 분석' },
    { id:'s4', label:'4. 공급망' },
    { id:'s5', label:'5. 경쟁사' },
    { id:'s6', label:'6. 리스크' },
    { id:'s7', label:'7. 로드맵' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto space-y-12 pb-16">

      {/* ── Sticky nav bar ── */}
      <div className="sticky top-0 z-20 bg-[#0d1117]/95 backdrop-blur border-b border-[#2d3748] py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {SECTION_NAV.map(s => (
            <a key={s.id} href={`#${s.id}`}
               className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#1a1f2e] text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              {s.label}
            </a>
          ))}
          <div className="ml-auto flex gap-2 shrink-0">
            <Link href="/report/sources"
              className="text-[11px] px-3 py-1.5 rounded-lg bg-blue-900/40 border border-blue-700/50 text-blue-300 hover:bg-blue-800/60 whitespace-nowrap">
              📚 출처·방법론
            </Link>
            <button onClick={() => exportIntegratedExcel(COUNTRIES, fxRates)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white whitespace-nowrap font-semibold">
              ⬇ 엑셀 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* ── Cover ── */}
      <div className="text-center py-8 border border-[#2d3748] rounded-2xl bg-gradient-to-br from-[#1a1f2e] to-[#0d1117]">
        <div className="text-4xl mb-3">🌏</div>
        <h1 className="text-2xl font-extrabold text-white mb-2">글로벌 풋프린트 타당성 조사</h1>
        <p className="text-slate-400 text-sm mb-1">임원 보고 프레임워크 — 지게차 제조 공장 해외 Greenfield 진출 전략</p>
        <p className="text-[11px] text-slate-600">기준일: {new Date().toLocaleDateString('ko-KR')} | FX: 상단 슬라이더 실시간 반영 | <Link href="/report/sources" className="text-blue-500 underline">데이터 출처·방법론 →</Link></p>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S0: Executive Summary                                 */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s0" title="0. Executive Summary" subtitle="핵심 권고안 및 의사결정 요청 사항">

        {/* Recommendation banner */}
        <div className="bg-gradient-to-r from-emerald-950/70 to-emerald-900/30 border border-emerald-600/50 rounded-xl p-5 mb-6">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">📌 핵심 권고안 (Recommendation)</div>
          <p className="text-white text-[13px] leading-relaxed">
            종합 원가 경쟁력 평가 결과,&nbsp;
            <span className="font-bold text-lg" style={{ color: COUNTRY_COLORS[best.c.code] }}>
              {best.c.flag} {best.c.nameKo} ({best.c.cityKo})
            </span>
            &nbsp;을 <strong className="text-emerald-300">최우선 협상 대상지</strong>로 권고합니다.
            노무비 지수 <strong className="text-emerald-300">{best.c.costSummary.laborCostIndexVsKorea}</strong>(한국=100),
            추정 제조원가 <strong className="text-emerald-300">{fmtUSD(best.c.costSummary.estimatedManufacturingCostUSDPerUnit)}/대</strong>,
            종합 평점 <strong className="text-emerald-300">{best.s.weighted}점</strong>/100점.
          </p>
        </div>

        {/* Two-column: Radar + KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Radar — competitive profile */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
            <h3 className="text-[12px] font-bold text-white mb-1">🕸️ 5개국 경쟁력 레이더</h3>
            <p className="text-[10px] text-slate-500 mb-3">점수 높을수록 경쟁력 우수 (노무비·에너지·대지 = 저비용, 공급망·사업환경 = 성숙도)</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:'#94a3b8', fontSize:11 }} />
                {COUNTRIES.map(c => (
                  <Radar key={c.code} name={`${c.flag} ${c.cityKo}`} dataKey={c.code}
                    stroke={COUNTRY_COLORS[c.code]} fill={COUNTRY_COLORS[c.code]} fillOpacity={0.12} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize:11, paddingTop:8 }} />
                <Tooltip contentStyle={darkTooltip} formatter={(v:unknown) => [`${v}점`, '']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost + Payback comparison */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
            <h3 className="text-[12px] font-bold text-white mb-1">💰 추정 제조원가/대 비교 (USD)</h3>
            <p className="text-[10px] text-slate-500 mb-3">한국 $18,500 대비 절감 효과 · Payback Period 5년 목표</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={costBarData} layout="vertical" margin={{ top:5, right:60, left:10, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fill:'#94a3b8', fontSize:10 }} domain={[0,20000]}
                  tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <YAxis dataKey="name" type="category" tick={{ fill:'#94a3b8', fontSize:11 }} width={55} />
                <Tooltip contentStyle={darkTooltip} formatter={(v:unknown) => [fmtUSD(Number(v)), '원가/대']} />
                <ReferenceLine x={18500} stroke="#ef4444" strokeDasharray="4 4" label={{ value:'KR 기준', fill:'#ef4444', fontSize:10 }} />
                <Bar dataKey="원가" radius={[0,4,4,0]}>
                  {costBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  <LabelList dataKey="원가" position="right" style={{ fill:'#94a3b8', fontSize:10 }}
                    formatter={(v:unknown) => fmtUSD(Number(v))} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Payback mini table */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {COUNTRIES.slice(1).map((c, i) => {
                const pb_v = payback(c.costSummary.estimatedManufacturingCostUSDPerUnit);
                return (
                  <div key={c.code} className="text-center">
                    <div className="text-[10px] text-slate-500">{c.flag} {c.cityKo}</div>
                    <div className={`text-[13px] font-bold ${pb_v <= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>{pb_v}년</div>
                    <div className="text-[9px] text-slate-600">Payback</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiBox icon="💼" label="총 투자 (CAPEX)" value={fmtUSD(CAPEX_USD)} sub="그린필드 기준" color="#3b82f6" />
          <KpiBox icon="📉" label="연간 OPEX 절감" value={fmtUSD(opexSaving)} sub={`vs 한국 (${best.c.flag})`} color="#10b981" />
          <KpiBox icon="⏱️" label="투자 회수 기간" value={`${pb}년`} sub={pb <= 5 ? '✅ 목표 5년 달성' : '⚠️ 목표 초과'} color={pb<=5?'#10b981':'#f59e0b'} />
          <KpiBox icon="🏆" label="최저 추정 원가/대" value={fmtUSD(best.c.costSummary.estimatedManufacturingCostUSDPerUnit)} sub={`${best.c.flag} ${best.c.cityKo}`} color={COUNTRY_COLORS[best.c.code]} />
        </div>

        {/* Decisions */}
        <div className="bg-[#1a1f2e] border border-blue-700/40 rounded-xl p-4">
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-3">📋 핵심 의사결정 요청</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { num:'①', title:'Phase 2 승인', desc:`${best.c.nameKo}·2순위 후보국 현지 실사 예산 집행 (예산: ~₩1.5억)` },
              { num:'②', title:'인센티브 협상 착수', desc:'KOTRA 연계 현지 정부 법인세 감면·토지 우선 배정 확보' },
              { num:'③', title:'EPC RFI 발송', desc:'국내 EPC 3~4개사 그린필드 사전 타당성 RFI (D+14일)' },
            ].map(d => (
              <div key={d.num} className="bg-blue-950/40 border border-blue-800/30 rounded-lg p-3">
                <div className="text-blue-400 font-bold text-sm mb-1">{d.num} {d.title}</div>
                <div className="text-[11px] text-slate-300">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S1: 추진 배경                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s1" title="1. 추진 배경 및 전략적 방향성" subtitle="왜 지금 해외로 나가야 하는가">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon:'📈', title:'국내 임금 상승', stat:'연 3~5%', sub:'최저임금 10,030→10,320원 (2026)', color:'#ef4444' },
            { icon:'⏰', title:'52시간 규제', stat:'생산 탄력↓', sub:'야간·특근 불가 → 납기 리스크', color:'#f59e0b' },
            { icon:'👨‍🔧', title:'기능인력 부족', stat:'50대+ 평균', sub:'용접·도장공 신규 진입 극소', color:'#f97316' },
            { icon:'🌐', title:'시장 접근 관세', stat:'최대 5%', sub:'한국산 vs 멕시코산(USMCA 0%)', color:'#8b5cf6' },
          ].map(s => (
            <div key={s.title} className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-[10px] text-slate-500 mb-1">{s.title}</div>
              <div className="text-xl font-bold mb-1" style={{ color: s.color }}>{s.stat}</div>
              <div className="text-[10px] text-slate-400">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
          <div className="text-[11px] font-bold text-slate-300 mb-2">📦 스터디 범위 — 지게차 그린필드 공장 특수 요건</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k:'연간 생산 목표', v:'1,200대/yr → 2,000대 증산' },
              { k:'철강 소요량', v:'HRC SS400 1.2~1.5 ton/대' },
              { k:'핵심 인력', v:'CO₂/MIG 용접 + 에폭시 도장' },
              { k:'중량물 처리', v:'카운터웨이트 2~5 ton 일상 이동' },
            ].map(r => (
              <div key={r.k} className="bg-[#0f172a] rounded-lg p-3">
                <div className="text-[10px] text-slate-500">{r.k}</div>
                <div className="text-[12px] font-semibold text-white mt-1">{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S2: 종합 비교 매트릭스                                */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s2" title="2. 종합 비교 매트릭스" subtitle="5개국 정량·정성 가중 평점 (노무30%·에너지15%·대지15%·공급망20%·리스크20%)">

        {/* Score bars */}
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5 mb-5">
          <h3 className="text-[12px] font-bold text-white mb-3">📊 평가 항목별 점수 비교 (100점 만점)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreBarData} layout="vertical" margin={{ top:5, right:20, left:145, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" domain={[0,100]} tick={{ fill:'#94a3b8', fontSize:10 }} />
              <YAxis dataKey="criterion" type="category" tick={{ fill:'#94a3b8', fontSize:10 }} width={140} />
              <Tooltip contentStyle={darkTooltip} formatter={(v:unknown,name:unknown) => [`${v}점`, String(name)]} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              {COUNTRIES.map(c => (
                <Bar key={c.code} dataKey={c.cityKo} fill={COUNTRY_COLORS[c.code]} radius={[0,3,3,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Final weighted scores - visual ranking */}
        <div className="grid grid-cols-5 gap-3">
          {scores.map((s, i) => {
            const c = COUNTRIES[i];
            const rank = [...scores].filter(x => x.weighted > s.weighted).length + 1;
            const isWinner = rank === 2; // rank 1 is Korea baseline (ref), so actual winner is rank 2
            const isBest = s.weighted === Math.max(...scores.slice(1).map(x => x.weighted)) && i > 0;
            return (
              <div key={c.code} className={`bg-[#1a1f2e] border rounded-xl p-4 text-center relative
                ${isBest ? 'border-emerald-500/60 ring-2 ring-emerald-900' : 'border-[#2d3748]'}`}>
                {isBest && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">1위</div>}
                <div className="text-2xl mb-1">{c.flag}</div>
                <div className="text-[11px] font-bold text-white">{c.cityKo}</div>
                <div className="text-3xl font-extrabold mt-2" style={{ color: COUNTRY_COLORS[c.code] }}>{s.weighted}</div>
                <div className="text-[9px] text-slate-500">/100점</div>
                {/* mini bar */}
                <div className="mt-2 bg-[#0f172a] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width:`${s.weighted}%`, backgroundColor: COUNTRY_COLORS[c.code] }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-600 mt-2">※ 한국은 기준 참조값 포함. 가중 평점 산출 방식은 <Link href="/report/sources" className="text-blue-500 underline">출처·방법론 페이지</Link> 참조.</p>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S3: 세부 원가 분석                                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s3" title="3. 세부 원가 비교 분석" subtitle="지게차 1대당 추정 원가 구성 · 환율 민감도">

        {/* Cost breakdown stacked bar */}
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5 mb-5">
          <h3 className="text-[12px] font-bold text-white mb-1">3.1 원가 구성 분해 (USD/대, 추정)</h3>
          <p className="text-[10px] text-slate-500 mb-3">노무 40% · 에너지 15% · 대지건축 15% · 자재(철강) 20% · 기타 10% — McKinsey/BCG Operations 표준 가중치</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breakdownData} margin={{ top:5, right:20, left:10, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill:'#94a3b8', fontSize:11 }} />
              <YAxis tick={{ fill:'#94a3b8', fontSize:10 }} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={darkTooltip} formatter={(v:unknown,n:unknown) => [fmtUSD(Number(v)), String(n)]} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Bar dataKey="노무비"           stackId="a" fill="#3b82f6" />
              <Bar dataKey="에너지"           stackId="a" fill="#8b5cf6" />
              <Bar dataKey="대지·건축"        stackId="a" fill="#10b981" />
              <Bar dataKey="자재(철강중심)"   stackId="a" fill="#f59e0b" />
              <Bar dataKey="기타간접"         stackId="a" fill="#64748b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-slate-600 mt-2">※ 실제 원가는 생산량·자동화 수준·MvB 비율에 따라 ±20~30% 편차 가능. 상세 산출 근거: <Link href="/report/sources#methodology" className="text-blue-500 underline">방법론 →</Link></p>
        </div>

        {/* FX Sensitivity line chart */}
        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-5">
          <h3 className="text-[12px] font-bold text-white mb-1">3.2 환율 민감도 분석 — 추정 제조원가/대 (USD)</h3>
          <p className="text-[10px] text-slate-500 mb-3">FX 슬라이더 연동 · 현지화폐 ±10% 변동 시 원가 영향 (현지 비용 85% 구성비 가정)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={fxLineData} margin={{ top:5, right:20, left:10, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="scenario" tick={{ fill:'#94a3b8', fontSize:10 }} />
              <YAxis tick={{ fill:'#94a3b8', fontSize:10 }} tickFormatter={v=>`$${(v/1000).toFixed(1)}K`}
                domain={['auto','auto']} />
              <Tooltip contentStyle={darkTooltip} formatter={(v:unknown,n:unknown) => [fmtUSD(Number(v)), String(n)]} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              {COUNTRIES.slice(1).map(c => (
                <Line key={c.code} type="monotone" dataKey={c.cityKo}
                  stroke={COUNTRY_COLORS[c.code]} strokeWidth={2} dot={{ r:4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {COUNTRIES.slice(1).map((c,ci) => {
              const base = c.costSummary.estimatedManufacturingCostUSDPerUnit;
              const up   = Math.round(base*(1-LOCAL_PORTION)+base*LOCAL_PORTION/( 1/1.1));
              const down = Math.round(base*(1-LOCAL_PORTION)+base*LOCAL_PORTION/(1/0.9));
              return (
                <div key={c.code} className="bg-[#0f172a] rounded-lg p-2 text-center">
                  <div className="text-[10px] font-bold mb-1" style={{color:COUNTRY_COLORS[c.code]}}>{c.flag} {c.cityKo}</div>
                  <div className="text-[10px] text-red-400">↑ +10%강세: {fmtUSD(up)}</div>
                  <div className="text-[10px] text-white">Base: {fmtUSD(base)}</div>
                  <div className="text-[10px] text-emerald-400">↓ -10%약세: {fmtUSD(down)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S4: 공급망                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s4" title="4. 핵심 공급망 및 운영 환경" subtitle="철강 조달성 · 물류 인프라 · 전력 안정성">
        {/* Steel price bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
            <h3 className="text-[12px] font-bold text-white mb-3">🔩 HRC SS400 현지 조달 단가 (USD/ton)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={COUNTRIES.map((c,i) => ({ name:c.cityKo, price:Math.round(allU[i].steelUSDPerTon), fill:COUNTRY_COLORS[c.code] }))}
                layout="vertical" margin={{top:5,right:50,left:10,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{fill:'#94a3b8',fontSize:10}} unit="$" />
                <YAxis dataKey="name" type="category" tick={{fill:'#94a3b8',fontSize:11}} width={55} />
                <Tooltip contentStyle={darkTooltip} formatter={(v:unknown)=>[`$${v}/ton`,'']} />
                <Bar dataKey="price" radius={[0,4,4,0]}>
                  {COUNTRIES.map((c,i)=><Cell key={i} fill={COUNTRY_COLORS[c.code]}/>)}
                  <LabelList dataKey="price" position="right" style={{fill:'#94a3b8',fontSize:10}} formatter={(v:unknown)=>`$${v}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[9px] text-slate-600 mt-1">출처: Stavian Metal HRC SS400 가격 데이터 · 현지 제철소 공시 — <Link href="/report/sources#steel" className="text-blue-500 underline">상세 →</Link></p>
          </div>

          {/* Infrastructure grid */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
            <h3 className="text-[12px] font-bold text-white mb-3">⚡ 인프라 안정성 & 물류 비교</h3>
            <div className="space-y-2">
              {[
                { label:'전력 안정성', values: COUNTRIES.map(c => c.infrastructure.electricity.supplyStability) },
                { label:'연간 정전(hr)', values: COUNTRIES.map(c => String(c.infrastructure.electricity.powerOutageHoursPerYear)) },
                { label:'항만 안정성(/10)', values: COUNTRIES.map(c => String(c.port.stabilityScore)) },
                { label:'항만까지(km)', values: COUNTRIES.map(c => String(c.port.distanceKm)) },
                { label:'WB 사업환경순위', values: COUNTRIES.map(c => `#${c.permits.worldBankEaseRank2024}`) },
              ].map(row => (
                <div key={row.label} className="grid grid-cols-6 gap-1 text-[10px]">
                  <span className="text-slate-500 col-span-1">{row.label}</span>
                  {row.values.map((v,i) => {
                    const isGood = (row.label.includes('안정성') && (v==='excellent'||v==='good')) ||
                                   (row.label.includes('정전') && Number(v)<50) ||
                                   (row.label.includes('순위') && Number(v.replace('#',''))<30);
                    return (
                      <span key={i} className={`col-span-1 font-mono text-center px-1 py-0.5 rounded text-[10px]
                        ${v==='excellent'?'bg-emerald-900/50 text-emerald-300':
                          v==='good'?'bg-blue-900/40 text-blue-300':
                          v==='fair'?'bg-amber-900/40 text-amber-300':
                          'text-slate-300'}`}>
                        {v==='excellent'?'✅':v==='good'?'🔵':v==='fair'?'🟡':''} {v}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-600 mt-3">출처: 각국 항만청·전력공사 공시자료 — <Link href="/report/sources#infra" className="text-blue-500 underline">상세 →</Link></p>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S5: 경쟁사                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s5" title="5. 경쟁사 동향 및 벤치마킹" subtitle="글로벌 지게차 OEM 해외 생산 거점 · Make vs Buy 전략">
        <div className="overflow-x-auto rounded-xl border border-[#2d3748]">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#0f172a]">
                {['OEM', '본사', '후보국 내 거점', '연간 Capa', 'Make vs Buy', '자동화', '시사점'].map(h=>
                  <th key={h} className="text-left p-3 text-slate-400 font-semibold">{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {[
                { oem:'Toyota Industries (TBM)', hq:'일본', site:'태국 게이트웨이(EEC)', capa:'40만대(합산)', mvb:'프레임 자작 70%+', auto:'로봇용접 90%+', note:'선점 완료 — 우리의 비교 기준' },
                { oem:'KION Group (Linde)',       hq:'독일', site:'체코·중국·인도',       capa:'22만대/yr',     mvb:'프레임 외주 40%', auto:'협동로봇 60%', note:'아세안 미진출 → 기회' },
                { oem:'Hangcha Group',            hq:'중국', site:'베트남 하이퐁(2022)',  capa:'3만대/yr(VN)',  mvb:'프레임 현지화 60%', auto:'MIG 반자동', note:'베트남 선점 중 → 조기 진입 압박' },
                { oem:'Heli (安徽合力)',           hq:'중국', site:'인도네시아(계획)',     capa:'2만대/yr(계획)',mvb:'CKD→단계적 현지화', auto:'수동 초기', note:'인도네시아 선점 전 진입 가능' },
                { oem:'Clark Equipment (Doosan)', hq:'한/미', site:'한국 창원·베트남',    capa:'5만대/yr',      mvb:'프레임 완전 내작', auto:'로봇 60%', note:'국내 경쟁사 — 해외 전략 벤치마크' },
              ].map((r,i)=>(
                <tr key={i} className={i%2===0?'bg-[#1a1f2e]':'bg-[#141929]'}>
                  <td className="p-3 font-bold text-white">{r.oem}</td>
                  <td className="p-3 text-slate-400">{r.hq}</td>
                  <td className="p-3 text-slate-300">{r.site}</td>
                  <td className="p-3 font-mono text-slate-200">{r.capa}</td>
                  <td className="p-3 text-slate-300">{r.mvb}</td>
                  <td className="p-3 text-slate-300">{r.auto}</td>
                  <td className="p-3 text-amber-300 text-[10px]">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon:'🤖', stat:'60~90%', label:'선진 OEM 로봇 용접 도입률', sub:'인력 리스크 차단 핵심' },
            { icon:'🏭', stat:'60~75%', label:'프레임 내작(Make) 비율', sub:'원가 통제력의 핵심' },
            { icon:'📦', stat:'CKD→3년', label:'현지화 전환 패턴', sub:'초기 수입→단계적 전환 공통' },
            { icon:'🇻🇳🇮🇩', stat:'2022~', label:'아세안 신규 진입 러시', sub:'선점 압박 → 조기 의사결정 필요' },
          ].map(s => (
            <div key={s.label} className="bg-[#1a1f2e] border border-amber-800/30 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-amber-300">{s.stat}</div>
              <div className="text-[10px] text-slate-300 font-semibold">{s.label}</div>
              <div className="text-[10px] text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S6: 리스크                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s6" title="6. 추진 리스크 및 대응 방안" subtitle="리스크 매트릭스 (확률 × 영향도) · Plan B">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Risk scatter matrix */}
          <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
            <h3 className="text-[12px] font-bold text-white mb-1">📍 리스크 매트릭스 (확률 × 영향도)</h3>
            <p className="text-[10px] text-slate-500 mb-2">우상단(고확률·고영향) = 즉각 대응 필요</p>
            <div className="relative h-[220px] bg-[#0f172a] rounded-lg border border-[#1e293b] overflow-hidden">
              {/* Quadrant labels */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                <div className="border-b border-r border-[#1e293b]/80 flex items-center justify-center text-[9px] text-slate-700">저확률·고영향</div>
                <div className="border-b border-[#1e293b]/80 bg-red-950/20 flex items-center justify-center text-[9px] text-red-800">고확률·고영향 ⚠️</div>
                <div className="border-r border-[#1e293b]/80 flex items-center justify-center text-[9px] text-slate-700">저확률·저영향</div>
                <div className="bg-amber-950/10 flex items-center justify-center text-[9px] text-amber-900">고확률·저영향</div>
              </div>
              {/* Axis labels */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-slate-600">← 낮음    확률    높음 →</div>
              <div className="absolute top-1/2 left-1 -translate-y-1/2 -rotate-90 text-[9px] text-slate-600 whitespace-nowrap">영향도</div>
              {/* Risk dots */}
              {RISKS.map((r, i) => {
                const x = ((r.prob - 1) / 4) * 78 + 11; // 1-5 → 11-89%
                const y = 100 - ((r.impact - 1) / 4) * 78 - 11;
                const col = r.level === 'high' ? '#ef4444' : r.level === 'medium' ? '#f59e0b' : '#10b981';
                return (
                  <div key={i} className="absolute flex flex-col items-center" style={{ left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2"
                      style={{ backgroundColor: col + '33', borderColor: col }}>
                      {i+1}
                    </div>
                    <div className="text-[8px] text-slate-400 whitespace-nowrap mt-0.5">{r.name.replace(' 리스크','').replace(' 변동성','').replace(' 지연','')}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2">
            {RISKS.map((r,i) => (
              <div key={i} className="bg-[#1a1f2e] border border-[#2d3748] rounded-lg p-2.5 grid grid-cols-[24px_1fr_1fr] gap-2 items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0
                  ${r.level==='high'?'bg-red-800/60 border border-red-600':r.level==='medium'?'bg-amber-800/60 border border-amber-600':'bg-emerald-800/60 border border-emerald-600'}`}>
                  {i+1}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white">{r.name}</div>
                  <div className="text-[9px] text-slate-400">{r.problem}</div>
                </div>
                <div>
                  <div className="text-[9px] text-emerald-400 font-semibold">Plan B</div>
                  <div className="text-[9px] text-slate-300">{r.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* S7: 로드맵                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="s7" title="7. 향후 일정 및 의사결정 이정표" subtitle="Phase-Gate 타임라인 (SOP 목표: 2028 Q2)">
        <div className="space-y-3">
          {ROADMAP.map((p, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2
                  ${p.status==='done'?'bg-emerald-800 border-emerald-500 text-emerald-200':
                    p.status==='next'?'bg-blue-800 border-blue-500 text-blue-200 ring-4 ring-blue-900/50':
                    p.status==='target'?'bg-amber-800 border-amber-500 text-amber-200':
                    'bg-[#1a1f2e] border-[#2d3748] text-slate-400'}`}>
                  {p.status==='done'?'✓':i+1}
                </div>
                {i<ROADMAP.length-1 && <div className="w-0.5 flex-1 bg-[#2d3748] my-1" />}
              </div>
              <div className={`flex-1 border rounded-xl p-4 mb-1
                ${p.status==='done'?'bg-emerald-950/20 border-emerald-800/40':
                  p.status==='next'?'bg-blue-950/30 border-blue-700/50':
                  p.status==='target'?'bg-amber-950/20 border-amber-800/40':
                  'bg-[#1a1f2e] border-[#2d3748]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded
                      ${p.status==='done'?'bg-emerald-900 text-emerald-300':
                        p.status==='next'?'bg-blue-900 text-blue-300':
                        p.status==='target'?'bg-amber-900 text-amber-300':
                        'bg-[#0f172a] text-slate-400'}`}>{p.phase}</span>
                    <span className="text-sm font-bold text-white">{p.title}</span>
                    {p.status==='next' && <span className="text-[10px] bg-blue-800 text-blue-200 px-2 py-0.5 rounded-full">▶ 다음 단계</span>}
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">{p.period}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.items.map((item,j) => (
                    <span key={j} className="text-[11px] text-slate-300 flex items-center gap-1">
                      <span className={p.status==='done'?'text-emerald-400':p.status==='next'?'text-blue-400':'text-slate-500'}>▸</span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-blue-950/30 border border-blue-800/40 rounded-xl p-4">
          <div className="text-[11px] font-bold text-blue-400 mb-3">⚡ Phase 2 승인 즉시 실행 가능 액션 (D+7/D+14)</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { d:'D+7',  title:'KOTRA KBC 협의 공문 발송', desc:`${best.c.nameKo} KBC에 인센티브 협의 공식 요청` },
              { d:'D+14', title:'현지 법인 구조 법무 검토', desc:'100% 외투 vs JV 법인 설립 방식 법무법인 착수' },
              { d:'D+14', title:'EPC 3~4개사 RFI 발송',    desc:'그린필드 사전 타당성 Request for Information' },
            ].map(a => (
              <div key={a.title} className="bg-[#1a1f2e] rounded-lg p-3">
                <span className="text-[10px] bg-blue-800 text-blue-200 px-2 py-0.5 rounded font-bold mr-2">{a.d}</span>
                <span className="text-[11px] font-semibold text-white">{a.title}</span>
                <p className="text-[10px] text-slate-400 mt-1">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="text-center py-4 text-[10px] text-slate-600 border-t border-[#2d3748]">
        본 보고서는 공개 데이터 기반 추정치입니다. 실제 투자 결정 전 현지 실사 및 전문가 자문을 통해 검증하시기 바랍니다. |&nbsp;
        <Link href="/report/sources" className="text-blue-500 underline">데이터 출처 및 방법론 전체 보기</Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────
function Section({ id, title, subtitle, children }: { id:string; title:string; subtitle:string; children:React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-4 border-b border-[#2d3748] pb-2">
        <h2 className="text-base font-extrabold text-white">{title}</h2>
        <span className="text-[11px] text-slate-500">{subtitle}</span>
      </div>
      {children}
    </section>
  );
}

function KpiBox({ icon, label, value, sub, color }: { icon:string; label:string; value:string; sub:string; color:string }) {
  return (
    <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-[10px] text-slate-500">{label}</span>
      </div>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-slate-600 mt-0.5">{sub}</div>
    </div>
  );
}
