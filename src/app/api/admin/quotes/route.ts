import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateQuoteSchema = z.object({
  id: z.string().min(1, "Quote ID is required"),
  status: z.string().min(1, "Status is required"),
});

export async function GET() {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      include: {
        product: {
          include: {
            images: { orderBy: { order: "asc" }, take: 1 },
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("[GET /api/admin/quotes]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, status } = parsed.data;

    const existing = await prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
      include: {
        product: {
          include: {
            images: { orderBy: { order: "asc" }, take: 1 },
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/admin/quotes]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
