"use client";

import { useMemo, useRef, useState, useEffect } from "react";

interface Village {
  village: string;
  village_code: string;
  district: string;
  district_code: string;
}

interface KecamatanSelectorProps {
  geoJsonFeatures: GeoJSON.Feature[];
  onSelectVillage: (feature: GeoJSON.Feature | null) => void;
  selectedDistrict: string | null;
  selectedVillage: string | null;
  onSelectDistrict: (district: string | null) => void;
  onSelectVillageName: (village: string | null) => void;
}

export default function KecamatanSelector({
  geoJsonFeatures,
  onSelectVillage,
  selectedDistrict,
  selectedVillage,
  onSelectDistrict,
  onSelectVillageName,
}: KecamatanSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  const { districts, villagesByDistrict } = useMemo(() => {
    const districtSet = new Set<string>();
    const map = new Map<string, Village[]>();

    geoJsonFeatures.forEach((f) => {
      const props = f.properties as Record<string, string>;
      const district = props.district || "";
      const village = props.village || "";
      const district_code = props.district_code || "";
      const village_code = props.village_code || "";

      districtSet.add(district);

      if (!map.has(district)) map.set(district, []);
      const list = map.get(district)!;
      if (!list.find((v) => v.village === village)) {
        list.push({ district, village, district_code, village_code });
      }
    });

    return {
      districts: [...districtSet].sort(),
      villagesByDistrict: map,
    };
  }, [geoJsonFeatures]);

  const handleDistrictClick = (district: string) => {
    onSelectDistrict(district);
    onSelectVillageName(null);
    onSelectVillage(null);
  };

  const handleBackToDistricts = () => {
    onSelectDistrict(null);
    onSelectVillageName(null);
    onSelectVillage(null);
  };

  const handleVillageClick = (villageName: string) => {
    if (selectedVillage === villageName) {
      onSelectVillage(null);
      onSelectVillageName(null);
    } else {
      onSelectVillageName(villageName);
      const feature = geoJsonFeatures.find(
        (f) => (f.properties as Record<string, string>).village === villageName
      );
      if (feature) onSelectVillage(feature);
    }
  };

  const selectedVillages = selectedDistrict
    ? villagesByDistrict.get(selectedDistrict) || []
    : [];

  return (
    <div className="absolute bottom-5 z-[998] pointer-events-none" style={{ left: "160px", right: "170px" }}>
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
                {selectedDistrict}
              </p>
            </div>
            {/* Chip desa/kelurahan */}
            <div className="flex flex-wrap gap-1">
              {selectedVillages.map((v) => (
                <button
                  key={v.village}
                  onClick={() => handleVillageClick(v.village)}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedVillage === v.village
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 ring-1 ring-brand-500"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {v.village}
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
              {districts.map((district) => (
                <button
                  key={district}
                  onClick={() => handleDistrictClick(district)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap bg-white/90 dark:bg-gray-800/90 backdrop-blur text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
