import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kdkecamatan = searchParams.get("kdkecamatan");

    let query = "SELECT kdkecamatan, kdkelurahan, nm_kelurahan FROM ref_kelurahan";
    const params: string[] = [];

    if (kdkecamatan) {
      query += " WHERE kdkecamatan = ?";
      params.push(kdkecamatan);
    }

    query += " ORDER BY nm_kelurahan ASC";

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching kelurahan:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch kelurahan data" },
      { status: 500 }
    );
  }
}
