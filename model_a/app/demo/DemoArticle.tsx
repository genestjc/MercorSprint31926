import { Paywall } from "@/components/Paywall";

const demoPost = {
  title: "The Future of On-Chain Publishing",
  author: "Jane Developer",
  publishedAt: "March 19, 2026",
  premium: true,
  excerpt:
    "A new wave of creator tooling is collapsing the distance between a reader's wallet and a writer's byline. Here's what it means for independent publishing — and why the paywall of the future might be minted, not metered.",
  body: Array.from({ length: 8 }).map(
    (_, i) =>
      `Paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
  ),
};

export function DemoArticle({
  forceStep,
}: {
  forceStep?: "signin" | "pay" | "unlocked";
}) {
  return (
    <main className="mx-auto max-w-2xl px-5 sm:px-6 py-14">
      <header className="mb-10">
        <p className="font-title text-[11px] tracking-[0.25em] text-neutral-400 mb-3">
          {demoPost.premium ? "PREMIUM" : "FREE"}
        </p>
        <h1 className="font-title text-4xl sm:text-5xl leading-[1.05] mb-5">
          {demoPost.title}
        </h1>
        <p className="text-sm text-neutral-500">
          By <span className="text-black">{demoPost.author}</span> ·{" "}
          {demoPost.publishedAt}
        </p>
      </header>

      <p className="text-lg leading-relaxed text-neutral-800 mb-8">
        {demoPost.excerpt}
      </p>

      <Paywall premium={demoPost.premium} forceStep={forceStep}>
        <article className="prose prose-neutral max-w-none space-y-5">
          {demoPost.body.map((p, i) => (
            <p key={i} className="leading-[1.7] text-neutral-800">
              {p}
            </p>
          ))}
        </article>
      </Paywall>

      <footer className="mt-20 pt-6 border-t border-neutral-200 text-xs text-neutral-400">
        Demo page · Stripe modal, ThirdWeb sign-in, NYT-style paywall.
      </footer>
    </main>
  );
}
