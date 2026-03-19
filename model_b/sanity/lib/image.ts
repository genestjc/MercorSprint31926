import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = client ? imageUrlBuilder(client) : null;

export function urlFor(source: { asset: { _ref: string } }) {
  if (!builder) return null;
  return builder.image(source);
}
