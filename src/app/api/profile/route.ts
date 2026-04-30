import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().max(100).optional(),
  businessName: z.string().max(200).nullable().optional(),
  businessType: z.string().nullable().optional(),
  currency: z.string().length(3).optional(),
  timezone: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      businessName: parsed.data.businessName,
      businessType: parsed.data.businessType as "FREELANCER" | "SIDE_HUSTLE" | "ECOMMERCE" | "SERVICE_BUSINESS" | "SAAS" | "CREATOR" | "CUSTOM" | null | undefined,
      currency: parsed.data.currency,
      timezone: parsed.data.timezone,
    },
  });

  return NextResponse.json(updated);
}
