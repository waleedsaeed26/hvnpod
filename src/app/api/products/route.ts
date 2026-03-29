import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const model = searchParams.get("model");
    const featured = searchParams.get("featured");
    const published = searchParams.get("published") !== "false";

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: { slug: category } }),
        ...(model && { model }),
        ...(featured === "true" && { featured: true }),
        published,
      },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
