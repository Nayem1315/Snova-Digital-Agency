import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: March 2024</p>

        <Card className="p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account,
                make a purchase, or contact us for support. This may include your name, email address,
                billing information, and other contact details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process your orders and deliver digital products</li>
                <li>Send you order confirmations and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send you marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share
                your information with service providers who assist us in operating our website and
                conducting our business, subject to confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at
                privacy@digistore.com
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
