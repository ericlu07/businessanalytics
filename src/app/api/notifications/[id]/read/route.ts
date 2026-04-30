import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.notification.updateMany({
      where: { id, userId: user.id },
      data: { readAt: new Date() },
    });
  } catch {
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
