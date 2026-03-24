import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { question, options } = await request.json();

  if (!question)
    return NextResponse.json({ error: "Question manquante" }, { status: 400 });

  if (!options || !Array.isArray(options))
    return NextResponse.json({ error: "Les options doivent être un tableau" }, { status: 400 });

  if (options.length === 0)
    return NextResponse.json({ error: "Au moins une option est requise" }, { status: 400 });

  // Validation que chaque option est une chaîne non vide
  const validOptions = options.filter(option =>
    typeof option === 'string' && option.trim().length > 0
  );

  if (validOptions.length !== options.length)
    return NextResponse.json({ error: "Toutes les options doivent être des chaînes non vides" }, { status: 400 });

  const db = await getDb();
  const sondage =
  {
    question: question.trim(),
    options: validOptions.map(option => option.trim()),
    createdAt: new Date(),
    isActive: true
  };
  await db.collection("sondages").insertOne(sondage);
  return NextResponse.json(sondage, { status: 201 });
}