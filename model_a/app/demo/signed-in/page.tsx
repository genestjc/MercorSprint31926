import { DemoArticle } from "../DemoArticle";

/** Forced step 2 — wallet connected, not yet paid. Shows Stripe + mint. */
export default function SignedInStep() {
  return <DemoArticle forceStep="pay" />;
}
