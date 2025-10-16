export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  featured: boolean;
  downloadUrl?: string;
  features?: string[];
}

export const categories = [
  "All Products",
  "Digital Tools",
  "AI Templates",
  "Branding Kits",
  "Marketing Resources",
  "Courses",
  "Templates"
];

export const products: Product[] = [
  {
    id: "1",
    title: "Marketing Dashboard Pro",
    description: "Complete analytics and marketing automation dashboard with real-time insights and campaign tracking.",
    price: 149,
    category: "Digital Tools",
    image: "/src/assets/product-4.jpg",
    rating: 4.9,
    featured: true,
    features: [
      "Real-time campaign analytics",
      "Automated reporting system",
      "Multi-channel integration",
      "Custom KPI tracking",
      "Team collaboration tools"
    ],
    reviews: 342,
    downloadUrl: "/downloads/marketing-dashboard.zip",
  },
  {
    id: "2",
    title: "AI Chatbot Templates",
    description: "Smart chatbot templates powered by AI for customer support, lead generation, and engagement.",
    price: 99,
    category: "AI Templates",
    image: "/src/assets/product-5.jpg",
    rating: 4.8,
    featured: true,
    features: [
      "Pre-trained conversation flows",
      "Easy customization interface",
      "Multi-language support",
      "Analytics dashboard",
      "24/7 automated responses"
    ],
    reviews: 278,
    downloadUrl: "/downloads/ai-chatbot.zip",
  },
  {
    id: "3",
    title: "Complete Brand Identity Kit",
    description: "Professional branding package with logo designs, business cards, letterheads, and brand guidelines.",
    price: 199,
    category: "Branding Kits",
    image: "/src/assets/product-6.jpg",
    rating: 5.0,
    featured: true,
    features: [
      "10+ logo variations",
      "Business card templates",
      "Letterhead designs",
      "Brand style guide",
      "Social media assets"
    ],
    reviews: 456,
    downloadUrl: "/downloads/brand-kit.zip",
  },
  {
    id: "4",
    title: "Social Media Content Planner",
    description: "Organize and schedule your social media content with this comprehensive planning toolkit.",
    price: 79,
    category: "Marketing Resources",
    image: "/src/assets/product-7.jpg",
    rating: 4.7,
    featured: false,
    features: [
      "Monthly content calendar",
      "Post scheduling templates",
      "Engagement tracking",
      "Hashtag library",
      "Performance analytics"
    ],
    reviews: 189,
    downloadUrl: "/downloads/content-planner.zip",
  },
  {
    id: "5",
    title: "Email Marketing Suite",
    description: "Professional email templates and automation workflows for effective email campaigns.",
    price: 129,
    category: "Marketing Resources",
    image: "/src/assets/product-8.jpg",
    rating: 4.8,
    featured: false,
    features: [
      "50+ responsive templates",
      "Automation workflows",
      "A/B testing tools",
      "Subscriber segmentation",
      "Performance tracking"
    ],
    reviews: 312,
    downloadUrl: "/downloads/email-suite.zip",
  },
  {
    id: "6",
    title: "SEO Optimization Toolkit",
    description: "Complete SEO toolkit with keyword research, site audit, and ranking tracking features.",
    price: 169,
    category: "Digital Tools",
    image: "/src/assets/product-9.jpg",
    rating: 4.9,
    featured: false,
    features: [
      "Keyword research tools",
      "Site audit automation",
      "Backlink analysis",
      "Rank tracking",
      "Competitor insights"
    ],
    reviews: 421,
    downloadUrl: "/downloads/seo-toolkit.zip",
  },
  {
    id: "7",
    title: "Brand Style Guide Template",
    description: "Professional brand style guide template to maintain consistent visual identity across all platforms.",
    price: 89,
    category: "Branding Kits",
    image: "/src/assets/product-10.jpg",
    rating: 4.6,
    featured: false,
    features: [
      "Typography guidelines",
      "Color palette system",
      "Logo usage rules",
      "Brand voice guide",
      "Asset templates"
    ],
    reviews: 203,
    downloadUrl: "/downloads/style-guide.zip",
  },
  {
    id: "8",
    title: "AI Content Generator",
    description: "Advanced AI-powered content generation tool for blogs, social media, and marketing copy.",
    price: 149,
    category: "AI Templates",
    image: "/src/assets/product-1.jpg",
    rating: 4.9,
    featured: false,
    features: [
      "Multi-format content generation",
      "SEO optimization",
      "Tone customization",
      "Batch processing",
      "Template library"
    ],
    reviews: 387,
    downloadUrl: "/downloads/ai-content.zip",
  },
  {
    id: "9",
    title: "Analytics Reporting Dashboard",
    description: "Comprehensive analytics dashboard with customizable reports and data visualization tools.",
    price: 139,
    category: "Digital Tools",
    image: "/src/assets/product-11.jpg",
    rating: 4.8,
    featured: false,
    features: [
      "Custom report builder",
      "Interactive charts",
      "Data export options",
      "Automated scheduling",
      "Team sharing"
    ],
    reviews: 294,
    downloadUrl: "/downloads/analytics-dashboard.zip",
  },
  {
    id: "10",
    title: "Website Design Templates",
    description: "Modern, responsive website templates for various industries with easy customization.",
    price: 119,
    category: "Templates",
    image: "/src/assets/product-2.jpg",
    rating: 4.7,
    featured: false,
    features: [
      "20+ template designs",
      "Fully responsive",
      "Easy customization",
      "SEO optimized",
      "Fast loading"
    ],
    reviews: 256,
    downloadUrl: "/downloads/web-templates.zip",
  },
  {
    id: "11",
    title: "Business Presentation Pack",
    description: "Professional presentation templates for business proposals, pitches, and reports.",
    price: 69,
    category: "Templates",
    image: "/src/assets/product-3.jpg",
    rating: 4.5,
    featured: false,
    features: [
      "100+ slide designs",
      "Infographic elements",
      "Data charts",
      "Image placeholders",
      "Multiple themes"
    ],
    reviews: 167,
    downloadUrl: "/downloads/presentation-pack.zip",
  },
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Web Developer",
    content: "The courses here transformed my career! The quality and depth of content are outstanding.",
    avatar: "SJ",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Designer",
    content: "Best digital assets marketplace I've found. High quality products and instant downloads.",
    avatar: "MC",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Entrepreneur",
    content: "The templates saved me months of development time. Absolutely worth every penny!",
    avatar: "ER",
    rating: 5
  }
];

export const blogPosts = [
  {
    id: "1",
    title: "10 Essential Web Development Tools in 2024",
    excerpt: "Discover the must-have tools that will boost your productivity and code quality.",
    date: "2024-03-15",
    category: "Development",
    image: "/src/assets/hero-bg.jpg"
  },
  {
    id: "2",
    title: "The Future of Digital Products",
    excerpt: "Exploring emerging trends in the digital marketplace and what they mean for creators.",
    date: "2024-03-10",
    category: "Industry",
    image: "/src/assets/hero-bg.jpg"
  }
];

export const faqs = [
  {
    question: "How do I access my purchased products?",
    answer: "After purchase, you'll find all your products in your dashboard with instant download links. You'll also receive an email confirmation with access details."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and mobile payment methods like Bkash and Rocket for your convenience."
  },
  {
    question: "Can I get a refund?",
    answer: "Yes! We offer a 30-day money-back guarantee on all products. If you're not satisfied, contact our support team for a full refund."
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes, we offer 20% off on all courses for students. Contact support with your student ID to receive your discount code."
  },
  {
    question: "Are the products licensed for commercial use?",
    answer: "Most of our products come with commercial licenses. Check individual product pages for specific licensing details."
  }
];
