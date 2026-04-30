import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json() as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    if (!email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.supportTicket.create({
      data: {
        email,
        subject: `[${name ?? "Anonymous"}] ${subject}`,
        body: message,
        status: "open",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Support ticket error:", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
