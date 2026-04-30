import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { METRIC_LIBRARY } from "@/lib/metrics/library";
import { BUSINESS_TEMPLATES } from "@/lib/metrics/templates";
import { z } from "zod";

const schema = z.object({
  businessType: z.string().optional(),
  businessName: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const { businessType, businessName } = parsed.data;

  // Update user profile
  await db.user.update({
    where: { id: user.id },
    data: {
      businessType: businessType as "FREELANCER" | "SIDE_HUSTLE" | "ECOMMERCE" | "SERVICE_BUSINESS" | "SAAS" | "CREATOR" | "CUSTOM" | undefined,
      businessName: businessName ?? null,
      onboardingComplete: true,
    },
  });

  // Create default metrics based on template
  if (businessType && businessType in BUSINESS_TEMPLATES) {
    const template = BUSINESS_TEMPLATES[businessType];
    if (template) {
      const metricDefs = template.metricKeys
        .map((key) => METRIC_LIBRARY.find((m) => m.key === key))
        .filter(Boolean);

      const createdMetrics = await Promise.all(
        metricDefs.map((def) =>
          db.metric.upsert({
            where: { id: `${user.id}_${def!.key}` },
            update: {},
            create: {
              id: `${user.id}_${def!.key}`.slice(0, 25) + "_" + Date.now().toString(36),
              userId: user.id,
              name: def!.name,
              description: def!.description,
              category: def!.category as "FINANCIAL" | "SALES" | "MARKETING" | "OPERATIONS" | "TIME" | "GROWTH" | "CUSTOMER" | "CUSTOM",
              builtInKey: def!.key,
              prefix: def!.prefix ?? null,
              unit: def!.unit ?? null,
              icon: def!.icon,
            },
          })
        )
      );

      // Create dashboard with widgets
      let dashboard = await db.dashboard.findFirst({
        where: { userId: user.id, isDefault: true },
      });

      if (!dashboard) {
        dashboard = await db.dashboard.create({
          data: {
            userId: user.id,
            name: businessName ?? "My Dashboard",
            isDefault: true,
          },
        });
      }

      // Create KPI widgets for each metric
      try {
        await Promise.all(
          createdMetrics.map((metric, i) =>
            db.widget.create({
              data: {
                dashboardId: dashboard!.id,
                metricId: metric.id,
                type: "KPI_TILE",
                title: metric.name,
                position: i,
                gridX: (i % 3) * 2,
                gridY: Math.floor(i / 3),
                gridW: 2,
                gridH: 1,
              },
            })
          )
        );
      } catch {
        // Widgets failed but onboarding is marked complete — user can add widgets later
      }
    }
  }

  return NextResponse.json({ success: true });
}
