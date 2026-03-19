export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  avatar?: { asset: { _ref: string; url?: string } };
  bio?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  featuredImage?: { asset: { _ref: string; url?: string } };
  author?: Author;
  publishedAt: string;
  isPremium: boolean;
  body?: unknown[];
}
