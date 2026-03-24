import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDb();
    const sondages = await db.collection("sondages")
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(sondages);
  } catch (error) {
    console.error("Erreur lors de la récupération des sondages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des sondages" },
      { status: 500 }
    );
  }
}