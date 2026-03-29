export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hvn-white flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-hvn-black tracking-wider font-[family-name:var(--font-heading)]">
          HVNPOD
        </h1>
      </div>
      {children}
    </div>
  );
}
