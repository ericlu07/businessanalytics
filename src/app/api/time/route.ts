import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  projectName: z.string().min(1).max(200),
  clientName: z.string().nullable().optional(),
  hourlyRate: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  // Stop any running timer
  await db.timeEntry.updateMany({
    where: { userId: user.id, status: "RUNNING" },
    data: { status: "STOPPED", stoppedAt: new Date() },
  });

  const entry = await db.timeEntry.create({
    data: {
      userId: user.id,
      projectName: parsed.data.projectName,
      clientName: parsed.data.clientName ?? null,
      hourlyRate: parsed.data.hourlyRate ?? null,
      description: parsed.data.description ?? null,
      startedAt: new Date(),
      status: "RUNNING",
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
