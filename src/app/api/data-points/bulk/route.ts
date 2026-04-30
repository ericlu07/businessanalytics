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

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const result = await db.dataPoint.createMany({
    data: parsed.data.points.map((p) => ({
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
