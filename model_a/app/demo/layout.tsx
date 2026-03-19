import Link from "next/link";

const steps = [
  { href: "/demo", label: "Live" },
  { href: "/demo/paywall", label: "1 · Sign in" },
  { href: "/demo/signed-in", label: "2 · Pay" },
  { href: "/demo/unlocked", label: "3 · Unlocked" },
];

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-2xl px-5 sm:px-6 py-3 flex gap-1 text-xs font-title tracking-wide">
          {steps.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-3 py-1.5 hover:bg-neutral-100 border border-transparent hover:border-neutral-300"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </nav>
      {children}
    </>
  );
}
