import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";

const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  metricId: z.string().cuid(),
  targetValue: z.number().positive(),
  deadline: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = createGoalSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const { title, metricId, targetValue, deadline } = parsed.data;

  // Verify metric belongs to user
  const metric = await db.metric.findFirst({ where: { id: metricId, userId: user.id } });
  if (!metric) return NextResponse.json({ error: "Metric not found" }, { status: 404 });

  const goal = await db.goal.create({
    data: {
      userId: user.id,
      title,
      metricId,
      targetValue,
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  return NextResponse.json(goal, { status: 201 });
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await db.goal.findMany({
    where: { userId: user.id },
    include: { metric: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(goals);
}
