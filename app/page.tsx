import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Pill, ShieldCheck, Truck, ArrowRight, UserCheck, Star } from "lucide-react";

// Server-side database reading
function getFeaturedProducts() {
  try {
    const filePath = path.join(process.cwd(), "cms-backend", "data", "products.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);
    // Return first 3 products as featured
    return products.slice(0, 3);
  } catch (error) {
    console.error("Error reading featured products:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = getFeaturedProducts();
  const heroImage = "https://images.unsplash.com/photo-1622227922682-56c92e523e58?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors">
      
      {/* 1. HERO SECTION WITH IMAGE & LAYERED TEXT */}
      <section 
        className="relative overflow-hidden bg-cover bg-center py-28 md:py-36"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        {/* Visual Vignette Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-teal-900/80 to-transparent dark:from-zinc-950/95 dark:via-zinc-950/80" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center min-h-[380px]">
          {/* Layered Text Content */}
          <div className="max-w-2xl text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-400/25 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
              Verified Board-Certified Online Pharmacy
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Your health is our <br />
              <span className="text-teal-400">highest priority.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-lg">
              Order your prescription and over-the-counter medications safely with temperature-controlled shipping. Double-checked by our licensed pharmacist team.
            </p>

            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-500 hover:shadow-teal-600/35 active:scale-98 transition-all"
              >
                Shop Medications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>


          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="bg-teal-900 py-10 text-white dark:bg-zinc-900 border-y dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white">50k+</div>
            <div className="mt-1 text-xs text-teal-200 dark:text-teal-400 uppercase tracking-wider font-semibold">Patients Served</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">100%</div>
            <div className="mt-1 text-xs text-teal-200 dark:text-teal-400 uppercase tracking-wider font-semibold">Legally Compliant</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">4.9/5</div>
            <div className="mt-1 text-xs text-teal-200 dark:text-teal-400 uppercase tracking-wider font-semibold">Patient Rating</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">24 Hr</div>
            <div className="mt-1 text-xs text-teal-200 dark:text-teal-400 uppercase tracking-wider font-semibold">Average Delivery</div>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS GRID SECTION */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Why Patients Trust AuraRx</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Safeguarding quality, clinical compliance, and quick temperature-controlled logistics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-100 bg-slate-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">100% Certified</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Authentic FDA-approved medications direct from official manufacturers.</p>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-slate-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">Clinical Verification</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Every prescription is thoroughly reviewed by a licensed doctor.</p>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-slate-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">Safe Shipping</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Discreet, temperature-controlled packaging ensuring potency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Featured Medications
              </h2>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                Most popular clinician-recommended pharmaceutical solutions.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {featuredProducts.map((product: any) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Product Image area */}
                <div className="flex h-48 items-center justify-center bg-teal-50/40 p-6 dark:bg-zinc-800/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-md dark:bg-zinc-900 dark:text-teal-400">
                    <Pill className="h-8 w-8 rotate-45" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-teal-50 px-2 py-1 text-2xs font-semibold text-teal-700 uppercase tracking-wider dark:bg-teal-950/40 dark:text-teal-400">
                      {product.category.replace("-", " ")}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-white">
                    <Link href="/products">
                      <span className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-800/60">
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
