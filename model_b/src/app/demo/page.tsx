import { Suspense } from "react";
import DemoContent from "./DemoContent";

export const metadata = {
  title: "Demo — The Paywall Times",
  description: "Experience the paywalled blog demo with mock Stripe and ThirdWeb components.",
};

export default function DemoPage() {
  return (
    <Suspense>
      <DemoContent />
    </Suspense>
  );
}
