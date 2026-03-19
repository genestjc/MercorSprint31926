import { client } from "./client";
import { Post } from "@types";

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  featuredImage,
  "author": author->{_id, name, slug, avatar, bio},
  publishedAt,
  isPremium,
  body
}`;

const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  featuredImage,
  "author": author->{_id, name, slug, avatar, bio},
  publishedAt,
  isPremium,
  body
}`;

export async function getPosts(): Promise<Post[]> {
  if (!client) return [];
  return client.fetch(POSTS_QUERY);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!client) return null;
  return client.fetch(POST_BY_SLUG_QUERY, { slug });
}
