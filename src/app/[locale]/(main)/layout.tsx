import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/layout/page-loader";
import { PageTransition } from "@/components/layout/page-transition";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageLoader />
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
