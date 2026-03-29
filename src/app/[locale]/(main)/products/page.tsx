import { prisma } from "@/lib/prisma";
import ProductsHero from "@/components/products/products-hero";

export const metadata = {
  title: "Products — HVNPOD",
  description:
    "Explore the full HVNPOD range of premium acoustic pods and workspace solutions.",
};

export default async function ProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return <ProductsHero categories={categories} />;
}
