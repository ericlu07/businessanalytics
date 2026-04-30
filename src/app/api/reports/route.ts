import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";
import { nanoid } from "nanoid";

const schema = z.object({
  type: z.string().min(1),
  title: z.string().min(1).max(300),
});

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const report = await db.report.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      type: parsed.data.type,
      shareToken: nanoid(16),
    },
  });

  return NextResponse.json(report, { status: 201 });
}
