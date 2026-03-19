import { Post, Author } from "@types";

export const DEMO_AUTHOR: Author = {
  _id: "demo-author",
  name: "Alexandra Chen",
  slug: { current: "alexandra-chen" },
  bio: "Senior reporter covering the intersection of technology, finance, and decentralized systems.",
};

export const DEMO_POST: Post = {
  _id: "demo-post-1",
  title: "The Rise of Decentralized Media: Why Blockchain Could Save Journalism",
  slug: { current: "rise-of-decentralized-media" },
  excerpt:
    "As trust in traditional media erodes and advertising revenue dries up, a new generation of journalists is turning to blockchain technology to build sustainable, censorship-resistant news platforms.",
  publishedAt: "2026-03-15T09:00:00Z",
  isPremium: true,
  author: {
    _id: "demo-author",
    name: "Alexandra Chen",
    slug: { current: "alexandra-chen" },
    bio: "Senior reporter covering the intersection of technology, finance, and decentralized systems.",
  },
  body: [],
};

export const DEMO_ARTICLE_PARAGRAPHS = [
  "As trust in traditional media continues to erode and advertising revenue dries up, a new generation of journalists and technologists is turning to blockchain technology to build sustainable, censorship-resistant news platforms. The promise is bold: a future where journalism is funded directly by readers, where editorial independence is guaranteed by smart contracts, and where no single entity can silence a story.",

  "The numbers paint a stark picture of the crisis facing traditional media. Over the past decade, newspaper advertising revenue has fallen by more than 60 percent. Thousands of local newspapers have shuttered, leaving vast swaths of the country in so-called 'news deserts.' The surviving outlets increasingly depend on a handful of tech platforms for distribution -- platforms whose algorithms prioritize engagement over accuracy, and whose business models treat journalism as just another form of content.",

  "Enter decentralized media. Projects like Civil, Mirror, and Paragraph have pioneered a model where articles are published on-chain, subscriptions are managed through token-gated access, and writers retain full ownership of their work. Instead of relying on advertising middlemen, these platforms let readers pay creators directly using cryptocurrency — often through microtransactions so small they barely register in a reader's wallet.",

  "The technical architecture is surprisingly elegant. A journalist writes and publishes to a decentralized content network — typically IPFS or Arweave — ensuring the article cannot be taken down by any single server operator. Access control is handled by NFTs or token gates: readers who hold a specific token in their wallet can unlock premium content. Payment flows through smart contracts that automatically split revenue between writers, editors, and the platform, with every transaction recorded on a public ledger.",

  '"What excites me most is the alignment of incentives," says Maya Rodriguez, founder of Blockpress, a decentralized newsroom that launched last year. "In the old model, the reader is the product — their attention is sold to advertisers. In our model, the reader is the customer. We succeed only if we produce journalism worth paying for."',

  "Critics argue that decentralized media faces significant hurdles. Cryptocurrency remains confusing for mainstream users, and the volatile nature of token prices can make subscription costs unpredictable. There are also questions about accountability: if content truly cannot be removed, how do platforms handle defamation, misinformation, or illegal material? These are not hypothetical concerns — they are active debates within the community.",

  "Yet the momentum is undeniable. Mirror, one of the earliest writing platforms on Ethereum, has seen over 100,000 articles published since its launch. Paragraph, which offers token-gated newsletters, recently raised $5 million in seed funding and counts several Pulitzer Prize-winning journalists among its users. Even traditional media companies are experimenting: The Associated Press has sold NFT photography, and TIME Magazine launched a Web3 community for subscribers.",

  "Perhaps the most compelling argument for decentralized media is not technological but philosophical. In an era of deepfakes, AI-generated text, and state-sponsored disinformation, the ability to cryptographically verify the provenance of a piece of journalism — to prove who wrote it, when it was published, and that it has not been altered — may become not just valuable but essential. The blockchain, for all its hype and speculation, offers something journalism desperately needs: an immutable record of truth.",
];

export const SUBSCRIPTION_PRICE = "$9.99/month";
export const SITE_NAME = "The Paywall Times";
