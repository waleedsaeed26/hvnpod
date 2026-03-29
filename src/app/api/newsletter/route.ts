import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  categoryTag: z.string().optional(),
});

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, categoryTag } = parsed.data;

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        active: true,
        ...(categoryTag !== undefined && { categoryTag }),
      },
      create: {
        email,
        active: true,
        ...(categoryTag !== undefined && { categoryTag }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/newsletter]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    await prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/newsletter]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
