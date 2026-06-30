import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT kdkecamatan, nm_kecamatan FROM ref_kecamatan ORDER BY nm_kecamatan ASC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching kecamatan:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch kecamatan data" },
      { status: 500 }
    );
  }
}
