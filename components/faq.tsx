"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  sectionLabel?: string
}

export function FAQ({ items, sectionLabel = "FAQ" }: FAQProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ink">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-flame text-xs font-medium tracking-wider uppercase mb-4">
            {sectionLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-cream">
            questions?{" "}
            <span className="text-flame">answered.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-hairline rounded-xl px-6 bg-ink2 data-[state=open]:border-flame/30"
              >
                <AccordionTrigger className="text-left text-cream hover:text-flame hover:no-underline py-5 text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-cream2 pb-5 text-sm leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
