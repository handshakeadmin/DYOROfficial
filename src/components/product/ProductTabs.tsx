"use client";

import { useState } from "react";
import { ExternalLink, Check, FlaskConical, Microscope, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductTabsProps {
  product: Product;
}

type TabKey = "description" | "benefits" | "mechanism" | "specifications" | "references";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  available: boolean;
}

export function ProductTabs({ product }: ProductTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const tabs: Tab[] = [
    {
      key: "description",
      label: "Description",
      icon: <FileText className="w-4 h-4" />,
      available: true,
    },
    {
      key: "benefits",
      label: "Benefits",
      icon: <Check className="w-4 h-4" />,
      available: Boolean(product.benefits && product.benefits.length > 0),
    },
    {
      key: "mechanism",
      label: "How It Works",
      icon: <FlaskConical className="w-4 h-4" />,
      available: Boolean(product.mechanismOfAction),
    },
    {
      key: "specifications",
      label: "Specifications",
      icon: <Microscope className="w-4 h-4" />,
      available: Boolean(product.specifications || product.sequence || product.molecularWeight),
    },
    {
      key: "references",
      label: "Research",
      icon: <ExternalLink className="w-4 h-4" />,
      available: Boolean(product.researchReferences && product.researchReferences.length > 0),
    },
  ];

  const availableTabs = tabs.filter((tab) => tab.available);

  return (
    <div className="mt-12 lg:mt-16">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground hover:border-border"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Description</h3>
              <p className="text-muted leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {product.researchApplications.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Research Applications</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.researchApplications.map((app, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3">Storage Instructions</h4>
              <p className="text-muted">{product.storageInstructions}</p>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === "benefits" && product.benefits && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Research Benefits</h3>
            <ul className="space-y-3">
              {product.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-background-secondary rounded border border-border"
                >
                  <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mechanism of Action Tab */}
        {activeTab === "mechanism" && product.mechanismOfAction && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Mechanism of Action</h3>
            <div className="bg-background-secondary rounded border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-5 h-5 text-primary" />
                </div>
                <p className="text-muted leading-relaxed">{product.mechanismOfAction}</p>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Technical Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background-secondary rounded border border-border p-4">
                <span className="text-xs text-muted uppercase tracking-wider">Purity</span>
                <p className="font-semibold text-lg mt-1">{product.purity}</p>
              </div>
              <div className="bg-background-secondary rounded border border-border p-4">
                <span className="text-xs text-muted uppercase tracking-wider">Form</span>
                <p className="font-semibold text-lg mt-1">{product.form}</p>
              </div>
              <div className="bg-background-secondary rounded border border-border p-4">
                <span className="text-xs text-muted uppercase tracking-wider">Dosage</span>
                <p className="font-semibold text-lg mt-1">{product.dosage}</p>
              </div>
              {product.molecularWeight && (
                <div className="bg-background-secondary rounded border border-border p-4">
                  <span className="text-xs text-muted uppercase tracking-wider">Molecular Weight</span>
                  <p className="font-semibold text-lg mt-1">{product.molecularWeight}</p>
                </div>
              )}
            </div>

            {product.sequence && (
              <div>
                <h4 className="font-semibold mb-3">Amino Acid Sequence</h4>
                <div className="bg-background-secondary rounded border border-border p-4">
                  <code className="font-mono text-sm text-muted break-all">
                    {product.sequence}
                  </code>
                </div>
              </div>
            )}

            {product.specifications && (
              <div>
                <h4 className="font-semibold mb-3">Additional Specifications</h4>
                <p className="text-muted leading-relaxed">{product.specifications}</p>
              </div>
            )}
          </div>
        )}

        {/* Research References Tab */}
        {activeTab === "references" && product.researchReferences && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Research & References</h3>
            <p className="text-muted text-sm">
              The following peer-reviewed studies and publications support the research applications of this compound.
            </p>

            <div className="space-y-4">
              {product.researchReferences.map((ref, index) => (
                <div
                  key={index}
                  className="bg-background-secondary rounded border border-border p-4 hover:border-primary/50 transition-colors"
                >
                  <h4 className="font-medium text-foreground mb-1">{ref.title}</h4>
                  <p className="text-sm text-muted mb-3">{ref.source}</p>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      View Study
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
