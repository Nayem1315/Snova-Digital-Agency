import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message too long"),
});

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
        toast.error("You must be logged in to send a message.");
        return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      // Validate input
      contactSchema.parse(data);

      const messageData = {
        ...data,
        timestamp: new Date(),
        submitted_by_user: user.uid,
      };

      // Save to Firestore
      const collectionRef = collection(db, "contact_messages");
      await addDoc(collectionRef, messageData);
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      e.currentTarget.reset();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Firestore Error:", error);
        toast.error(error.message || "Failed to send message");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Have a question? We'd love to hear from you.
        </p>
      </div>
      
      {!isAuthReady && (
        <div className="flex justify-center items-center h-20 text-blue-600 font-semibold mb-6">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Connecting to secure service...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ opacity: isAuthReady ? 1 : 0.5 }}>
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" maxLength={100} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" maxLength={255} required />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="How can we help?" maxLength={200} required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  maxLength={2000}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading || !user}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">info@snovadigitalagency.com</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground">+880 183 128 6643</p>
                <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-muted-foreground">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </Card>

          {/* Map placeholder */}
          <Card className="p-0 overflow-hidden">
            <div className="h-64 bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
