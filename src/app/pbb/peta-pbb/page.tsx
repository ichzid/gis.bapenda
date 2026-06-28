"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import taxObjects from "@/data/dummy-tax-objects.json";

const MapView = dynamic(() => import("@/components/pbb/MapView"), {
  ssr: false,
  loading: () => <div className="h-[calc(100vh-56px)] w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />,
});

const TaxObjectDrawer = dynamic(() => import("@/components/pbb/TaxObjectDrawer"), { ssr: false });

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
}

export default function PetaPBB() {
  const [selectedTaxObject, setSelectedTaxObject] = useState<TaxObject | null>(null);

  return (
    <div className="h-full">
      <MapView
        taxObjects={taxObjects as TaxObject[]}
        onMarkerClick={setSelectedTaxObject}
      />

      <TaxObjectDrawer
        data={selectedTaxObject}
        isOpen={selectedTaxObject !== null}
        onClose={() => setSelectedTaxObject(null)}
      />
    </div>
  );
}
