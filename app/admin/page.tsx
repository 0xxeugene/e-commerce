"use client";

import React, { useState, useEffect } from "react";
import { Pill, Plus, Trash2, Package, Layers, BarChart3, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

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

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Product Form states
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodStock, setProdStock] = useState("");
  
  // Category Form states
  const [newCatName, setNewCatName] = useState("");

  // Alert system
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch shop data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
        if (catData.length > 0 && !prodCategory) {
          setProdCategory(catData[0].slug); // Set default select value
        }
      }
    } catch (error) {
      triggerAlert("error", "Failed to connect to databases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerAlert = (type: "success" | "error", text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      triggerAlert("error", "Category name is required.");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName })
      });

      const data = await res.json();

      if (res.ok) {
        triggerAlert("success", `Category "${data.name}" added successfully.`);
        setNewCatName("");
        fetchData();
      } else {
        triggerAlert("error", data.error || "Failed to add category.");
      }
    } catch (error) {
      triggerAlert("error", "Connection error. Failed to add category.");
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (slug: string) => {
    // Check if category is used by products
    const isUsed = products.some(p => p.category === slug);
    if (isUsed) {
      triggerAlert("error", "Cannot delete. Category is currently assigned to products.");
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${slug}"?`)) return;

    try {
      const res = await fetch(`/api/categories?slug=${slug}`, {
        method: "DELETE"
      });

      if (res.ok) {
        triggerAlert("success", "Category deleted successfully.");
        fetchData();
      } else {
        const data = await res.json();
        triggerAlert("error", data.error || "Failed to delete category.");
      }
    } catch (error) {
      triggerAlert("error", "Connection error. Failed to delete category.");
    }
  };

  // Add Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice || !prodCategory) {
      triggerAlert("error", "Please fill in all required fields (Name, Price, Category).");
      return;
    }

    const priceNum = parseFloat(prodPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerAlert("error", "Price must be a valid number greater than zero.");
      return;
    }

    const payload = {
      name: prodName,
      price: priceNum,
      category: prodCategory,
      description: prodDescription,
      stock: prodStock ? parseInt(prodStock) : 100,
      image: `/images/default-drug.jpg`
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        triggerAlert("success", `Product "${data.name}" uploaded successfully.`);
        // Reset form
        setProdName("");
        setProdPrice("");
        setProdDescription("");
        setProdStock("");
        fetchData();
      } else {
        const data = await res.json();
        triggerAlert("error", data.error || "Failed to upload product.");
      }
    } catch (error) {
      triggerAlert("error", "Connection error. Failed to upload product.");
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete product "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        triggerAlert("success", "Product deleted successfully.");
        fetchData();
      } else {
        const data = await res.json();
        triggerAlert("error", data.error || "Failed to delete product.");
      }
    } catch (error) {
      triggerAlert("error", "Connection error. Failed to delete product.");
    }
  };

  // Stats calculation
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const averagePrice = products.reduce((acc, curr) => acc + curr.price, 0) / (totalProducts || 1);
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-zinc-950/20 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              CMS Administration Portal
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Manage inventories, configure dynamic categories, and review product catalogs.
            </p>
          </div>
          <div className="inline-flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab("products")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "products"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              Manage Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "categories"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Manage Categories
            </button>
          </div>
        </div>

        {/* Floating Success/Error Alert Banner */}
        {alertMsg && (
          <div
            className={`fixed top-20 right-8 z-50 rounded-2xl p-4 shadow-xl border flex items-center gap-3 animate-slide-in-right ${
              alertMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-850 dark:text-emerald-400"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-850 dark:text-red-400"
            }`}
          >
            {alertMsg.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-semibold">{alertMsg.text}</span>
          </div>
        )}

        {/* Dashboard Analytics Bar */}
        <section className="mb-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Products</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">{totalProducts}</span>
              <span className="text-xxs text-teal-600 font-semibold dark:text-teal-400">Live Catalog</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Categories</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">{totalCategories}</span>
              <span className="text-xxs text-teal-600 font-semibold dark:text-teal-400">Customizable</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Average Unit Cost</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">${averagePrice.toFixed(2)}</span>
              <span className="text-xxs text-zinc-400">Retail price</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Out of Stock Alert</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-black ${outOfStockProducts > 0 ? "text-amber-500 animate-pulse" : "text-zinc-900 dark:text-white"}`}>{outOfStockProducts}</span>
              <span className="text-xxs text-zinc-400">Items requiring reorder</span>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-1 space-y-6">
              {activeTab === "products" ? (
                /* ADD PRODUCT FORM */
                <div className="rounded-2xl bg-white border border-zinc-150 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40">
                      <Plus className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Upload Medicine</h2>
                  </div>

                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Paracetamol 500mg"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Price ($ USD) *</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 12.99"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          required
                          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Initial Stock</label>
                        <input
                          type="number"
                          placeholder="e.g. 100"
                          value={prodStock}
                          onChange={(e) => setProdStock(e.target.value)}
                          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category *</label>
                      {categories.length === 0 ? (
                        <div className="text-xs text-red-500 dark:text-red-400 bg-red-50/50 p-2 rounded-lg border border-red-100/10">
                          Please create a category first in the Category Manager tab!
                        </div>
                      ) : (
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          required
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        rows={4}
                        placeholder="Clinical descriptions, ingredients, dosages..."
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={categories.length === 0}
                      className="w-full rounded-xl bg-teal-600 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-teal-500 disabled:opacity-50 transition-all"
                    >
                      Publish to Store
                    </button>
                  </form>
                </div>
              ) : (
                /* ADD CATEGORY FORM */
                <div className="rounded-2xl bg-white border border-zinc-150 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40">
                      <Plus className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Create Custom Category</h2>
                  </div>

                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Skin Care"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-950"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-teal-600 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-teal-500 transition-all"
                    >
                      Create Category
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* List Column */}
            <div className="lg:col-span-2">
              {activeTab === "products" ? (
                /* PRODUCTS TABLE */
                <div className="rounded-2xl bg-white border border-zinc-150 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Uploaded Products ({totalProducts})</h2>
                  </div>
                  
                  {products.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                      No products available. Add one using the form on the left.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-800">
                            <th className="px-6 py-3 font-semibold text-zinc-500">Name</th>
                            <th className="px-6 py-3 font-semibold text-zinc-500">Category</th>
                            <th className="px-6 py-3 font-semibold text-zinc-500">Price</th>
                            <th className="px-6 py-3 font-semibold text-zinc-500">Stock</th>
                            <th className="px-6 py-3 font-semibold text-zinc-500 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                              <td className="px-6 py-4 font-medium text-zinc-950 truncate max-w-[160px] dark:text-white">
                                {p.name}
                              </td>
                              <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                                {p.category.replace("-", " ")}
                              </td>
                              <td className="px-6 py-4 font-semibold text-teal-600 dark:text-teal-400">
                                ${p.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                                  {p.stock}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="text-zinc-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                  title="Delete product"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                /* CATEGORIES TABLE */
                <div className="rounded-2xl bg-white border border-zinc-150 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Configured Categories ({totalCategories})</h2>
                  </div>
                  
                  {categories.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                      No categories configured. Create a custom category on the left.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-800">
                            <th className="px-6 py-3 font-semibold text-zinc-500">Category Name</th>
                            <th className="px-6 py-3 font-semibold text-zinc-500">URL Slug</th>
                            <th className="px-6 py-3 font-semibold text-zinc-500 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                          {categories.map((c) => (
                            <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                              <td className="px-6 py-4 font-medium text-zinc-950 dark:text-white">
                                {c.name}
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                {c.slug}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleDeleteCategory(c.slug)}
                                  className="text-zinc-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                  title="Delete category"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
