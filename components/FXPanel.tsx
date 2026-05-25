'use client';
import { useAtom } from 'jotai';
import { fxRatesAtom } from '@/lib/store';
import { DEFAULT_FX_RATES } from '@/data/countries';

const CURRENCIES = [
  { code: 'KRW', label: '🇰🇷 KRW', name: '한국 원', min: 1000, max: 1800, step: 10 },
  { code: 'MXN', label: '🇲🇽 MXN', name: '멕시코 페소', min: 14, max: 28, step: 0.5 },
  { code: 'VND', label: '🇻🇳 VND', name: '베트남 동', min: 20000, max: 32000, step: 100 },
  { code: 'THB', label: '🇹🇭 THB', name: '태국 바트', min: 26, max: 44, step: 0.5 },
  { code: 'IDR', label: '🇮🇩 IDR', name: '인도네시아 루피아', min: 13000, max: 21000, step: 100 },
];

export function FXPanel() {
  const [rates, setRates] = useAtom(fxRatesAtom);

  const handleChange = (code: string, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setRates((prev) => ({ ...prev, [code]: num }));
    }
  };

  const reset = () => setRates({ ...DEFAULT_FX_RATES });
  const isDefault = JSON.stringify(rates) === JSON.stringify(DEFAULT_FX_RATES);

  return (
    <div className="bg-[#0d1117] border-b border-[#1e293b] px-4 py-3">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              ⚡ FX Sensitivity
            </span>
            <span className="text-[10px] text-slate-500">
              환율 조정 → 전체 USD 환산 자동 재계산
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap flex-1">
            {CURRENCIES.map((c) => {
              const cur = rates[c.code] ?? DEFAULT_FX_RATES[c.code];
              const def = DEFAULT_FX_RATES[c.code];
              const changed = Math.abs(cur - def) > 0.01;
              return (
                <div key={c.code} className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-mono">{c.label}</span>
                  <input
                    type="number"
                    value={cur}
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    onChange={(e) => handleChange(c.code, e.target.value)}
                    className={`w-20 bg-[#1a1f2e] border rounded px-2 py-0.5 text-[12px] font-mono text-center focus:outline-none focus:border-blue-500 ${
                      changed ? 'border-amber-500 text-amber-300' : 'border-[#2d3748] text-slate-200'
                    }`}
                  />
                  <span className="text-[10px] text-slate-600">/ USD</span>
                </div>
              );
            })}
          </div>

          {!isDefault && (
            <button
              onClick={reset}
              className="text-[11px] px-3 py-1 bg-[#1e293b] text-slate-400 rounded border border-[#334155] hover:text-slate-200 transition-colors shrink-0"
            >
              ↺ 기본값
            </button>
          )}

          <div className="text-[10px] text-slate-600 shrink-0">
            기준: 2026 제조업 컨센서스
          </div>
        </div>
      </div>
    </div>
  );
}
