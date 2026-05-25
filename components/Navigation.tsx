'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '📊 종합비교', sublabel: 'Summary' },
  { href: '/country/kr', label: '🇰🇷 한국', sublabel: 'Incheon' },
  { href: '/country/mx', label: '🇲🇽 멕시코', sublabel: 'Monterrey' },
  { href: '/country/vn', label: '🇻🇳 베트남', sublabel: 'Binh Duong' },
  { href: '/country/th', label: '🇹🇭 태국', sublabel: 'Rayong/EEC' },
  { href: '/country/id', label: '🇮🇩 인도네시아', sublabel: 'Karawang' },
];

export function Navigation() {
  const path = usePathname();
  return (
    <nav className="bg-[#1a1f2e] border-b border-[#2d3748]">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {NAV_ITEMS.map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-4 py-2 rounded-lg min-w-max transition-all ${
                  active
                    ? 'bg-blue-900/60 border border-blue-600/50 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[13px] font-medium">{item.label}</span>
                <span className="text-[10px] text-slate-500">{item.sublabel}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
