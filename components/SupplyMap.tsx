'use client';
import { useEffect, useRef } from 'react';
import type { CountryData } from '@/data/countries';
import { COUNTRY_COLORS } from '@/lib/utils';

interface Props {
  country: CountryData;
  showCompetitors?: boolean;
}

// Steel producer coords by country (approximations)
const STEEL_COORDS: Record<string, Array<{ name: string; url: string; lat: number; lng: number; capacity?: string }>> = {
  KR: [
    { name: 'POSCO Pohang', url: 'https://www.posco.co.kr', lat: 36.03, lng: 129.37, capacity: '20M ton/yr' },
    { name: 'POSCO Gwangyang', url: 'https://www.posco.co.kr', lat: 34.93, lng: 127.67, capacity: '18M ton/yr' },
    { name: 'Hyundai Steel Incheon', url: 'https://www.hyundai-steel.com', lat: 37.44, lng: 126.66, capacity: 'Flat steel' },
    { name: 'Dongkuk Incheon', url: 'https://www.dongkuk.com', lat: 37.48, lng: 126.62, capacity: 'Section/bar' },
  ],
  MX: [
    { name: 'TERNIUM Pesquería', url: 'https://www.ternium.com/mx', lat: 25.79, lng: -100.06, capacity: '4M ton/yr' },
    { name: 'AHMSA Monclova', url: 'https://www.ahmsa.com', lat: 26.91, lng: -101.42, capacity: '5M ton/yr' },
    { name: 'DEACERO MTY', url: 'https://www.deacero.com', lat: 25.66, lng: -100.28, capacity: '1.5M ton' },
  ],
  VN: [
    { name: 'Hoa Phat Dung Quat', url: 'https://www.hoaphat.com.vn/en', lat: 15.35, lng: 108.78, capacity: '5.6M ton/yr' },
    { name: 'Formosa Ha Tinh', url: 'https://www.fhs.com.vn', lat: 18.2, lng: 106.1, capacity: '7.5M ton HRC' },
    { name: 'VNSteel HCMC', url: 'https://www.vnsteel.vn', lat: 10.76, lng: 106.68, capacity: 'Distribution' },
  ],
  TH: [
    { name: 'G Steel Rayong', url: 'https://www.g-steel.com', lat: 12.87, lng: 101.18, capacity: '2M ton HRC' },
    { name: 'SSI Prachuap', url: 'https://www.ssi-steel.com', lat: 11.79, lng: 99.79, capacity: '4M ton HRC' },
    { name: 'NS BlueScope Rayong', url: 'https://www.nsbluescope.com/th', lat: 12.72, lng: 101.35, capacity: 'Coated steel' },
  ],
  ID: [
    { name: 'Krakatau POSCO Cilegon', url: 'https://www.krakatauposco.co.id', lat: -5.98, lng: 106.02, capacity: '3M ton HRC' },
    { name: 'Krakatau Steel Cilegon', url: 'https://www.krakatausteel.com', lat: -5.99, lng: 106.0, capacity: '3M ton' },
    { name: 'GRP Bekasi', url: 'https://www.gunungrajapaksi.com', lat: -6.24, lng: 107.0, capacity: '3M ton HRC' },
  ],
};

