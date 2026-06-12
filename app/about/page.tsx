import React from "react";
import { ShieldCheck, Users, HelpCircle, Activity, Award, CheckCircle } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Jenkins, Pharm.D.",
      role: "Chief Pharmacist & Medical Officer",
      edu: "University of California, San Francisco (UCSF)",
      bio: "Over 15 years overseeing clinical pharmacy settings. Expert in medicine compatibility, dosage adjustments, and safety protocols.",
      badge: "Clinical Lead"
    },
    {
      name: "Dr. Aaron Chen, Pharm.D.",
      role: "Director of Pharmaceutical Integrity",
      edu: "Johns Hopkins University",
      bio: "Manages temperature-controlled shipping audits and cold-chain integrity protocols. Ensures absolute authenticity of all FDA approved products.",
      badge: "Quality Assurance"
    },
    {
      name: "Dr. Maya Patel, MD",
      role: "Patient Care Lead & Clinical Director",
      edu: "Harvard Medical School",
      bio: "Double board-certified in Internal Medicine. Dr. Patel advises on patient counseling procedures and digital prescription validation schemas.",
      badge: "Clinical Advisor"
    }
  ];

  const faqs = [
    {
      q: "How does AuraRx verify prescription medications?",
      a: "Our clinical system securely integrates with doctor prescribing networks. When you place a prescription order, our clinical pharmacy team verifies the dosage and logs validation details directly with your primary care provider."
    },
    {
      q: "How are medications shipped?",
      a: "Medications are shipped in temperature-controlled, hermetically sealed, discreet packaging. This protects sensitive enzymes or hormones (like insulin or vaccines) and guards your medical privacy."
    },
    {
      q: "Is AuraRx a fully licensed pharmacy store?",
      a: "Yes. AuraRx is officially licensed under Registration Lic #PH-987441. We operate in compliance with national pharmaceutical boards and standard HIPAA safety regulations."
    },
    {
      q: "Can I cancel or return my medications?",
      a: "Under federal health guidelines, prescription medications cannot be returned once dispensed. However, if there is a shipping issue, cold-chain violation, or pharmacist error, we will dispatch an overnight replacement free of charge."
    }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-zinc-950/20 py-16 transition-colors">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full space-y-16">
        
        {/* Header Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
            <Activity className="h-3.5 w-3.5" />
            Learn Our Health Ethics & Licensing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Safe. Professional. Trusted.
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            AuraRx was founded by clinical pharmacists to simplify access to life-essential medications without compromising safety, verification, or patient privacy.
          </p>
        </section>

        {/* Section 1: Our Ethics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl bg-white p-6 border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">Strict Compliance</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We adhere strictly to state and federal healthcare licensing guidelines. Every product is double-checked by a pharmacist prior to dispatch.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">Certified Sourcing</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We buy directly from vetted pharmaceutical supply chains, guaranteeing that your drugs are 100% genuine and safe.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">Patient Support</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your patient experience is personal. We provide prompt support, clinical counseling guidance, and transparent medication billing.
            </p>
          </div>
        </section>

        {/* Section 2: Clinical Advisors / Team */}
        <section className="space-y-8">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Meet Our Board-Certified Team
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Licensed healthcare professionals supervising our packaging, distribution, and prescriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl bg-white border border-zinc-150 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div className="space-y-4">
                  <div className="inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-3xs font-bold text-teal-700 uppercase tracking-wider dark:bg-teal-950/40 dark:text-teal-400">
                    {member.badge}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{member.name}</h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">{member.role}</p>
                  <p className="text-xxs text-zinc-400 leading-normal">{member.edu}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-semibold border-t border-zinc-50 pt-4 dark:border-zinc-800">
                  <CheckCircle className="h-3.5 w-3.5 fill-current text-white dark:text-zinc-900" />
                  Pharmacist License Verified
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: FAQ */}
        <section className="space-y-8 border-t border-zinc-200 pt-16 dark:border-zinc-800">
          <div className="text-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40 mb-3">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Patient Frequently Asked Questions
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Clear answers regarding ordering, health compliance, shipping and safety.
            </p>
          </div>

          <div className="mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex gap-2">
                  <span className="text-teal-600 font-extrabold dark:text-teal-400">Q:</span>
                  {faq.q}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
