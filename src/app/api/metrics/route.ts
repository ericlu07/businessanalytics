import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";

const createMetricSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  category: z.string().max(50).optional(),
  builtInKey: z.string().max(100).optional(),
  prefix: z.string().max(20).nullable().optional(),
  unit: z.string().max(50).nullable().optional(),
  icon: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = createMetricSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  // Check for duplicate builtIn key
  if (parsed.data.builtInKey) {
    const existing = await db.metric.findFirst({
      where: { userId: user.id, builtInKey: parsed.data.builtInKey },
    });
    if (existing) return NextResponse.json(existing);
  }

  const metric = await db.metric.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      description: parsed.data.description,
      category: (parsed.data.category as "FINANCIAL" | "SALES" | "MARKETING" | "OPERATIONS" | "TIME" | "GROWTH" | "CUSTOMER" | "CUSTOM") ?? "CUSTOM",
      builtInKey: parsed.data.builtInKey,
      prefix: parsed.data.prefix,
      unit: parsed.data.unit,
      icon: parsed.data.icon,
    },
  });

  // Auto-create a KPI widget on the default dashboard
  const dashboard = await db.dashboard.findFirst({
    where: { userId: user.id, isDefault: true },
  });
  if (dashboard) {
    try {
      const widgetCount = await db.widget.count({ where: { dashboardId: dashboard.id } });
      await db.widget.create({
        data: {
          dashboardId: dashboard.id,
          metricId: metric.id,
          type: "KPI_TILE",
          title: metric.name,
          position: widgetCount,
        },
      });
    } catch {
      // Widget creation failure is non-fatal; metric was created successfully
    }
  }

  return NextResponse.json(metric, { status: 201 });
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const metrics = await db.metric.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(metrics);
}
