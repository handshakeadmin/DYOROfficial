"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductAIAssist } from "@/components/admin/ai";
import { useAdminAI } from "@/components/admin/ai";
import { ProductAutofillData } from "@/types/admin-ai";

interface ProductDetail {
  id: string;
  name: string;
  fullName: string | null;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  longDescription: string | null;
  price: number;
  originalPrice: number | null;
  productType: string;
  categoryId: string | null;
  categoryName: string;
  dosage: string;
  form: string;
  purity: string;
  molecularWeight: string | null;
  sequence: string | null;
  storageInstructions: string;
  specifications: string | null;
  researchApplications: string[];
  benefits: string[] | null;
  mechanismOfAction: string | null;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  bestSeller: boolean;
  onSale: boolean;
  tags: string[] | null;
}

const productTypeOptions = [
  { value: "lyophilized", label: "Lyophilized Vials" },
];

const categoryOptions = [
  { value: "metabolic", label: "Metabolic" },
  { value: "recovery", label: "Recovery" },
  { value: "cognitive", label: "Cognitive" },
  { value: "growth-hormone", label: "Growth Hormone" },
  { value: "blends", label: "Blends" },
];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.ReactElement {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";
  const { setCurrentPage, setFormData: setAIFormData, setEntityId } = useAdminAI();

  // Set AI context when page loads
  useEffect(() => {
    setCurrentPage("product-edit");
    if (!isNew) {
      setEntityId(id);
    }
  }, [id, isNew, setCurrentPage, setEntityId]);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProductDetail>>({
    name: "",
    fullName: "",
    slug: "",
    sku: "",
    description: "",
    shortDescription: "",
    longDescription: "",
    price: 0,
    originalPrice: null,
    productType: "lyophilized",
    categoryName: "metabolic",
    dosage: "",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "",
    sequence: "",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    specifications: "",
    researchApplications: [],
    benefits: [],
    mechanismOfAction: "",
    inStock: true,
    stockQuantity: 0,
    featured: false,
    bestSeller: false,
    onSale: false,
    tags: [],
  });

  const [researchAppsInput, setResearchAppsInput] = useState("");
  const [benefitsInput, setBenefitsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (isNew) return;

    const fetchProduct = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setFormData(data);
        setResearchAppsInput((data.researchApplications || []).join(", "));
        setBenefitsInput((data.benefits || []).join("\n"));
        setTagsInput((data.tags || []).join(", "));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const researchApplications = researchAppsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const benefits = benefitsInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const tags = tagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        researchApplications,
        benefits: benefits.length > 0 ? benefits : undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      const url = isNew
        ? "/api/admin/products"
        : `/api/admin/products/${id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const updateField = <K extends keyof ProductDetail>(
    field: K,
    value: ProductDetail[K]
  ): void => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Update AI context with form data
      setAIFormData(newData as Record<string, unknown>);
      return newData;
    });
  };

  const generateSlug = (): void => {
    const slug = (formData.name || "")
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    updateField("slug", slug);
  };

  // Handle AI autofill for a single field
  const handleApplyAIField = (field: string, value: string | string[]): void => {
    if (field === "researchApplications" && Array.isArray(value)) {
      setResearchAppsInput(value.join(", "));
    } else if (field === "benefits" && Array.isArray(value)) {
      setBenefitsInput(value.join("\n"));
    } else if (field === "suggestedCategory" && typeof value === "string") {
      updateField("categoryName", value);
    } else if (typeof value === "string") {
      updateField(field as keyof ProductDetail, value as never);
    }
  };

  // Handle AI autofill for all fields
  const handleApplyAllAI = (data: ProductAutofillData): void => {
    if (data.shortDescription) {
      updateField("shortDescription", data.shortDescription);
    }
    if (data.description) {
      updateField("description", data.description);
    }
    if (data.longDescription) {
      updateField("longDescription", data.longDescription);
    }
    if (data.mechanismOfAction) {
      updateField("mechanismOfAction", data.mechanismOfAction);
    }
    if (data.dosage) {
      updateField("dosage", data.dosage);
    }
    if (data.storageInstructions) {
      updateField("storageInstructions", data.storageInstructions);
    }
    if (data.molecularWeight) {
      updateField("molecularWeight", data.molecularWeight);
    }
    if (data.sequence) {
      updateField("sequence", data.sequence);
    }
    if (data.suggestedCategory) {
      updateField("categoryName", data.suggestedCategory);
    }
    if (data.researchApplications && data.researchApplications.length > 0) {
      setResearchAppsInput(data.researchApplications.join(", "));
    }
    if (data.benefits && data.benefits.length > 0) {
      setBenefitsInput(data.benefits.join("\n"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "Add Product" : "Edit Product"}
          </h1>
        </div>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* AI Research Assistant */}
        <ProductAIAssist
          productName={formData.name || ""}
          formData={formData as Record<string, unknown>}
          onApplyField={handleApplyAIField}
          onApplyAll={handleApplyAllAI}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                onBlur={() => !formData.slug && generateSlug()}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) => updateField("slug", e.target.value)}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku || ""}
                onChange={(e) => updateField("sku", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Descriptions
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <input
                type="text"
                value={formData.shortDescription || ""}
                onChange={(e) => updateField("shortDescription", e.target.value)}
                required
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Description
              </label>
              <textarea
                value={formData.longDescription || ""}
                onChange={(e) => updateField("longDescription", e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pricing & Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price || 0}
                onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  updateField("originalPrice", e.target.value ? parseFloat(e.target.value) : null)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity || 0}
                onChange={(e) => updateField("stockQuantity", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={formData.productType || "lyophilized"}
                onChange={(e) => updateField("productType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {productTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.categoryName || "metabolic"}
                onChange={(e) => updateField("categoryName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage *
              </label>
              <input
                type="text"
                value={formData.dosage || ""}
                onChange={(e) => updateField("dosage", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form *
              </label>
              <input
                type="text"
                value={formData.form || ""}
                onChange={(e) => updateField("form", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purity
              </label>
              <input
                type="text"
                value={formData.purity || "99%+"}
                onChange={(e) => updateField("purity", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Molecular Weight
              </label>
              <input
                type="text"
                value={formData.molecularWeight || ""}
                onChange={(e) => updateField("molecularWeight", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sequence
            </label>
            <input
              type="text"
              value={formData.sequence || ""}
              onChange={(e) => updateField("sequence", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Instructions *
            </label>
            <textarea
              value={formData.storageInstructions || ""}
              onChange={(e) => updateField("storageInstructions", e.target.value)}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Research Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Research Applications * (comma-separated)
              </label>
              <input
                type="text"
                value={researchAppsInput}
                onChange={(e) => setResearchAppsInput(e.target.value)}
                placeholder="Wound healing, Tissue repair, Anti-inflammatory"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits (one per line)
              </label>
              <textarea
                value={benefitsInput}
                onChange={(e) => setBenefitsInput(e.target.value)}
                rows={4}
                placeholder="Speeds up healing of tendons&#10;Reduces inflammation&#10;Supports gut health"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mechanism of Action
              </label>
              <textarea
                value={formData.mechanismOfAction || ""}
                onChange={(e) => updateField("mechanismOfAction", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { key: "inStock", label: "In Stock" },
              { key: "featured", label: "Featured" },
              { key: "bestSeller", label: "Best Seller" },
              { key: "onSale", label: "On Sale" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData as Record<string, boolean>)[key] || false}
                  onChange={(e) =>
                    updateField(key as keyof ProductDetail, e.target.checked as never)
                  }
                  className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="research, peptide, recovery"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
