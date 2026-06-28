"use client";

import ComponentCard from "@/components/common/ComponentCard";

interface RekapKecamatan {
  kecamatan: string;
  total_wp: number;
  lunas: number;
  belum: number;
  kurang: number;
  total_nilai: number;
}

interface ReportSummaryProps {
  data: RekapKecamatan[];
}

export default function ReportSummary({ data }: ReportSummaryProps) {
  const grandTotal = data.reduce((s, d) => s + d.total_nilai, 0);
  const grandWp = data.reduce((s, d) => s + d.total_wp, 0);
  const grandLunas = data.reduce((s, d) => s + d.lunas, 0);
  const grandBelum = data.reduce((s, d) => s + d.belum, 0);
  const grandKurang = data.reduce((s, d) => s + d.kurang, 0);

  return (
    <div className="space-y-6">
      {/* Grand Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {/* Total WP */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800 dark:text-white/90">
              <path d="M17 21V19C17 16.7909 15.2091 15 13 15H11C8.79086 15 7 16.7909 7 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Wajib Pajak</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{grandWp.toLocaleString("id-ID")}</h4>
            </div>
          </div>
        </div>

        {/* Total Nilai */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800 dark:text-white/90">
              <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Nilai PBB</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">Rp {grandTotal.toLocaleString("id-ID")}</h4>
            </div>
          </div>
        </div>

        {/* Persentase Lunas */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800 dark:text-white/90">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Persentase Lunas</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{grandWp > 0 ? ((grandLunas / grandWp) * 100).toFixed(1) : "0"}%</h4>
            </div>
          </div>
        </div>

        {/* Belum Bayar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800 dark:text-white/90">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Tunggakan</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{grandBelum + grandKurang} WP</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Table Per Kecamatan */}
      <ComponentCard title="Rekap Per Kecamatan" desc="Detail pembayaran PBB per kecamatan tahun 2025">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Kecamatan</th>
                <th className="py-3 pr-4 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Total WP</th>
                <th className="py-3 pr-4 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Lunas</th>
                <th className="py-3 pr-4 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Belum</th>
                <th className="py-3 pr-4 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Kurang</th>
                <th className="py-3 pr-4 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Total Nilai</th>
                <th className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">% Lunas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 pr-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">{row.kecamatan}</td>
                  <td className="py-3 pr-4 text-theme-sm text-center text-gray-700 dark:text-gray-300">{row.total_wp}</td>
                  <td className="py-3 pr-4 text-theme-sm text-center text-success-600 dark:text-success-400 font-medium">{row.lunas}</td>
                  <td className="py-3 pr-4 text-theme-sm text-center text-error-500 dark:text-error-400 font-medium">{row.belum}</td>
                  <td className="py-3 pr-4 text-theme-sm text-center text-warning-500 dark:text-warning-400 font-medium">{row.kurang}</td>
                  <td className="py-3 pr-4 text-theme-sm text-right text-gray-700 dark:text-gray-300">Rp {row.total_nilai.toLocaleString("id-ID")}</td>
                  <td className="py-3 text-theme-sm text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full rounded-full bg-success-500" style={{ width: `${row.total_wp > 0 ? ((row.lunas / row.total_wp) * 100).toFixed(0) : 0}%` }} />
                      </div>
                      <span className="text-theme-xs text-gray-500">{row.total_wp > 0 ? ((row.lunas / row.total_wp) * 100).toFixed(0) : 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
}
