import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  metricId: z.string().cuid(),
  value: z.number(),
  note: z.string().nullable().optional(),
  recordedAt: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const metric = await db.metric.findFirst({ where: { id: parsed.data.metricId, userId: user.id } });
  if (!metric) return NextResponse.json({ error: "Metric not found" }, { status: 404 });

  let point;
  try {
    point = await db.dataPoint.create({
      data: {
        userId: user.id,
        metricId: parsed.data.metricId,
        value: parsed.data.value,
        note: parsed.data.note ?? null,
        recordedAt: parsed.data.recordedAt ? new Date(parsed.data.recordedAt) : new Date(),
      },
      include: { metric: true },
    });
  } catch {
    return NextResponse.json({ error: "Failed to create data point" }, { status: 500 });
  }

  return NextResponse.json(point, { status: 201 });
}
