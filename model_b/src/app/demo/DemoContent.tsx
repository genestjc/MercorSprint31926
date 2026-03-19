"use client";

import { useSearchParams } from "next/navigation";
import { MembershipProvider } from "@/app/components/providers/MembershipContext";
import ThirdWebProviderWrapper from "@/app/components/providers/ThirdWebProvider";
import BlogPost from "@/app/components/blog/BlogPost";
import { DEMO_POST, DEMO_ARTICLE_PARAGRAPHS } from "@/app/lib/constants";

export default function DemoContent() {
  const searchParams = useSearchParams();
  const initialUnlocked = searchParams.get("success") === "true";

  return (
    <MembershipProvider initialUnlocked={initialUnlocked}>
      <ThirdWebProviderWrapper>
        <BlogPost post={DEMO_POST} paragraphs={DEMO_ARTICLE_PARAGRAPHS} />
      </ThirdWebProviderWrapper>
    </MembershipProvider>
  );
}
