import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { faqs } from "@/lib/mockData";

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about our products and services
        </p>
      </div>

      <Card className="p-8 max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default FAQ;
