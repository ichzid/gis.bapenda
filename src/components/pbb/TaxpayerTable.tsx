"use client";

import Badge from "@/components/ui/badge/Badge";

interface Taxpayer {
  id: number;
  nop: string;
  nama: string;
  nik: string;
  alamat: string;
  kecamatan: string;
  nilai_pbb: number;
  status: string;
  tahun: number;
}

interface TaxpayerTableProps {
  data: Taxpayer[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterKecamatan: string;
  onFilterChange: (k: string) => void;
}

const statusVariant: Record<string, "success" | "error" | "warning"> = {
  lunas: "success",
  belum: "error",
  kurang: "warning",
};

const statusLabel: Record<string, string> = {
  lunas: "Lunas",
  belum: "Belum",
  kurang: "Kurang",
};

const kecamatanList = [
  "Semua",
  "Sei Balai",
  "Tanjung Tiram",
  "Talawi",
  "Lima Puluh",
  "Air Putih",
  "Sei Suka",
  "Medang Deras",
];

export default function TaxpayerTable({
  data,
  searchQuery,
  onSearchChange,
  filterKecamatan,
  onFilterChange,
}: TaxpayerTableProps) {
  const filtered = data.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nik.includes(searchQuery);
    const matchKec =
      filterKecamatan === "Semua" || item.kecamatan === filterKecamatan;
    return matchSearch && matchKec;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari NOP, Nama, atau NIK..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={filterKecamatan}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {kecamatanList.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">No</th>
              <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">NOP</th>
              <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Nama WP</th>
              <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">NIK</th>
              <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Kecamatan</th>
              <th className="py-3 pr-4 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Nilai PBB</th>
              <th className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-theme-sm text-gray-400 dark:text-gray-500">Data tidak ditemukan</td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{idx + 1}</td>
                  <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{item.nop}</td>
                  <td className="py-3 pr-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">{item.nama}</td>
                  <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{item.nik}</td>
                  <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{item.kecamatan}</td>
                  <td className="py-3 pr-4 text-theme-sm text-right font-medium text-gray-700 dark:text-gray-300">Rp {item.nilai_pbb.toLocaleString("id-ID")}</td>
                  <td className="py-3 text-center">
                    <Badge color={statusVariant[item.status] || "warning"} size="sm">{statusLabel[item.status] || item.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Menampilkan {filtered.length} dari {data.length} data
      </p>
    </div>
  );
}
