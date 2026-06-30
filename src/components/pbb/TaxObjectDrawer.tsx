"use client";

import { useState, useEffect } from "react";
import Badge from "@/components/ui/badge/Badge";

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
  boundary?: { lat: number; lng: number }[];
}

interface TaxObjectDrawerProps {
  data: TaxObject | null;
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryRow {
  no: number;
  tahun: string;
  pokok: string;
  jatuh_tempo: string;
  denda: string;
  jumlah: string;
  tgl_bayar: string;
  status: string;
}

export default function TaxObjectDrawer({
  data,
  isOpen,
  onClose,
}: TaxObjectDrawerProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (data && showDetailModal) {
      setLoadingHistory(true);
      fetch(`/api/pbb/detail?nop=${encodeURIComponent(data.nop)}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setHistory(res.data);
          }
        })
        .catch((err) => console.error("Failed to fetch history:", err))
        .finally(() => setLoadingHistory(false));
    }
  }, [data, showDetailModal]);

  if (!data) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100000] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[100001] h-screen w-80 lg:w-96 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detail Objek Pajak
          </h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Foto Objek — placeholder untuk nanti */}
          <div className="flex items-center justify-center h-40 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-gray-600">
              <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Identitas Objek */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Identitas Objek</p>
            <div className="space-y-1.5">
              <Row label="NOP" value={data.nop} bold />
              <Row label="Nama WP" value={data.nama_wp} bold />
              <Row label="Alamat" value={data.alamat} bold />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Dimensi & Nilai */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Dimensi &amp; Nilai</p>
            <div className="space-y-1.5">
              <Row label="Luas Bumi" value={`${data.luas_tanah.toLocaleString()} m²`} bold />
              <Row label="Luas Bangunan" value={`${data.luas_bangunan.toLocaleString()} m²`} bold />
              <Row label="NJOP Bumi" value={data.njop_bumi} bold />
              <Row label="NJOP Bangunan" value={data.njop_bangunan} bold />
            </div>
          </div>

          {/* Tombol Detail Pajak */}
          <button
            onClick={() => setShowDetailModal(true)}
            className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Lihat Riwayat Pembayaran
          </button>
        </div>
      </div>

      {/* Modal Riwayat Pembayaran */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100002] flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-400/50 backdrop-blur-[32px]" onClick={() => setShowDetailModal(false)} />
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-8 z-10 mx-4">
            {/* Close */}
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute right-3 top-3 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.04289 6.04289C6.43342 5.65237 7.06658 5.65237 7.45711 6.04289L12 10.5858L16.5429 6.04289C16.9334 5.65237 17.5666 5.65237 17.9571 6.04289C18.3476 6.43342 18.3476 7.06658 17.9571 7.45711L13.4142 12L17.9571 16.5429C18.3476 16.9334 18.3476 17.5666 17.9571 17.9571C17.5666 18.3476 16.9334 18.3476 16.5429 17.9571L12 13.4142L7.45711 17.9571C7.06658 18.3476 6.43342 18.3476 6.04289 17.9571C5.65237 17.5666 5.65237 16.9334 6.04289 16.5429L10.5858 12L6.04289 7.45711C5.65237 7.06658 5.65237 6.43342 6.04289 6.04289Z" fill="currentColor"/>
              </svg>
            </button>

            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Detail Pajak PBB
            </h3>

            {/* 2 Kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Kolom Kiri */}
              <div className="space-y-3">
                <Row label="NOP" value={data.nop} bold />
                <Row label="Nama WP" value={data.nama_wp} bold />
                <Row label="Alamat WP" value={data.alamat} bold />
              </div>
              {/* Kolom Kanan */}
              <div className="space-y-3">
                <Row label="Luas Bumi / Bangunan" value={`${data.luas_tanah.toLocaleString()} m² / ${data.luas_bangunan.toLocaleString()} m²`} bold />
                <Row label="NJOP Bumi" value={data.njop_bumi} bold />
                <Row label="NJOP Bangunan" value={data.njop_bangunan} bold />
              </div>
            </div>

            {/* Tabel History */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Riwayat Pembayaran PBB
              </h4>

              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-3 border-brand-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">No</th>
                        <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Tahun Pajak</th>
                        <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Nama WP</th>
                        <th className="py-3 pr-4 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Pokok Pajak</th>
                        <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Jatuh Tempo</th>
                        <th className="py-3 pr-4 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Denda</th>
                        <th className="py-3 pr-4 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Jumlah Bayar</th>
                        <th className="py-3 pr-4 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Tgl Bayar</th>
                        <th className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {history.map((row) => (
                        <tr key={row.tahun} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{row.no}</td>
                          <td className="py-3 pr-4 text-theme-sm font-medium text-gray-800 dark:text-white/90">{row.tahun}</td>
                          <td className="py-3 pr-4 text-theme-sm text-gray-700 dark:text-gray-300">{data.nama_wp}</td>
                          <td className="py-3 pr-4 text-theme-sm text-right text-gray-700 dark:text-gray-300">{row.pokok}</td>
                          <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{row.jatuh_tempo}</td>
                          <td className="py-3 pr-4 text-theme-sm text-right text-gray-700 dark:text-gray-300">{row.denda}</td>
                          <td className="py-3 pr-4 text-theme-sm text-right font-medium text-gray-800 dark:text-white/90">{row.jumlah}</td>
                          <td className="py-3 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{row.tgl_bayar}</td>
                          <td className="py-3 text-center">
                            <Badge color={row.status === "Lunas" ? "success" : "error"} size="sm">{row.status}</Badge>
                          </td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-theme-sm text-gray-400">Tidak ada data riwayat</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Helper: satu baris label : value */
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex">
      <span className="text-theme-sm text-gray-400 dark:text-gray-500 w-36 shrink-0">{label}</span>
      <span className="text-theme-sm text-gray-400 dark:text-gray-500 w-4 shrink-0">:</span>
      <span className={`text-theme-sm ${bold ? "font-medium text-gray-800 dark:text-white/90" : "text-gray-600 dark:text-gray-300"}`}>
        {value}
      </span>
    </div>
  );
}
