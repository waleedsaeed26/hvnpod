import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const siteAssessmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().min(1, "Company is required"),
  address: z.string().optional(),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = siteAssessmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const assessment = await prisma.siteAssessment.create({
      data: parsed.data,
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/site-assessment]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
