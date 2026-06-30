"use client";

import { useRef, useState, useEffect } from "react";

interface Kecamatan {
  kdkecamatan: string;
  nm_kecamatan: string;
}

interface Kelurahan {
  kdkecamatan: string;
  kdkelurahan: string;
  nm_kelurahan: string;
}

interface KecamatanSelectorProps {
  selectedDistrict: Kecamatan | null;
  selectedVillage: Kelurahan | null;
  onSelectDistrict: (district: Kecamatan | null) => void;
  onSelectVillage: (village: Kelurahan | null) => void;
}

export default function KecamatanSelector({
  selectedDistrict,
  selectedVillage,
  onSelectDistrict,
  onSelectVillage,
}: KecamatanSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kelurahanList, setKelurahanList] = useState<Kelurahan[]>([]);

  // Fetch Kecamatan
  useEffect(() => {
    fetch("/api/kecamatan")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setKecamatanList(data.data);
        }
      })
      .catch((err) => console.error("Failed to load kecamatan", err));
  }, []);

  // Fetch Kelurahan when District is selected
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`/api/kelurahan?kdkecamatan=${selectedDistrict.kdkecamatan}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setKelurahanList(data.data);
          }
        })
        .catch((err) => console.error("Failed to load kelurahan", err));
    } else {
      setKelurahanList([]);
    }
  }, [selectedDistrict]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }
  };

  useEffect(() => {
    updateScrollState();
  }, [kecamatanList]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  const handleDistrictClick = (district: Kecamatan) => {
    onSelectDistrict(district);
    onSelectVillage(null);
  };

  const handleBackToDistricts = () => {
    onSelectDistrict(null);
    onSelectVillage(null);
  };

  const handleVillageClick = (village: Kelurahan) => {
    if (selectedVillage?.kdkelurahan === village.kdkelurahan) {
      onSelectVillage(null);
    } else {
      onSelectVillage(village);
    }
  };

  return (
    <div className="absolute bottom-5 z-[998] pointer-events-none" style={{ left: "160px", right: "190px" }}>
      <div className="pointer-events-auto">
        {/* Mode: Desa list (kecamatan dipilih) */}
        {selectedDistrict ? (
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700 shadow-md px-3 py-2 max-h-36 overflow-y-auto">
            {/* Header: back + nama kecamatan */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleBackToDistricts}
                className="flex items-center gap-1 h-6 px-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0 text-xs font-medium"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Kembali
              </button>
              <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">
                {selectedDistrict.nm_kecamatan}
              </p>
            </div>
            {/* Chip desa/kelurahan */}
            <div className="flex flex-wrap gap-1">
              {kelurahanList.map((v) => (
                <button
                  key={v.kdkelurahan}
                  onClick={() => handleVillageClick(v)}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedVillage?.kdkelurahan === v.kdkelurahan
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 ring-1 ring-brand-500"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {v.nm_kelurahan}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Mode: Daftar kecamatan (horizontal scroll) — tanpa container */
          <div className="relative group">
            {/* Scroll kiri */}
            {canScrollLeft && (
              <button
                onClick={() => scrollBy("left")}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
            )}

            {/* Scroll kanan */}
            {canScrollRight && (
              <button
                onClick={() => scrollBy("right")}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {kecamatanList.map((district) => (
                <button
                  key={district.kdkecamatan}
                  onClick={() => handleDistrictClick(district)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap bg-white/90 dark:bg-gray-800/90 backdrop-blur text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  {district.nm_kecamatan}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
