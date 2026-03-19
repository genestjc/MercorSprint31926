import { Author } from "@types";

interface AuthorBadgeProps {
  author: Author;
  publishedAt: string;
}

export default function AuthorBadge({ author, publishedAt }: AuthorBadgeProps) {
  const date = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
        {author.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{author.name}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}
