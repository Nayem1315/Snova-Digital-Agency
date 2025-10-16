import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated: March 2024</p>

        <Card className="p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using DigiStore, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Digital Products</h2>
              <p className="text-muted-foreground mb-4">
                All products sold on DigiStore are digital and delivered electronically. Upon
                successful payment:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You receive a non-exclusive, non-transferable license to use the product</li>
                <li>Products may not be resold or redistributed without explicit permission</li>
                <li>You are responsible for downloading and storing your purchases</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Payment and Refunds</h2>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee on all products. If you're not satisfied
                with your purchase, contact our support team within 30 days for a full refund.
                All payments are processed securely through our payment partners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account. Notify us
                immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on DigiStore, including text, graphics, logos, and software, is the
                property of DigiStore or its content suppliers and is protected by copyright
                and intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                DigiStore shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting. Your continued use of the service constitutes acceptance
                of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at
                legal@digistore.com
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
