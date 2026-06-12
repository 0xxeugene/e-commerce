"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Pill, Search, SlidersHorizontal, Eye, ShoppingCart, Star, X, Info } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviewsCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products and categories on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default order
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-zinc-950/20 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Certified Pharmacy Store
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Browse our verified inventory of medical supplies, prescription therapies, and health wellness products.
          </p>
        </div>

        {/* Search, Filter, Sort Controls Panel */}
        <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search medication name or ailment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-teal-500 dark:focus:bg-zinc-900"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <label htmlFor="sort-dropdown" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sort by</label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium outline-none dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="default">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Patient Rating</option>
              </select>
            </div>
          </div>

          {/* Dynamic Categories Scrollbar */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === "all"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl bg-white border border-dashed border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="rounded-full bg-teal-50 p-4 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400">
              <Pill className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-950 dark:text-white">No medications found</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              We couldn't find any pharmacy products matching your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-6 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white hover:border-teal-500/30 hover:shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Image Section */}
                <div className="relative flex h-44 items-center justify-center bg-teal-50/40 p-4 dark:bg-zinc-800/40">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm dark:bg-zinc-900 dark:text-teal-400">
                    <Pill className="h-6 w-6 rotate-45 animate-pulse" />
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="rounded-lg bg-white p-2 text-zinc-600 shadow-md hover:text-teal-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-teal-400"
                      title="Quick View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-teal-50 px-2 py-0.5 text-3xs font-bold text-teal-700 uppercase tracking-wider dark:bg-teal-950/40 dark:text-teal-400">
                      {product.category.replace("-", " ")}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 min-h-[32px]">
                    {product.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 active:scale-95 transition-all"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Body */}
            <div className="flex flex-col md:flex-row gap-6 p-8">
              {/* Product Visual Area */}
              <div className="flex-1 min-h-[160px] flex items-center justify-center bg-teal-50/50 rounded-xl dark:bg-zinc-800/40">
                <Pill className="h-16 w-16 text-teal-600 rotate-45" />
              </div>

              {/* Product Info Area */}
              <div className="flex-1 space-y-4">
                <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xxs font-bold text-teal-700 uppercase tracking-wider dark:bg-teal-950/40 dark:text-teal-400">
                  {selectedProduct.category.replace("-", " ")}
                </span>
                <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-amber-500 font-semibold">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-xs text-zinc-400 font-normal">({selectedProduct.reviewsCount} patient reviews)</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Stock alert */}
                <div className="flex items-center gap-2 rounded-xl bg-teal-50/30 p-3 border border-teal-100/10 text-zinc-500 dark:bg-zinc-800/40">
                  <Info className="h-4.5 w-4.5 text-teal-600 shrink-0" />
                  <span className="text-xs">
                    Stock status: <strong className="text-teal-600 font-bold">{selectedProduct.stock} packets available</strong> for secure dispatch.
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-850">
                  <span className="text-2xl font-black text-zinc-950 dark:text-white">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-500"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Secure Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
