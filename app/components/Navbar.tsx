"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Pill, ShoppingCart, Menu, X, Plus, Minus, Trash2 } from "lucide-react";

export default function Navbar() {
  const { totalCount, totalPrice, cart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop Medications", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "CMS Admin", href: "/admin" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-teal-50/10 bg-white/80 backdrop-blur-md transition-colors dark:bg-zinc-950/80 dark:border-zinc-800/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 transition-transform group-hover:scale-105">
                <Pill className="h-5 w-5 rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Aura<span className="text-teal-600 dark:text-teal-400">Rx</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:text-teal-600 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-teal-400"
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 md:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="border-t border-zinc-100 bg-white py-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex flex-col gap-2 px-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Cart Slider Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-transform dark:bg-zinc-900">
              <div className="flex h-full flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Your Pharmacy Cart</h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 rounded-full bg-teal-50 p-4 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400">
                        <Pill className="h-8 w-8" />
                      </div>
                      <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Cart is empty</h3>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Add prescription or OTC medicines to start.
                      </p>
                      <Link
                        href="/products"
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-500"
                      >
                        Browse Store
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-zinc-800 dark:text-teal-400">
                            <Pill className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-zinc-950 truncate dark:text-white">
                              {item.name}
                            </h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                              {item.category.replace("-", " ")}
                            </p>
                            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                              ${item.price.toFixed(2)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-semibold px-1 text-zinc-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer and Checkout */}
                {cart.length > 0 && (
                  <div className="px-6 py-5 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Items Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                        <span>Estimated Shipping</span>
                        <span className="text-green-600 font-medium">FREE</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-zinc-950 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <span>Total Price</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Checkout complete! Thank you for ordering from AuraRx (Mock).")}
                      className="mt-6 w-full rounded-xl bg-teal-600 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-teal-500 active:scale-99 transition-all"
                    >
                      Secure checkout
                    </button>
                    <p className="mt-2.5 text-center text-xxs text-zinc-400">
                      🔒 Secured with 256-bit SSL encryption. Prescriptions are checked by board-certified doctors.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
