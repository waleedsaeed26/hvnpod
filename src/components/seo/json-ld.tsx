export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "HVNPOD",
          url: "https://hvnpod.com",
          logo: "https://hvnpod.com/logo.png",
          description: "Premium acoustic privacy pods for modern workspaces",
          email: "info@hvnpod.com",
          address: {
            "@type": "PostalAddress",
            addressCountry: "EG",
            addressLocality: "Cairo",
          },
          sameAs: [
            "https://instagram.com/hvnpod",
            "https://linkedin.com/company/hvnpod",
          ],
        }),
      }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  price: number;
  currency?: string;
  sku: string;
  image?: string;
}

export function ProductJsonLd({ name, description, price, currency = "EGP", sku, image }: ProductJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          description,
          sku,
          image: image ?? "https://hvnpod.com/images/og-default.jpg",
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "HVNPOD" },
          },
        }),
      }}
    />
  );
}
