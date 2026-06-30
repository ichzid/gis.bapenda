import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kd_kecamatan = searchParams.get("kd_kecamatan");
    const kd_kelurahan = searchParams.get("kd_kelurahan");

    if (!kd_kecamatan || !kd_kelurahan) {
      return NextResponse.json(
        { success: false, message: "kd_kecamatan and kd_kelurahan are required" },
        { status: 400 }
      );
    }

    // JOIN tbl_data_lokasi dengan sppt (tahun pajak terbaru per objek)
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
        l.kd_propinsi, l.kd_dati2, l.kd_kecamatan, l.kd_kelurahan, 
        l.kd_blok, l.no_urut, l.kd_jns_op,
        CONCAT(l.kd_propinsi, '.', l.kd_dati2, '.', l.kd_kecamatan, '.', 
               l.kd_kelurahan, '.', l.kd_blok, '-', l.no_urut, '.', l.kd_jns_op) as nop,
        s.nm_wp_sppt,
        s.jln_wp_sppt,
        s.luas_bumi_sppt,
        s.luas_bng_sppt,
        s.njop_bumi_sppt,
        s.njop_bng_sppt,
        s.pbb_yg_harus_dibayar_sppt,
        s.status_pembayaran_sppt,
        s.thn_pajak_sppt,
        s.tgl_jatuh_tempo_sppt,
        l.geojeson
      FROM tbl_data_lokasi l
      JOIN sppt s ON 
        l.kd_propinsi = s.kd_propinsi AND
        l.kd_dati2 = s.kd_dati2 AND
        l.kd_kecamatan = s.kd_kecamatan AND
        l.kd_kelurahan = s.kd_kelurahan AND
        l.kd_blok = s.kd_blok AND
        l.no_urut = s.no_urut AND
        l.kd_jns_op = s.kd_jns_op
      WHERE l.kd_kecamatan = ? AND l.kd_kelurahan = ?
        AND s.thn_pajak_sppt = (
          SELECT MAX(s2.thn_pajak_sppt) FROM sppt s2
          WHERE s2.kd_propinsi = l.kd_propinsi AND s2.kd_dati2 = l.kd_dati2
            AND s2.kd_kecamatan = l.kd_kecamatan AND s2.kd_kelurahan = l.kd_kelurahan
            AND s2.kd_blok = l.kd_blok AND s2.no_urut = l.no_urut
            AND s2.kd_jns_op = l.kd_jns_op
        )`,
      [kd_kecamatan, kd_kelurahan]
    );

    // Format data agar sesuai dengan struktur yang dibutuhkan frontend
    const formattedData = rows.map((row) => {
      let boundary = [];
      try {
        if (row.geojeson) {
           const raw = row.geojeson.trim();
           if (raw.startsWith("[")) {
             boundary = JSON.parse(raw);
           } else {
             boundary = JSON.parse("[" + raw + "]");
           }
        }
      } catch (e) {
        console.error("Failed to parse geojeson for NOP", row.nop, e);
      }

      // Format rupiah
      const fmtRupiah = (v: number) => `Rp ${(v || 0).toLocaleString("id-ID")}`;

      return {
        id: row.nop,
        nop: row.nop,
        nama_wp: row.nm_wp_sppt || "-",
        alamat: row.jln_wp_sppt || "-",
        kecamatan: row.kd_kecamatan,
        lat: boundary.length > 0 ? boundary[0].lat : 0,
        lng: boundary.length > 0 ? boundary[0].lng : 0,
        luas_tanah: row.luas_bumi_sppt || 0,
        luas_bangunan: row.luas_bng_sppt || 0,
        njop_bumi: fmtRupiah(row.njop_bumi_sppt),
        njop_bangunan: fmtRupiah(row.njop_bng_sppt),
        nilai_pbb: fmtRupiah(row.pbb_yg_harus_dibayar_sppt),
        status: row.status_pembayaran_sppt === "1" ? "lunas" : "belum",
        status_label: row.status_pembayaran_sppt === "1" ? "Lunas" : "Belum Bayar",
        tahun_pajak: row.thn_pajak_sppt || "-",
        jatuh_tempo: row.tgl_jatuh_tempo_sppt 
          ? new Date(row.tgl_jatuh_tempo_sppt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
          : "-",
        boundary: boundary,
      };
    });

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching pbb data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pbb data" },
      { status: 500 }
    );
  }
}