// Part cluster coords by country
const CLUSTER_COORDS: Record<string, Array<{ name: string; lat: number; lng: number; type: string }>> = {
  KR: [
    { name: '남동산업단지 (인천)', lat: 37.45, lng: 126.73, type: '제관·전장·완성차' },
    { name: '창원 기계 클러스터', lat: 35.23, lng: 128.68, type: '중장비·제관' },
    { name: '반월·시흥 공단', lat: 37.35, lng: 126.78, type: '금속·기계부품' },
    { name: '아산·천안 (충남)', lat: 36.79, lng: 127.0, type: '전장·자동차' },
  ],
  MX: [
    { name: 'Apodaca 산업지구', lat: 25.78, lng: -100.19, type: '자동차·제관' },
    { name: 'Santa Catarina 산업', lat: 25.67, lng: -100.45, type: '제조·물류' },
    { name: 'General Escobedo', lat: 25.80, lng: -100.32, type: '전장·금속' },
  ],
  VN: [
    { name: 'VSIP Binh Duong', lat: 11.05, lng: 106.65, type: '복합 산업단지' },
    { name: 'Becamex 빈즈엉', lat: 11.10, lng: 106.68, type: '제조·물류' },
    { name: 'Dong Nai IZ', lat: 10.95, lng: 106.83, type: '자동차 부품' },
    { name: 'HCMC District 9', lat: 10.85, lng: 106.78, type: '전장·정밀' },
  ],
  TH: [
    { name: 'Amata City Chonburi', lat: 13.37, lng: 101.0, type: '자동차·완성차' },
    { name: 'WHA Eastern Seaboard', lat: 12.85, lng: 101.3, type: '중공업·석화' },
    { name: 'Hemaraj Rayong', lat: 12.72, lng: 101.22, type: '자동차 부품' },
    { name: 'WHA Rayong 2', lat: 12.68, lng: 101.35, type: '전장·유압' },
  ],
  ID: [
    { name: 'KIIC Karawang', lat: -6.32, lng: 107.3, type: '자동차·중공업' },
    { name: 'JABABEKA Cikarang', lat: -6.32, lng: 107.15, type: '자동차 Tier1/2' },
    { name: 'MM2100 Bekasi', lat: -6.31, lng: 107.08, type: '자동차·전기' },
    { name: 'Bekasi Fajar', lat: -6.28, lng: 107.0, type: '제조 복합' },
  ],
};

