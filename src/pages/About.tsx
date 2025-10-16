import { Card } from "@/components/ui/card";
import { Users, Target, Award } from "lucide-react";

const About = () => {
  const team = [
    { name: "Alex Johnson", role: "CEO & Founder", initials: "AJ" },
    { name: "Sarah Williams", role: "Head of Design", initials: "SW" },
    { name: "Michael Chen", role: "Lead Developer", initials: "MC" },
    { name: "Emily Davis", role: "Marketing Director", initials: "ED" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">About Snova Digital Agency</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're on a mission to empower creators and professionals with premium digital products
          that help them achieve their goals and bring their ideas to life.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Card className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-muted-foreground">
            To provide high-quality digital products that empower creators worldwide
          </p>
        </Card>
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-3">Our Community</h3>
          <p className="text-muted-foreground">
            Over 50,000 satisfied customers and growing every day
          </p>
        </Card>
        <Card className="p-8 text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-3">Our Quality</h3>
          <p className="text-muted-foreground">
            Every product is carefully curated and vetted for excellence
          </p>
        </Card>
      </div>

      {/* Team */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <Card key={i} className="p-6 text-center hover-lift">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4">
                {member.initials}
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Story */}
      <Card className="p-12">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Founded in 2020, Snova Digital Agency began with a simple idea: make high-quality digital products
            accessible to everyone. What started as a small marketplace has grown into a thriving
            platform serving creators, professionals, and businesses worldwide from our base in Dhaka, Bangladesh.
          </p>
          <p>
            Our team of passionate creators and developers work tirelessly to curate the best
            digital products, from educational courses to creative assets, ensuring that every
            item meets our high standards of quality and value.
          </p>
          <p>
            Today, we're proud to serve over 50,000 customers globally, helping them learn new
            skills, build better products, and grow their businesses with our premium digital
            resources.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default About;
