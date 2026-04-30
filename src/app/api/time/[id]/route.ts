import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await db.timeEntry.findFirst({ where: { id, userId: user.id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.timeEntry.update({
    where: { id },
    data: { status: "STOPPED", stoppedAt: new Date() },
  });

  return NextResponse.json(updated);
}
