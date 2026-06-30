import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nop = searchParams.get("nop");

    if (!nop) {
      return NextResponse.json(
        { success: false, message: "nop parameter is required" },
        { status: 400 }
      );
    }

    // Parse NOP: 12.21.141.008.006-0577.0
    const parts = nop.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\.(\d+)-(\d+)\.(\d+)$/);
    if (!parts) {
      return NextResponse.json(
        { success: false, message: "Invalid NOP format" },
        { status: 400 }
      );
    }

    const [, kd_propinsi, kd_dati2, kd_kecamatan, kd_kelurahan, kd_blok, no_urut, kd_jns_op] = parts;

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
        nm_wp_sppt,
        jln_wp_sppt,
        luas_bumi_sppt,
        luas_bng_sppt,
        njop_bumi_sppt,
        njop_bng_sppt,
        pbb_yg_harus_dibayar_sppt,
        status_pembayaran_sppt,
        thn_pajak_sppt,
        tgl_jatuh_tempo_sppt
      FROM sppt 
      WHERE kd_propinsi = ? AND kd_dati2 = ? AND kd_kecamatan = ? 
        AND kd_kelurahan = ? AND kd_blok = ? AND no_urut = ? AND kd_jns_op = ?
      ORDER BY thn_pajak_sppt ASC`,
      [kd_propinsi, kd_dati2, kd_kecamatan, kd_kelurahan, kd_blok, no_urut, kd_jns_op]
    );

    const fmtRupiah = (v: number) => `Rp ${(v || 0).toLocaleString("id-ID")}`;

    const history = rows.map((row, idx) => {
      const pokok = row.pbb_yg_harus_dibayar_sppt || 0;
      const isLunas = row.status_pembayaran_sppt === "1";
      const denda = isLunas ? 0 : Math.floor(pokok * 0.02 * Math.min(Math.max(1, idx), 24));
      
      return {
        no: idx + 1,
        tahun: row.thn_pajak_sppt || "-",
        pokok: fmtRupiah(pokok),
        jatuh_tempo: row.tgl_jatuh_tempo_sppt
          ? new Date(row.tgl_jatuh_tempo_sppt).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
          : "-",
        denda: isLunas ? "Rp 0" : fmtRupiah(denda),
        jumlah: isLunas ? fmtRupiah(pokok) : fmtRupiah(pokok + denda),
        tgl_bayar: isLunas ? "Sudah dibayar" : "-",
        status: isLunas ? "Lunas" : "Belum",
      };
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching pbb detail:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pbb detail" },
      { status: 500 }
    );
  }
}
