"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import taxObjects from "@/data/dummy-tax-objects.json";

const MapView = dynamic(() => import("@/components/pbb/MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />,
});

const TaxObjectDrawer = dynamic(() => import("@/components/pbb/TaxObjectDrawer"), { ssr: false });
const KecamatanSelector = dynamic(() => import("@/components/pbb/KecamatanSelector"), { ssr: false });

interface TaxObject {
  id: number;
  nop: string;
  nama_wp: string;
  nik: string;
  alamat: string;
  kecamatan: string;
  lat: number;
  lng: number;
  luas_tanah: number;
  luas_bangunan: number;
  nilai_pbb: number;
  status: string;
  boundary: { lat: number; lng: number }[];
}

export default function PetaPBB() {
  const [selectedTaxObject, setSelectedTaxObject] = useState<TaxObject | null>(null);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJSON.Feature[]>([]);
  const [highlightFeature, setHighlightFeature] = useState<GeoJSON.Feature | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);

  useEffect(() => {
    import("@/data/geojson/batubara.json").then((data) => {
      const d = data.default as { features: GeoJSON.Feature[] };
      setGeoJsonFeatures(d.features || []);
    });
  }, []);

  return (
    <div className="h-full">
      <MapView
        taxObjects={taxObjects as TaxObject[]}
        onMarkerClick={setSelectedTaxObject}
        highlightFeature={highlightFeature}
      />

      <TaxObjectDrawer
        data={selectedTaxObject}
        isOpen={selectedTaxObject !== null}
        onClose={() => setSelectedTaxObject(null)}
      />

      {geoJsonFeatures.length > 0 && (
        <KecamatanSelector
          geoJsonFeatures={geoJsonFeatures}
          onSelectVillage={setHighlightFeature}
          selectedDistrict={selectedDistrict}
          selectedVillage={selectedVillage}
          onSelectDistrict={setSelectedDistrict}
          onSelectVillageName={setSelectedVillage}
        />
      )}
    </div>
  );
}
