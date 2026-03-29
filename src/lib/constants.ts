export const SITE_NAME = "HVNPOD";
export const SITE_TAGLINE = "Premium acoustic privacy. Deployed fast.";
export const SITE_DESCRIPTION = "Premium acoustic pods for focused work — without construction. Designed for offices that need privacy fast.";
export const SITE_URL = "https://hvnpod.com";
export const CONTACT_EMAIL = "info@hvnpod.com";

export const PRODUCT_MODELS = {
  ONE: { name: "HVNPOD One", capacity: "1 person", slug: "hvnpod-one" },
  DUO: { name: "HVNPOD Duo", capacity: "2 persons", slug: "hvnpod-duo" },
  MEET: { name: "HVNPOD Meet", capacity: "4 persons", slug: "hvnpod-meet" },
} as const;

export const PRODUCT_TIERS = {
  CORE: { name: "Core", description: "Essential acoustic package" },
  PLUS: { name: "Plus", description: "Enhanced materials + smart lighting" },
  SIGNATURE: { name: "Signature", description: "Premium finish + conveniences" },
} as const;

export const POD_COLORS = [
  { id: "cream", name: "Cream", hex: "#E8E0D4" },
  { id: "charcoal", name: "Charcoal", hex: "#3A3A3A" },
  { id: "forest", name: "Forest", hex: "#2D5A40" },
  { id: "blue", name: "Blue", hex: "#5B8A9A" },
] as const;

export const VOLUME_DISCOUNTS = [
  { min: 3, max: 5, discount: 5 },
  { min: 6, max: 10, discount: 8 },
  { min: 10, max: Infinity, discount: 12 },
] as const;

export const CATEGORIES = [
  { slug: "acoustic-pods", name: "Acoustic Pods", nameAr: "بودات صوتية", comingSoon: false },
  { slug: "gaming-desks", name: "Gaming & Coding Desks", nameAr: "مكاتب الألعاب والبرمجة", comingSoon: true },
  { slug: "ergonomic-chairs", name: "Ergonomic Chairs", nameAr: "كراسي مريحة", comingSoon: true },
  { slug: "capsule-homes", name: "Capsule Homes", nameAr: "منازل كبسولات", comingSoon: true },
  { slug: "capsule-hotels", name: "Capsule Hotel Rooms", nameAr: "غرف فندقية كبسولات", comingSoon: true },
] as const;

export const NAV_LINKS = [
  { href: "/products", labelKey: "nav.products" },
  { href: "/configure", labelKey: "nav.configure" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/journal", labelKey: "nav.journal" },
  { href: "/contact", labelKey: "nav.contact" },
] as const;

export const QUOTE_STATUSES = ["NEW", "CONTACTED", "QUOTED", "CLOSED"] as const;
export const ASSESSMENT_STATUSES = ["PENDING", "SCHEDULED", "COMPLETED"] as const;
export const BLOG_CATEGORIES = ["JOURNAL", "CASE_STUDY", "NEWS"] as const;
export const USER_ROLES = ["CUSTOMER", "ADMIN"] as const;
