import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  category: z.enum(["JOURNAL", "CASE_STUDY", "NEWS"]).default("JOURNAL"),
  tags: z.string().optional(),
  published: z.boolean().default(false),
  authorName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { coverImage, ...rest } = parsed.data;

    const existing = await prisma.blogPost.findUnique({
      where: { slug: rest.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        ...rest,
        coverImage: coverImage || undefined,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[POST /api/blog]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    if (limit !== undefined && (isNaN(limit) || limit < 1)) {
      return NextResponse.json(
        { error: "Invalid limit parameter" },
        { status: 400 }
      );
    }

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        ...(category && { category }),
      },
      orderBy: { createdAt: "desc" },
      ...(limit !== undefined && { take: limit }),
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[GET /api/blog]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
