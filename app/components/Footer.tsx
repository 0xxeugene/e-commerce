"use client";

import React from "react";
import Link from "next/link";
import { Pill, ShieldAlert, Heart, Truck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Pill className="h-4 w-4 rotate-45" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Aura<span className="text-teal-600 dark:text-teal-400">Rx</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Providing certified, safe, and professional pharmaceutical products directly to your doorstep. Verified by board-certified doctors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-zinc-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-zinc-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                  All Medications
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-zinc-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-zinc-500 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">
                  CMS Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white uppercase tracking-wider">
              Help & Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-zinc-500 dark:text-zinc-400">
                100 Medical Plaza, Suite 400
              </li>
              <li className="text-sm text-zinc-500 dark:text-zinc-400">
                Health City, HC 94102
              </li>
              <li className="text-sm text-zinc-500 dark:text-zinc-400">
                +1 (800) 555-0199 (Mon-Fri)
              </li>
              <li>
                <a href="mailto:support@aurarx.com" className="text-sm text-teal-600 hover:underline dark:text-teal-400">
                  support@aurarx.com
                </a>
              </li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white uppercase tracking-wider">
              Our Guarantees
            </h3>

            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Truck className="h-5 w-5 text-teal-600 shrink-0" />
              <span className="text-xs">Secure Temperature-Controlled Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Heart className="h-5 w-5 text-teal-600 shrink-0" />
              <span className="text-xs">100% Patient Privacy Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Area */}
        <div className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="rounded-xl bg-teal-50/50 p-4 flex gap-3 border border-teal-100/10 dark:bg-zinc-900/30 dark:border-zinc-800">
            <ShieldAlert className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <strong>Medical Disclaimer:</strong> AuraRx is a fully licensed online pharmaceutical catalog. Content on this site is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with your primary healthcare physician or a qualified clinical pharmacist before starting any new medication regime, changing dosing, or relying on nutritional supplements.
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-zinc-400">
            &copy; {currentYear} AuraRx Inc. All rights reserved. Registered Pharmacy Lic #PH-987441.
          </p>
        </div>
      </div>
    </footer>
  );
}
