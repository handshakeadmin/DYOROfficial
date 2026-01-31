import type { Metadata } from "next";
import { blogPosts, getAllCategories, getFeaturedPosts } from "@/data/blog-posts";
import { BlogCard } from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog | DYORWellness",
  description:
    "Educational articles and research updates about peptides, laboratory best practices, and scientific advancements in the field.",
};

export default function BlogPage(): React.JSX.Element {
  const featuredPosts = getFeaturedPosts();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-scientific text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Research Blog</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Stay informed with the latest insights on peptide research, laboratory
            best practices, and scientific developments in our field.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
            All Posts
          </span>
          {categories.map((category) => (
            <span
              key={category}
              className="px-4 py-2 bg-background-secondary text-muted rounded-full text-sm font-medium hover:bg-background-tertiary cursor-pointer transition-colors"
            >
              {category}
            </span>
          ))}
        </div>

        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section className="mt-16 bg-card rounded-xl border border-border p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted mb-6 max-w-xl mx-auto">
            Subscribe to receive the latest research updates, educational content,
            and exclusive offers directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-light transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-muted mt-4">
            By subscribing, you agree to receive marketing communications. You can
            unsubscribe at any time.
          </p>
        </section>
      </div>
    </div>
  );
}
