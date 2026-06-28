"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DashboardStats from "@/components/pbb/DashboardStats";
import ComponentCard from "@/components/common/ComponentCard";
import taxObjects from "@/data/dummy-tax-objects.json";
import taxpayers from "@/data/dummy-taxpayers.json";
import Badge from "@/components/ui/badge/Badge";

export default function DashboardPBB() {
  const totalWp = taxpayers.length;
  const totalLunas = taxpayers.filter((t) => t.status === "lunas").length;
  const totalBelum = taxpayers.filter((t) => t.status === "belum").length;
  const totalKurang = taxpayers.filter((t) => t.status === "kurang").length;
  const totalNilaiPbb = taxpayers.reduce((s, t) => s + t.nilai_pbb, 0);
  const totalTerhimpun = taxpayers
    .filter((t) => t.status === "lunas")
    .reduce((s, t) => s + t.nilai_pbb, 0);

  const statusBadge: Record<string, { color: "success" | "error" | "warning"; label: string }> = {
    lunas: { color: "success", label: "Lunas" },
    belum: { color: "error", label: "Belum" },
    kurang: { color: "warning", label: "Kurang" },
  };

  return (
    <div className="p-4 md:p-6">
      <PageBreadcrumb pageTitle="Dashboard PBB" />

      <DashboardStats
        totalWp={totalWp}
        totalLunas={totalLunas}
        totalBelum={totalBelum}
        totalKurang={totalKurang}
        totalNilaiPbb={totalNilaiPbb}
        totalTerhimpun={totalTerhimpun}
      />

      <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
        {/* Objek Pajak Terbaru */}
        <div className="col-span-12 xl:col-span-7">
          <ComponentCard title="Objek Pajak Terbaru">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">NOP</th>
                    <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Wajib Pajak</th>
                    <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Kecamatan</th>
                    <th className="py-3 pr-4 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Nilai PBB</th>
                    <th className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {taxObjects.slice(0, 7).map((obj) => {
                    const s = statusBadge[obj.status] || statusBadge.belum;
                    return (
                      <tr key={obj.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{obj.nop}</td>
                        <td className="py-3 pr-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">{obj.nama_wp}</td>
                        <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{obj.kecamatan}</td>
                        <td className="py-3 pr-4 text-theme-sm text-right font-medium text-gray-700 dark:text-gray-300">Rp {obj.nilai_pbb.toLocaleString("id-ID")}</td>
                        <td className="py-3 text-center"><Badge color={s.color} size="sm">{s.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>

        {/* Status Pembayaran */}
        <div className="col-span-12 xl:col-span-5">
          <ComponentCard title="Status Pembayaran" desc="Rekap status pembayaran PBB tahun 2025">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-theme-sm text-gray-500 dark:text-gray-400">Lunas</span>
                  <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">{totalLunas} WP</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-success-500 transition-all" style={{ width: `${totalWp > 0 ? (totalLunas / totalWp) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-theme-sm text-gray-500 dark:text-gray-400">Kurang Bayar</span>
                  <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">{totalKurang} WP</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-warning-500 transition-all" style={{ width: `${totalWp > 0 ? (totalKurang / totalWp) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-theme-sm text-gray-500 dark:text-gray-400">Belum Bayar</span>
                  <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">{totalBelum} WP</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-error-500 transition-all" style={{ width: `${totalWp > 0 ? (totalBelum / totalWp) * 100 : 0}%` }} />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-theme-sm text-gray-500 dark:text-gray-400">Total Terhimpun</span>
                  <span className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">Rp {totalTerhimpun.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-theme-sm text-gray-500 dark:text-gray-400">Total Tunggakan</span>
                  <span className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">Rp {(totalNilaiPbb - totalTerhimpun).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
