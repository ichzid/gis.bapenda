"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReportSummary from "@/components/pbb/ReportSummary";
import taxpayers from "@/data/dummy-taxpayers.json";

export default function Laporan() {
  const kecamatanSet = new Set(taxpayers.map((t) => t.kecamatan));
  const rekapData = Array.from(kecamatanSet)
    .map((kec) => {
      const wpKec = taxpayers.filter((t) => t.kecamatan === kec);
      return {
        kecamatan: kec,
        total_wp: wpKec.length,
        lunas: wpKec.filter((t) => t.status === "lunas").length,
        belum: wpKec.filter((t) => t.status === "belum").length,
        kurang: wpKec.filter((t) => t.status === "kurang").length,
        total_nilai: wpKec.reduce((s, t) => s + t.nilai_pbb, 0),
      };
    })
    .sort((a, b) => b.total_nilai - a.total_nilai);

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb pageTitle="Laporan" />
      <ReportSummary data={rekapData} />
    </div>
  );
}
