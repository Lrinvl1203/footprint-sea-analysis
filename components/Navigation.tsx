'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { fxRatesAtom } from '@/lib/store';
import COUNTRIES from '@/data/countries';
import { exportIntegratedExcel } from '@/lib/excel';

const NAV_ITEMS = [
  { href: '/', label: '📊 종합비교', sublabel: 'Summary' },
  { href: '/country/kr', label: '🇰🇷 한국', sublabel: 'Incheon' },
  { href: '/country/mx', label: '🇲🇽 멕시코', sublabel: 'Monterrey' },
  { href: '/country/vn', label: '🇻🇳 베트남', sublabel: 'Binh Duong' },
  { href: '/country/th', label: '🇹🇭 태국', sublabel: 'Rayong/EEC' },
  { href: '/country/id', label: '🇮🇩 인도네시아', sublabel: 'Karawang' },
  { href: '/report', label: '📋 임원보고서', sublabel: 'Exec Report' },
  { href: '/deep-research', label: '🔬 딥리서치', sublabel: '6개국+인도' },
];

export function Navigation() {
  const path = usePathname();
  const [fxRates] = useAtom(fxRatesAtom);
  return (
    <nav className="bg-[#1a1f2e] border-b border-[#2d3748]">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {NAV_ITEMS.map((item) => {
            const active = path === item.href;
            const isReport = item.href === '/report';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-4 py-2 rounded-lg min-w-max transition-all ${
                  active
                    ? 'bg-blue-900/60 border border-blue-600/50 text-white'
                    : isReport
                    ? 'text-amber-300 border border-amber-800/50 bg-amber-950/30 hover:bg-amber-900/40'
                    : item.href === '/deep-research'
                    ? 'text-cyan-300 border border-cyan-800/50 bg-cyan-950/30 hover:bg-cyan-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[13px] font-medium">{item.label}</span>
                <span className="text-[10px] text-slate-500">{item.sublabel}</span>
              </Link>
            );
          })}
          {/* Global integrated Excel download */}
          <button
            onClick={() => exportIntegratedExcel(COUNTRIES, fxRates)}
            className="flex flex-col items-center px-3 py-2 rounded-lg min-w-max transition-all bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-800/60 ml-1"
            title="5개국 통합 엑셀 다운로드"
          >
            <span className="text-[13px] font-medium">⬇ 통합 엑셀</span>
            <span className="text-[10px] text-emerald-600">All Countries</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
