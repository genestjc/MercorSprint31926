import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-05-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source: Parameters<typeof builder.image>[0]) =>
  builder.image(source);

/* ---------------- GROQ ---------------- */

export const POST_QUERY = /* groq */ `
  *[_type == "post" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    premium,
    body,
    publishedAt,
    coverImage,
    author->{ name, "slug": slug.current, avatar, bio }
  }
`;

export const AUTHOR_QUERY = /* groq */ `
  *[_type == "author" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    avatar,
    bio,
    twitter,
    website,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc){
      title, "slug": slug.current, excerpt, premium, publishedAt
    }
  }
`;
