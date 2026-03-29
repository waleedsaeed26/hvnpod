import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const quoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  productId: z.string().optional(),
  model: z.string().optional(),
  tier: z.string().optional(),
  color: z.string().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { productId, ...rest } = parsed.data;

    const quote = await prisma.quoteRequest.create({
      data: {
        ...rest,
        ...(productId && { productId }),
      },
      include: {
        product: {
          include: {
            images: { orderBy: { order: "asc" }, take: 1 },
            category: true,
          },
        },
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quote]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
