"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import TaxpayerTable from "@/components/pbb/TaxpayerTable";
import taxpayers from "@/data/dummy-taxpayers.json";

export default function DaftarWajibPajak() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("Semua");

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb pageTitle="Daftar Wajib Pajak" />

      <ComponentCard title="Data Wajib Pajak" desc={`${taxpayers.length} wajib pajak terdaftar`}>
        <TaxpayerTable
          data={taxpayers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterKecamatan={filterKecamatan}
          onFilterChange={setFilterKecamatan}
        />
      </ComponentCard>
    </div>
  );
}
