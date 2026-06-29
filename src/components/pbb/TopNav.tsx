"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import { GridIcon, MapPinIcon, PieChartIcon, TableIcon } from "@/icons";

const menuItems = [
  { name: "Dashboard", path: "/pbb", icon: <GridIcon className="size-5" /> },
  { name: "Peta PBB", path: "/pbb/peta-pbb", icon: <MapPinIcon className="size-5" /> },
  { name: "Daftar WP", path: "/pbb/daftar-wajib-pajak", icon: <TableIcon className="size-5" /> },
  { name: "Laporan", path: "/pbb/laporan", icon: <PieChartIcon className="size-5" /> },
];

interface Village {
  village: string;
  village_code: string;
  district: string;
  district_code: string;
}

export default function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [applicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [geojsonFeatures, setGeojsonFeatures] = useState<GeoJSON.Feature[]>([]);
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterVillage, setFilterVillage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd/Ctrl+K untuk fokus search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load geojson sekali
  useEffect(() => {
    import("@/data/geojson/batubara.json").then((data) => {
      const d = data.default as { features: GeoJSON.Feature[] };
      setGeojsonFeatures(d.features || []);
    });
  }, []);

  const { districts, villagesByDistrict } = useMemo(() => {
    const districtSet = new Set<string>();
    const map = new Map<string, Village[]>();

    geojsonFeatures.forEach((f) => {
      const props = f.properties as Record<string, string>;
      const district = props.district || "";
      const village = props.village || "";
      const district_code = props.district_code || "";
      const village_code = props.village_code || "";

      districtSet.add(district);
      if (!map.has(district)) map.set(district, []);
      const list = map.get(district)!;
      if (!list.find((v) => v.village_code === village_code)) {
        list.push({ district, village, district_code, village_code });
      }
    });

    return {
      districts: [...districtSet].sort(),
      villagesByDistrict: map,
    };
  }, [geojsonFeatures]);

  const filteredVillages = filterDistrict ? villagesByDistrict.get(filterDistrict) || [] : [];

  // Reset village when district changes
  const handleDistrictChange = (val: string) => {
    setFilterDistrict(val);
    if (!val) setFilterVillage("");
  };

  const isActive = (path: string) => {
    if (path === "/pbb") return pathname === "/pbb";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* Top Row: Brand + Menu + Actions */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Brand */}
          <Link href="/pbb" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo/lambang-batubara.png"
              alt="Logo Batubara"
              width={36}
              height={48}
              className="object-contain"
            />
            <span className="hidden sm:block text-xs font-semibold text-gray-800 dark:text-white/90 leading-tight">
              WEB GIS BAPENDA<br />KAB. BATUBARA
            </span>
          </Link>

          {/* Desktop Menu - centered */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-theme-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                }`}
              >
                <span className={isActive(item.path) ? "text-brand-500 dark:text-brand-400" : "text-gray-400 dark:text-gray-500"}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop: Search + Actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Search — NOP */}
            <div className="relative">
              <span className="absolute -translate-y-1/2 left-3 top-1/2 pointer-events-none">
                <svg className="fill-gray-400 dark:fill-gray-500" width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
                </svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari NOP..."
                className="h-9 w-[200px] rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              />
            </div>

            <ThemeToggleButton />
            <UserDropdown />
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggleButton />
            <button
              onClick={() => setApplicationMenuOpen(!applicationMenuOpen)}
              className="flex items-center justify-center w-9 h-9 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z" fill="currentColor"/>
              </svg>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {mobileOpen ? (
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile: Dots menu dropdown (user) */}
        <div className={`${applicationMenuOpen ? "flex" : "hidden"} items-center justify-end w-full gap-4 px-5 py-4 lg:hidden shadow-theme-md`}>
          <UserDropdown />
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <nav className="lg:hidden w-full px-3 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-theme-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span className={isActive(item.path) ? "text-brand-500 dark:text-brand-400" : "text-gray-400 dark:text-gray-500"}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
