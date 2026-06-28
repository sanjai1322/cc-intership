"use client";

import { Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import Card from "./GlassCard";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    description: "Get feedback and build a stronger portfolio.",
    features: [
      "Real-world problem statement",
      "Milestone code/design reviews",
      "Premium verified certificate",
      "Priority project evaluation",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹1,499",
    description: "The complete career-accelerator package.",
    features: [
      "Everything in Starter",
      "Detailed internship report",
      "LinkedIn recommendation",
      "Resume review session",
    ],
    popular: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[var(--color-bg-white)] relative z-10">
      <div className="container-wide">
        <AnimatedSection className="text-center mb-16 max-w-2xl mx-auto" variant="zoom-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
            Transparent Pricing
          </h2>
          <p className="text-[var(--color-text-body)] text-lg">
            Invest in your portfolio. No hidden fees. Select the plan that fits
            your career goals.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <AnimatedSection
              key={plan.name}
              delay={i * 0.12}
              variant="fade-up"
              duration={0.7}
              className="h-full"
            >
              <Card
                className={`h-full flex flex-col relative !p-8 ${
                  plan.popular
                    ? "!border-[var(--color-primary-blue)] border-2 shadow-lg"
                    : ""
                }`}
                hover={false}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--color-secondary-lavender)] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl mb-2 text-[var(--color-text-dark)]">{plan.name}</h3>
                  <div className="font-[var(--font-syne)] text-4xl font-bold text-[var(--color-text-dark)] mb-3">
                    {plan.price}
                  </div>
                  <p className="text-[var(--color-text-body)] text-sm">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-green-50 p-1 shrink-0">
                        <Check size={14} className="text-[var(--color-success-green)]" />
                      </div>
                      <span className="text-[var(--color-text-body)] text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/apply"
                  className={`text-center w-full block transition-colors ${
                    plan.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
