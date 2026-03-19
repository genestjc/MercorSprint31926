"use client";

import { Post } from "@types";
import AuthorBadge from "./AuthorBadge";
import PaywallOverlay from "../paywall/PaywallOverlay";
import SubscriptionManager from "../subscription/SubscriptionManager";
import { useMembership } from "@/app/components/providers/MembershipContext";

interface BlogPostProps {
  post: Post;
  paragraphs: string[];
}

export default function BlogPost({ post, paragraphs }: BlogPostProps) {
  const { isUnlocked, walletAddress } = useMembership();
  const showPaywall = post.isPremium && !isUnlocked;

  return (
    <article className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="mb-8">
        {post.isPremium && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full mb-4">
            Premium
          </span>
        )}
        <h1 className="font-[family-name:var(--font-title)] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="font-[family-name:var(--font-body)] text-lg text-gray-500 mb-6">
          {post.excerpt}
        </p>
        {post.author && (
          <AuthorBadge author={post.author} publishedAt={post.publishedAt} />
        )}
      </header>

      {/* Body with optional paywall */}
      <div className="relative">
        <div
          className={
            showPaywall
              ? "max-h-[600px] overflow-hidden"
              : ""
          }
        >
          <div className="font-[family-name:var(--font-body)] text-gray-800 leading-relaxed space-y-5 text-[17px]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {showPaywall && <PaywallOverlay />}
      </div>

      {isUnlocked && post.isPremium && walletAddress && (
        <SubscriptionManager walletAddress={walletAddress} />
      )}
    </article>
  );
}
