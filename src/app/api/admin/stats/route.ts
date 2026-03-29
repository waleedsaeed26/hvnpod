import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalQuotes,
      pendingQuotes,
      totalProducts,
      publishedProducts,
      newsletterSubscribers,
      unreadMessages,
    ] = await Promise.all([
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.product.count(),
      prisma.product.count({ where: { published: true } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

    return NextResponse.json({
      totalQuotes,
      pendingQuotes,
      totalProducts,
      publishedProducts,
      newsletterSubscribers,
      unreadMessages,
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
