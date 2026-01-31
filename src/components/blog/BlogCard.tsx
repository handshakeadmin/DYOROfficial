import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/data/blog-posts";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps): React.JSX.Element {
  return (
    <article
      className={`bg-card rounded-xl border border-border overflow-hidden card-hover ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className={`relative ${
            featured ? "h-64 lg:h-80" : "h-48"
          } bg-background-secondary`}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-muted mb-3">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {post.readTime} min read
            </span>
          </div>
          <h3
            className={`font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors ${
              featured ? "text-xl lg:text-2xl" : "text-lg"
            }`}
          >
            {post.title}
          </h3>
          <p className="text-muted text-sm line-clamp-3">{post.excerpt}</p>
          <div className="mt-4 flex items-center text-primary font-medium text-sm">
            Read More
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