export default function SupplyMap({ country, showCompetitors = false }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return;
    if (mapInstance.current) return;

    const L = (window as { L?: unknown }).L;
    if (!L) {
      // Retry after Leaflet loads
      const timer = setTimeout(() => {
        const L2 = (window as { L?: unknown }).L;
        if (L2) initMap(L2);
      }, 500);
      return () => clearTimeout(timer);
    }
    initMap(L);

    function initMap(L: unknown) {
      const Lmap = L as {
        map: (el: HTMLElement, opts: unknown) => {
          setView: (coords: [number, number], zoom: number) => { setView: (...args: unknown[]) => unknown };
        };
        tileLayer: (url: string, opts: unknown) => { addTo: (m: unknown) => void };
        circleMarker: (coords: [number, number], opts: unknown) => {
          addTo: (m: unknown) => { bindPopup: (html: string) => void };
        };
      };

      if (!mapRef.current) return;
      const map = Lmap.map(mapRef.current, {
        center: [country.coordinates.lat, country.coordinates.lng],
        zoom: 7,
        zoomControl: true,
      }).setView([country.coordinates.lat, country.coordinates.lng], 7);

      mapInstance.current = map;

      Lmap.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 14,
      }).addTo(map);

      // City marker
      Lmap.circleMarker([country.coordinates.lat, country.coordinates.lng] as [number, number], {
        radius: 14, fillColor: COUNTRY_COLORS[country.code], color: '#fff',
        weight: 2, fillOpacity: 0.9,
      }).addTo(map).bindPopup(
        `<div style="font-size:13px;font-weight:bold;color:#1e293b">🏭 ${country.cityKo}</div>
         <div style="font-size:11px;color:#475569">${country.industrialZone}</div>`
      );

      // Steel producers
      const steelSites = STEEL_COORDS[country.code] ?? [];
      steelSites.forEach((s) => {
        Lmap.circleMarker([s.lat, s.lng] as [number, number], {
          radius: 9, fillColor: '#f97316', color: '#fff',
          weight: 1.5, fillOpacity: 0.85,
        }).addTo(map).bindPopup(
          `<div style="font-size:12px;font-weight:bold;color:#1e293b">
             🔩 <a href="${s.url}" target="_blank" style="color:#2563eb">${s.name}</a>
           </div>
           <div style="font-size:11px;color:#475569">${s.capacity ?? ''}</div>`
        );
      });

      // Supply clusters
      const clusters = CLUSTER_COORDS[country.code] ?? [];
      clusters.forEach((c) => {
        Lmap.circleMarker([c.lat, c.lng] as [number, number], {
          radius: 7, fillColor: '#8b5cf6', color: '#fff',
          weight: 1.5, fillOpacity: 0.8,
        }).addTo(map).bindPopup(
          `<div style="font-size:12px;font-weight:bold;color:#1e293b">⚙️ ${c.name}</div>
           <div style="font-size:11px;color:#475569">${c.type}</div>`
        );
      });

      // Competitors (if tab selected)
      if (showCompetitors) {
        country.competitors.forEach((comp) => {
          if (comp.capacity === 0) return;
          Lmap.circleMarker([comp.coordinates.lat, comp.coordinates.lng] as [number, number], {
            radius: 11, fillColor: '#ef4444', color: '#fff',
            weight: 2, fillOpacity: 0.9,
          }).addTo(map).bindPopup(
            `<div style="font-size:12px;font-weight:bold;color:#1e293b">
               🏭 <a href="${comp.url}" target="_blank" style="color:#2563eb">${comp.name}</a>
             </div>
             <div style="font-size:11px;color:#475569">설립: ${comp.established}년 | ${comp.capacity.toLocaleString()} ${comp.capacityUnit}</div>
             <div style="font-size:11px;color:#475569">${comp.automationDetails}</div>`
          );
        });
      }

      // Port marker
      const portCoords = getPortCoords(country.code);
      if (portCoords) {
        Lmap.circleMarker(portCoords as [number, number], {
          radius: 10, fillColor: '#06b6d4', color: '#fff',
          weight: 2, fillOpacity: 0.9,
        }).addTo(map).bindPopup(
          `<div style="font-size:12px;font-weight:bold;color:#1e293b">🚢 ${country.port.name}</div>
           <div style="font-size:11px;color:#475569">${country.port.annualTEU}</div>`
        );
      }
    }
  }, [country, showCompetitors]);

  return (
    <div className="space-y-3">
      <div ref={mapRef} style={{ height: 420, borderRadius: 12, overflow: 'hidden', border: '1px solid #2d3748' }} />
      <div className="flex flex-wrap gap-3 text-[11px]">
        <LegendItem color={COUNTRY_COLORS[country.code]} label="🏭 선정 공단 (제조 입지)" />
        <LegendItem color="#f97316" label="🔩 철강 생산 기지" />
        <LegendItem color="#8b5cf6" label="⚙️ 부품 공급 클러스터" />
        <LegendItem color="#06b6d4" label="🚢 주요 항만" />
        {showCompetitors && <LegendItem color="#ef4444" label="🏭 경쟁사 (OEM 공장)" />}
      </div>
      <p className="text-[10px] text-slate-600">
        지도 마커 클릭 시 상세 정보 및 공식 웹사이트 링크 확인 가능. 지도 데이터: OpenStreetMap contributors.
        좌표는 대략적 위치이며 실제 주소와 차이 있을 수 있습니다.
      </p>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
      <span className="text-slate-400">{label}</span>
    </div>
  );
}

function getPortCoords(code: string): [number, number] | null {
  const ports: Record<string, [number, number]> = {
    KR: [37.46, 126.61],    // Incheon Port
    MX: [22.94, -97.87],    // Altamira Port
    VN: [10.77, 106.77],    // Cat Lai / HCMC Port
    TH: [13.09, 100.88],    // Laem Chabang Port
    ID: [-6.1, 106.88],     // Tanjung Priok
  };
  return ports[code] ?? null;
}
