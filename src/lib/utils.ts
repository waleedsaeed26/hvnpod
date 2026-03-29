import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "EGP") {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getVolumeDiscount(quantity: number): number {
  if (quantity >= 10) return 0.12;
  if (quantity >= 6) return 0.08;
  if (quantity >= 3) return 0.05;
  return 0;
}

export function calculateTotal(price: number, quantity: number): number {
  const discount = getVolumeDiscount(quantity);
  return price * quantity * (1 - discount);
}
