import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Always visible above the paywall fold.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "premium",
      title: "Premium content",
      description:
        "Toggle ON to lock the body behind the paywall. Requires active membership NFT or Stripe subscription.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      premium: "premium",
      media: "coverImage",
    },
    prepare({ title, author, premium, media }) {
      return {
        title,
        subtitle: `${premium ? "🔒 Premium" : "Free"} · ${author ?? "—"}`,
        media,
      };
    },
  },
});
