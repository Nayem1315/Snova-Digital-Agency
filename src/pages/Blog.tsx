import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/mockData";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Insights, tips, and updates from the DigiStore team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, i) => (
          <Card key={i} className="overflow-hidden hover-lift">
            <div className="h-48 bg-gradient-hero" />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-medium text-primary">{post.category}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{post.title}</h3>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`}>
                <Button variant="ghost" className="p-0">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;
