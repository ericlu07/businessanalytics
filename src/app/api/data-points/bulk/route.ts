import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  points: z.array(z.object({
    metricId: z.string(),
    value: z.number(),
    recordedAt: z.string(),
    note: z.string().nullable().optional(),
  })).max(1000),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  // Verify all metricIds belong to the current user
  const metricIds = [...new Set(parsed.data.points.map((p) => p.metricId))];
  const ownedMetrics = await db.metric.findMany({
    where: { id: { in: metricIds }, userId: user.id },
    select: { id: true },
  });
  const ownedIds = new Set(ownedMetrics.map((m) => m.id));
  const validPoints = parsed.data.points.filter((p) => ownedIds.has(p.metricId));
  if (validPoints.length === 0) return NextResponse.json({ error: "No valid metrics found" }, { status: 400 });

  const result = await db.dataPoint.createMany({
    data: validPoints.map((p) => ({
      userId: user.id,
      metricId: p.metricId,
      value: p.value,
      recordedAt: new Date(p.recordedAt),
      note: p.note ?? null,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ count: result.count }, { status: 201 });
}
