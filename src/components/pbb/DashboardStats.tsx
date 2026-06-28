"use client";

import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";

interface StatProps {
  totalWp: number;
  totalLunas: number;
  totalBelum: number;
  totalKurang: number;
  totalNilaiPbb: number;
  totalTerhimpun: number;
}

export default function DashboardStats({
  totalWp,
  totalLunas,
  totalBelum,
  totalKurang,
  totalNilaiPbb,
  totalTerhimpun,
}: StatProps) {
  const persenLunas = totalWp > 0 ? ((totalLunas / totalWp) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {/* Total Wajib Pajak */}
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
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalWp.toLocaleString("id-ID")}
            </h4>
          </div>
          <Badge color="success"><ArrowUpIcon /> {persenLunas}%</Badge>
        </div>
      </div>

      {/* PBB Terhimpun */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800 dark:text-white/90">
            <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">PBB Terhimpun</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              Rp {totalTerhimpun.toLocaleString("id-ID")}
            </h4>
          </div>
          <Badge color="success"><ArrowUpIcon /> {persenLunas}%</Badge>
        </div>
      </div>

      {/* Tunggakan */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800 dark:text-white/90">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Belum Bayar</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalBelum.toLocaleString("id-ID")} WP
            </h4>
          </div>
          <Badge color="error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-error-500">
              <path d="M8 3V9M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {((totalBelum / totalWp) * 100).toFixed(1)}%
          </Badge>
        </div>
      </div>

      {/* Total Nilai PBB */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-800 dark:text-white/90">
            <path d="M3 8L8.44992 11.6333C9.13295 12.0887 9.47446 12.3164 9.84542 12.3953C10.1728 12.4666 10.5141 12.4437 10.8266 12.329C11.1819 12.1988 11.4994 11.9094 12.1344 11.3305L12.8556 10.6695C13.4906 10.0906 13.8081 9.8012 14.1634 9.67104C14.4759 9.55633 14.8172 9.53339 15.1446 9.60471C15.5155 9.68359 15.8571 9.91133 16.5401 10.3667L22 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 8V3H8M14 21H18.5C19.0523 21 19.5 20.5523 19.5 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Nilai PBB</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              Rp {totalNilaiPbb.toLocaleString("id-ID")}
            </h4>
          </div>
          <Badge color="info">
            {totalKurang} kurang
          </Badge>
        </div>
      </div>
    </div>
  );
}
