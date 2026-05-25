import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { FXPanel } from '@/components/FXPanel';
import { JotaiProvider } from '@/components/JotaiProvider';

export const metadata: Metadata = {
  title: '지게차 제조 글로벌 풋프린트 타당성 분석 | Forklift Manufacturing Greenfield Study',
  description: '5개국(한국·멕시코·베트남·태국·인도네시아) 지게차 제조업 그린필드 진출 제조원가 비교 분석 대시보드',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body className="min-h-screen">
        <JotaiProvider>
          <header className="bg-[#0d1117] border-b border-[#1e293b]">
            <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
              <div>
                <h1 className="text-[16px] font-bold text-white">
                  🏭 지게차 제조 글로벌 풋프린트 타당성 분석
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Forklift Manufacturing Greenfield Feasibility Study — KR · MX · VN · TH · ID | 기준: 2026년
                </p>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-[11px] text-slate-600">데이터 기준일: 2025 Q3–Q4 | 환율: 2026 제조업 컨센서스</div>
                <div className="text-[10px] text-slate-700">⚠️ 본 자료는 사전 타당성 참고 자료입니다</div>
              </div>
            </div>
          </header>
          <FXPanel />
          <Navigation />
          <main className="max-w-[1600px] mx-auto px-4 py-6">{children}</main>
          <footer className="mt-12 border-t border-[#1e293b] bg-[#0d1117]">
            <div className="max-w-[1600px] mx-auto px-4 py-4">
              <p className="text-[11px] text-slate-600 text-center">
                본 분석 자료는 공개 출처 기반으로 작성되었습니다. 출처: 각국 정부/기관 공식 자료, GlobalPetrolPrices.com, Vietnam Briefing, Tetakawi, BKPM, BOI Thailand 등.
                투자 결정 전 현지 법률·회계 전문가 자문을 권고합니다. | © 2026 Internal Use Only
              </p>
            </div>
          </footer>
        </JotaiProvider>
      </body>
    </html>
  );
}
