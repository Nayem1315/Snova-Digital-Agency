import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-8">
          The blog post you are looking for does not exist.
        </p>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link to="/blog">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
      <div className="bg-card p-8 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-primary">{post.category}</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {post.date}
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        <div className="aspect-video bg-gradient-hero mb-8 rounded-lg" />
        <div className="prose dark:prose-invert max-w-none">
          <p>{post.excerpt}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin
            porttitor, orci nec nonummy molestie, enim est eleifend mi, non

            fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa,
            scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum
            bibendum augue. Praesent egestas leo in pede. Praesent blandit odio
            eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum
            ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque
            fermentum. Maecenas adipiscing ante non diam.
          </p>
          <p>
            Fusce consectetuer risus a nunc. Aliquam erat volutpat. Nam dui
            mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.
            Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer
            ligula vulputate sem tristique cursus. Nam nulla quam, gravida non,
            commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor.
            Aliquam quam lectus, facilisis auctor, ultrices ut, elementum
            vulputate, nunc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
