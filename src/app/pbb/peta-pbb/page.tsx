"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/pbb/MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />,
});

const TaxObjectDrawer = dynamic(() => import("@/components/pbb/TaxObjectDrawer"), { ssr: false });
const KecamatanSelector = dynamic(() => import("@/components/pbb/KecamatanSelector"), { ssr: false });

interface TaxObject {
  id: string;
  nop: string;
  nama_wp: string;
  alamat: string;
  kecamatan: string;
  lat: number;
  lng: number;
  luas_tanah: number;
  luas_bangunan: number;
  njop_bumi: string;
  njop_bangunan: string;
  nilai_pbb: string;
  status: string;
  status_label: string;
  tahun_pajak: string;
  jatuh_tempo: string;
  boundary: { lat: number; lng: number }[];
}

interface Kecamatan {
  kdkecamatan: string;
  nm_kecamatan: string;
}

interface Kelurahan {
  kdkecamatan: string;
  kdkelurahan: string;
  nm_kelurahan: string;
}

// Hitung bounding box dari GeoJSON Feature
function getBoundsFromFeature(feature: GeoJSON.Feature): [[number, number], [number, number]] | null {
  const coords: [number, number][] = [];
  function extract(g: GeoJSON.Geometry | undefined) {
    if (!g) return;
    if (g.type === "Polygon") {
      g.coordinates[0].forEach(c => coords.push([c[0], c[1]]));
    } else if (g.type === "MultiPolygon") {
      g.coordinates.forEach(poly => poly[0].forEach(c => coords.push([c[0], c[1]])));
    }
  }
  extract(feature.geometry);
  if (coords.length === 0) return null;
  const lngs = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
}

export default function PetaPBB() {
  const [selectedTaxObject, setSelectedTaxObject] = useState<TaxObject | null>(null);
  const [taxObjects, setTaxObjects] = useState<TaxObject[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<Kecamatan | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<Kelurahan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJSON.Feature[]>([]);

  // Load GeoJSON untuk boundary wilayah
  useEffect(() => {
    import("@/data/geojson/batubara.json").then(data => {
      const d = data.default as { features: GeoJSON.Feature[] };
      setGeoJsonFeatures(d.features || []);
    });
  }, []);

  // Fetch data polygon dari database saat kecamatan + kelurahan dipilih
  useEffect(() => {
    if (selectedDistrict && selectedVillage) {
      setIsLoading(true);
      fetch(`/api/pbb?kd_kecamatan=${selectedDistrict.kdkecamatan}&kd_kelurahan=${selectedVillage.kdkelurahan}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTaxObjects(data.data);
          } else {
            setTaxObjects([]);
          }
        })
        .catch(err => console.error("Failed to fetch tax objects:", err))
        .finally(() => setIsLoading(false));
    } else {
      setTaxObjects([]);
    }
  }, [selectedDistrict, selectedVillage]);

  // Hitung bounding box untuk auto-fokus peta
  const fitBounds = useMemo((): [[number, number], [number, number]] | null => {
    // Normalisasi nama: lowercase + trim
    const norm = (s: string) => s.toLowerCase().trim();

    // 1. Jika ada kelurahan dipilih, cari dari GeoJSON dulu
    if (selectedVillage && selectedDistrict) {
      const villageFeature = geoJsonFeatures.find(f => {
        const p = f.properties as Record<string, string> | undefined;
        return norm(p?.district || "") === norm(selectedDistrict.nm_kecamatan) &&
               norm(p?.village || "") === norm(selectedVillage.nm_kelurahan);
      });
      if (villageFeature) return getBoundsFromFeature(villageFeature);
      
      // fallback: hitung dari titik polygon data
      const allPoints: [number, number][] = [];
      taxObjects.forEach(t => {
        t.boundary?.forEach(b => allPoints.push([b.lng, b.lat]));
      });
      if (allPoints.length > 0) {
        const lngs = allPoints.map(p => p[0]);
        const lats = allPoints.map(p => p[1]);
        return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
      }
    }

    // 2. Jika hanya kecamatan dipilih, cari dari GeoJSON
    if (selectedDistrict) {
      const districtFeatures = geoJsonFeatures.filter(f => {
        const p = f.properties as Record<string, string> | undefined;
        return norm(p?.district || "") === norm(selectedDistrict.nm_kecamatan);
      });
      if (districtFeatures.length > 0) {
        const allPoints: [number, number][] = [];
        districtFeatures.forEach(f => {
          const b = getBoundsFromFeature(f);
          if (b) { allPoints.push(b[0]); allPoints.push(b[1]); }
        });
        if (allPoints.length > 0) {
          const lngs = allPoints.map(p => p[0]);
          const lats = allPoints.map(p => p[1]);
          return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
        }
      }
    }

    return null;
  }, [selectedDistrict, selectedVillage, geoJsonFeatures, taxObjects]);

  return (
    <div className="h-full relative">
      <MapView
        taxObjects={taxObjects}
        onMarkerClick={setSelectedTaxObject}
        fitBounds={fitBounds}
      />

      <TaxObjectDrawer
        data={selectedTaxObject}
        isOpen={selectedTaxObject !== null}
        onClose={() => setSelectedTaxObject(null)}
      />

      <KecamatanSelector
        selectedDistrict={selectedDistrict}
        selectedVillage={selectedVillage}
        onSelectDistrict={setSelectedDistrict}
        onSelectVillage={setSelectedVillage}
      />
      
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
           <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Memuat data polygon...</span>
           </div>
        </div>
      )}
    </div>
  );
}
