import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";
import { nanoid } from "nanoid";

const VALID_REPORT_TYPES = ["monthly_summary", "income_expense", "client_report", "growth_report"] as const;

const schema = z.object({
  type: z.enum(VALID_REPORT_TYPES),
  title: z.string().min(1).max(300),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  let report;
  try {
    report = await db.report.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        type: parsed.data.type,
        shareToken: nanoid(16),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }

  return NextResponse.json(report, { status: 201 });
}
