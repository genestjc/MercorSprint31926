import { DemoArticle } from "../DemoArticle";

/** Forced step 1 — not signed in. */
export default function PaywallStep() {
  return <DemoArticle forceStep="signin" />;
}
