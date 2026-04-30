import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
  } catch {
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
