import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/data/blog-posts";

interface BlogPostProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostProps): React.JSX.Element {
  const formatContent = (content: string): React.JSX.Element[] => {
    const lines = content.trim().split("\n");
    const elements: React.JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: "ul" | "ol" | null = null;

    const flushList = (): void => {
      if (currentList.length > 0 && listType) {
        const ListTag = listType;
        elements.push(
          <ListTag
            key={`list-${elements.length}`}
            className={`my-4 pl-6 space-y-2 ${
              listType === "ul" ? "list-disc" : "list-decimal"
            }`}
          >
            {currentList.map((item, i) => (
              <li key={i} className="text-muted">
                {item}
              </li>
            ))}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        flushList();
        continue;
      }

      if (trimmedLine.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={i} className="text-3xl font-bold mt-8 mb-4 first:mt-0">
            {trimmedLine.slice(2)}
          </h1>
        );
      } else if (trimmedLine.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} className="text-2xl font-semibold mt-8 mb-4">
            {trimmedLine.slice(3)}
          </h2>
        );
      } else if (trimmedLine.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
            {trimmedLine.slice(4)}
          </h3>
        );
      } else if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
        flushList();
        elements.push(
          <p key={i} className="font-semibold mt-4 mb-2">
            {trimmedLine.slice(2, -2)}
          </p>
        );
      } else if (trimmedLine.startsWith("- ")) {
        if (listType !== "ul") {
          flushList();
          listType = "ul";
        }
        currentList.push(trimmedLine.slice(2));
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== "ol") {
          flushList();
          listType = "ol";
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ""));
      } else if (trimmedLine.startsWith("|")) {
        flushList();
        const rows: string[][] = [];
        let j = i;
        while (j < lines.length && lines[j].trim().startsWith("|")) {
          const row = lines[j]
            .trim()
            .split("|")
            .filter((cell) => cell.trim() !== "")
            .map((cell) => cell.trim());
          if (!row.every((cell) => /^[-:]+$/.test(cell))) {
            rows.push(row);
          }
          j++;
        }
        i = j - 1;

        if (rows.length > 0) {
          elements.push(
            <div key={i} className="my-6 overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-background-secondary">
                    {rows[0].map((cell, ci) => (
                      <th
                        key={ci}
                        className="border border-border px-4 py-2 text-left font-semibold"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="border border-border px-4 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      } else {
        flushList();
        const formattedText = trimmedLine
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>");
        elements.push(
          <p
            key={i}
            className="text-muted leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      }
    }

    flushList();
    return elements;
  };

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-muted">
            {post.readTime} min read
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 bg-background-secondary">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="prose prose-lg max-w-none">{formatContent(post.content)}</div>

      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-background-secondary text-muted text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="bg-background-secondary rounded-xl p-6">
          <p className="text-sm text-muted">
            <strong>Disclaimer:</strong> This article is for informational and
            educational purposes only. Research peptides are intended for
            laboratory and research use only. They are not approved for human
            consumption or therapeutic use without proper regulatory approval.
            Always consult with qualified professionals and follow all
            applicable regulations.
          </p>
        </div>
      </footer>
    </article>
  );
}
