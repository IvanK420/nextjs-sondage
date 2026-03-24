import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const db = await getDb();
  const votes = await db.collection("votes").find().toArray();
  return NextResponse.json(votes);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { sondageId, optionId } = await request.json();

  if (!sondageId)
    return NextResponse.json({ error: "ID du sondage manquant" }, { status: 400 });

  if (!optionId)
    return NextResponse.json({ error: "Option choisie manquante" }, { status: 400 });

  const db = await getDb();

  // Vérifier que le sondage existe et est actif
  const sondage = await db.collection("sondages").findOne({
    _id: new ObjectId(sondageId),
    isActive: true
  });

  if (!sondage)
    return NextResponse.json({ error: "Sondage introuvable ou inactif" }, { status: 404 });

  // Vérifier que l'option choisie existe dans le sondage
  if (!sondage.options.includes(optionId))
    return NextResponse.json({ error: "Option invalide pour ce sondage" }, { status: 400 });

  // Vérifier que l'utilisateur n'a pas déjà voté pour ce sondage
  const existingVote = await db.collection("votes").findOne({
    sondageId: sondageId,
    userId: session.user.id
  });

  if (existingVote)
    return NextResponse.json({ error: "Vous avez déjà voté pour ce sondage" }, { status: 409 });

  const vote = {
    sondageId: sondageId,
    optionId: optionId,
    createdAt: new Date(),
    userId: session.user.id,
    userName: session.user.name,
  };

  await db.collection("votes").insertOne(vote);
  return NextResponse.json(vote, { status: 201 });
}