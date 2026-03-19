import Link from "next/link";
import { getPosts } from "@sanity/lib/queries";
import { DEMO_POST, SITE_NAME } from "./lib/constants";
import type { Post } from "@types";

export default async function HomePage() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch {
    // Sanity not configured — fall through to fallback
  }

  const hasPosts = posts.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-[family-name:var(--font-title)] text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          {SITE_NAME}
        </h1>
        <p className="text-gray-500 text-lg">
          Premium journalism, powered by decentralized technology
        </p>
      </header>

      <div className="space-y-6">
        {hasPosts ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <>
            {/* Fallback demo card */}
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                {DEMO_POST.isPremium && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(DEMO_POST.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-title)] text-xl font-bold text-gray-900 mb-2">
                {DEMO_POST.title}
              </h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {DEMO_POST.excerpt}
              </p>
              <Link
                href="/demo"
                className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
              >
                Read article &rarr;
              </Link>
            </div>

            <div className="text-center py-8 text-sm text-gray-400">
              <p>
                Connect Sanity CMS to see your published posts here.
              </p>
              <p className="mt-1">
                Or{" "}
                <Link href="/demo" className="text-indigo-600 hover:underline">
                  view the demo
                </Link>{" "}
                to see the paywall in action.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        {post.isPremium && (
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            Premium
          </span>
        )}
        <span className="text-xs text-gray-400">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <h2 className="font-[family-name:var(--font-title)] text-xl font-bold text-gray-900 mb-2">
        {post.title}
      </h2>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
      {post.author && (
        <p className="text-xs text-gray-400">By {post.author.name}</p>
      )}
    </div>
  );
}
