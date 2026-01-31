import { Product, ProductCategory, ResearchReference } from "@/types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Metabolic",
    slug: "metabolic",
    description: "Peptides for metabolic research including weight management, glucose metabolism, and energy regulation",
    productCount: 7,
  },
  {
    id: "cat-2",
    name: "Recovery",
    slug: "recovery",
    description: "Tissue repair, healing, and regeneration peptides for recovery research",
    productCount: 4,
  },
  {
    id: "cat-3",
    name: "Cognitive",
    slug: "cognitive",
    description: "Neuroprotective and cognitive enhancement peptides for brain research",
    productCount: 2,
  },
  {
    id: "cat-4",
    name: "Growth Hormone",
    slug: "growth-hormone",
    description: "Growth hormone secretagogues and related peptides for GH research",
    productCount: 2,
  },
  {
    id: "cat-5",
    name: "Blends",
    slug: "blends",
    description: "Synergistic multi-peptide blends for comprehensive research applications",
    productCount: 4,
  },
];

export const products: Product[] = [
  // METABOLIC PEPTIDES
  {
    id: "retatrutide",
    name: "Retatrutide",
    fullName: "Retatrutide Triple Agonist",
    slug: "retatrutide",
    description: "Advanced triple-agonist peptide for research - 30mg",
    shortDescription: "Triple GLP-1/GIP/Glucagon receptor agonist",
    longDescription: "Retatrutide is a novel triple receptor agonist targeting GLP-1, GIP, and glucagon receptors. Engineered as a 39-amino acid peptide from a GIP backbone to simultaneously stimulate all three hormone receptors.",
    price: 199,
    originalPrice: 300,
    sku: "PS-RETA-30MG",
    type: "lyophilized",
    category: "metabolic",
    categoryDisplay: "Metabolic",
    dosage: "30mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "4,731 Da",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Glucose metabolism", "Weight management", "Appetite regulation", "Metabolic syndrome"],
    benefits: [
      "Helps control appetite and reduce food cravings",
      "Supports healthy blood sugar levels",
      "Promotes significant weight loss (up to 24% in clinical studies)",
      "May reduce liver fat buildup",
      "Works on three hormone systems at once for better results"
    ],
    mechanismOfAction: "Retatrutide acts as a triple hormone receptor agonist, simultaneously activating GLP-1, GIP (glucose-dependent insulinotropic polypeptide), and glucagon receptors. This multi-target approach provides comprehensive metabolic support by enhancing satiety, improving glucose handling, and promoting fat breakdown.",
    specifications: "Molecular Formula: C₂₂₁H₃₄₂N₄₆O₆₈; Molecular Weight: ~4,731 Da; 39 amino acid peptide chain; Storage: 2-8°C; pH: 3.0-5.0",
    researchReferences: [
      {
        title: "Triple–Hormone-Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972",
        source: "New England Journal of Medicine"
      },
      {
        title: "Efficacy and safety of retatrutide for obesity treatment: systematic review and meta-analysis",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12026077/",
        source: "PMC/NIH"
      },
      {
        title: "Triple hormone receptor agonist retatrutide for metabolic dysfunction-associated steatotic liver disease",
        url: "https://www.nature.com/articles/s41591-024-03018-2",
        source: "Nature Medicine"
      }
    ],
    images: ["/images/products/RETA.png"],
    inStock: true,
    featured: true,
    bestSeller: true,
    onSale: true,
    tags: ["research", "peptide", "high-purity", "metabolic"],
    createdAt: "2024-01-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "tirez",
    name: "Tirzepatide",
    fullName: "Tirzepatide (Tirez)",
    slug: "tirzepatide",
    description: "FDA-approved dual GIP/GLP-1 agonist for diabetes and weight management - 30mg",
    shortDescription: "Dual GIP/GLP-1 receptor agonist",
    longDescription: "Tirzepatide is an FDA-approved 39-amino acid peptide that acts on both GIP and GLP-1 receptors simultaneously. Marketed as Mounjaro (diabetes) and Zepbound (weight loss), it has shown remarkable efficacy in clinical trials, with participants losing up to 22% of their body weight.",
    price: 149,
    originalPrice: 200,
    sku: "PS-TIRZ-30MG",
    type: "lyophilized",
    category: "metabolic",
    categoryDisplay: "Metabolic",
    dosage: "30mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "4,813.45 Da",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 28 days at 2-8°C.",
    researchApplications: ["Glucose metabolism", "Dual-incretin action", "Weight management", "Insulin sensitivity"],
    benefits: [
      "Significantly lowers blood sugar in type 2 diabetes",
      "Promotes major weight loss (15-22% of body weight in studies)",
      "Reduces heart disease risk factors",
      "Once-weekly dosing for convenience",
      "FDA-approved as Mounjaro and Zepbound"
    ],
    mechanismOfAction: "Tirzepatide works as a dual GIP and GLP-1 receptor agonist, activating both pathways simultaneously for enhanced metabolic effects. It increases insulin secretion when blood sugar is high, reduces glucagon release, slows stomach emptying, and reduces appetite through brain signaling.",
    specifications: "Molecular Formula: C₂₂₅H₃₄₈N₄₈O₆₈; Molecular Weight: 4,813.45 Da; 39 amino acid peptide; Storage: 2-8°C; pH: 3.0-5.0",
    researchReferences: [
      {
        title: "Tirzepatide as a Dual GIP/GLP-1 Receptor Agonist",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7123456/",
        source: "PMC/NIH"
      }
    ],
    images: ["/images/products/TIREZ.png"],
    inStock: true,
    featured: true,
    bestSeller: true,
    tags: ["research", "peptide", "metabolic", "weight-management"],
    createdAt: "2024-02-10",
    updatedAt: "2024-11-20",
  },
  {
    id: "cagri",
    name: "Cagrilintide",
    fullName: "Cagrilintide (Cagri)",
    slug: "cagrilintide",
    description: "Long-acting amylin analog for satiety and weight research - 10mg",
    shortDescription: "Long-acting amylin receptor agonist",
    longDescription: "Cagrilintide is a long-acting amylin analog—a hormone naturally released alongside insulin that signals fullness to the brain. This 37-amino acid peptide is being developed by Novo Nordisk for weight management.",
    price: 125,
    originalPrice: 200,
    sku: "PS-CAGRI-10MG",
    type: "lyophilized",
    category: "metabolic",
    categoryDisplay: "Metabolic",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "4,409 Da",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 28 days at 2-8°C.",
    researchApplications: ["Satiety signaling", "Weight management", "Appetite regulation", "Amylin pathway"],
    benefits: [
      "Reduces hunger and food cravings",
      "Helps you feel full longer after eating",
      "Supports significant weight loss (15-20% when combined with GLP-1 drugs)",
      "Slows stomach emptying for lasting satisfaction",
      "Works differently than GLP-1 drugs for potential combination therapy"
    ],
    mechanismOfAction: "Cagrilintide activates amylin receptors (AMY1R and AMY3R) in the brain's appetite control center, creating feelings of fullness and reducing hunger between meals.",
    specifications: "Molecular Formula: C₁₉₄H₃₁₂N₅₄O₅₉S₂; Molecular Weight: ~4,409 Da; 37 amino acid peptide; Storage: 2-8°C",
    researchReferences: [
      {
        title: "Cagrilintide plus semaglutide in obesity: STEP 1 Extension analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/37385275/",
        source: "PubMed"
      },
      {
        title: "Effect of cagrilintide on body weight in people with overweight and obesity",
        url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)00845-X/fulltext",
        source: "The Lancet"
      }
    ],
    images: ["/images/products/CARGI.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["research", "peptide", "metabolic", "weight-management", "amylin"],
    createdAt: "2024-02-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "mots-c",
    name: "MOTS-C",
    fullName: "MOTS-C Mitochondrial Peptide",
    slug: "mots-c",
    description: "Metabolic and longevity research peptide - 20mg",
    shortDescription: "Mitochondrial-derived peptide for longevity research",
    longDescription: "MOTS-C is a 16-amino acid mitochondrial-derived peptide (MDP) encoded by the 12S rRNA region of mitochondrial DNA. Extensively researched for its role as a metabolic exercise mimetic and longevity factor.",
    price: 99,
    originalPrice: 200,
    sku: "PS-MOTSC-20MG",
    type: "lyophilized",
    category: "metabolic",
    categoryDisplay: "Metabolic",
    dosage: "20mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "2,174.6 Da",
    storageInstructions: "Store at -20°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Metabolic regulation", "Exercise mimetic", "Longevity research", "Insulin sensitivity"],
    benefits: [
      "Improves how your body uses sugar (insulin sensitivity)",
      "Helps prevent weight gain from poor diet",
      "Boosts cellular energy production",
      "May slow age-related metabolic decline",
      "Acts like exercise in a molecule",
      "Linked to exceptional longevity in centenarian studies"
    ],
    mechanismOfAction: "MOTS-C is a mitochondrial-derived peptide that functions as a metabolic regulator and exercise mimetic. It enhances insulin sensitivity, promotes metabolic flexibility, and prevents age-related metabolic decline.",
    specifications: "Molecular Formula: C₁₀₁H₁₅₂N₂₈O₂₂S₂; Molecular Weight: 2,174.6 Da; 16 amino acid mitochondrial-derived peptide; Storage: -20°C",
    researchReferences: [
      {
        title: "The mitochondrial-derived peptide MOTS-c: A player in exceptional longevity",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4693465/",
        source: "PMC/NIH"
      },
      {
        title: "MOTS-c: A novel mitochondrial-derived peptide regulating muscle and fat metabolism",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5116416/",
        source: "PMC/NIH"
      }
    ],
    images: ["/images/products/MOTS-C.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["research", "peptide", "longevity", "metabolic"],
    createdAt: "2024-03-01",
    updatedAt: "2024-11-20",
  },
  {
    id: "aod-9604",
    name: "AOD-9604",
    fullName: "AOD-9604 (Anti-Obesity Drug 9604)",
    slug: "aod-9604",
    description: "Selective lipolytic peptide for fat metabolism research - 10mg",
    shortDescription: "HGH fragment for selective fat metabolism",
    longDescription: "AOD-9604 (Tyr-hGH fragment 177-191) is a 16-amino acid peptide fragment derived from the C-terminal domain of human growth hormone with a stabilizing tyrosine substitution.",
    price: 99,
    originalPrice: 179,
    sku: "PS-AOD9604-10MG",
    type: "lyophilized",
    category: "metabolic",
    categoryDisplay: "Metabolic",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "1,817 Da",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Fat metabolism", "Lipolysis", "Weight management", "Cartilage repair"],
    benefits: [
      "Stimulates fat burning in stored fat cells",
      "Prevents new fat from forming",
      "Does NOT affect blood sugar or insulin",
      "Preserves lean muscle during fat loss",
      "May support joint and cartilage health",
      "Derived from growth hormone but without GH side effects"
    ],
    mechanismOfAction: "AOD-9604 works by upregulating beta-3 adrenergic receptors in white adipose tissue, directly stimulating fat cell metabolism and preferentially mobilizing stored lipids while inhibiting new fat formation.",
    specifications: "Molecular Formula: C₇₈H₁₂₃N₂₃O₂₃S₂; Molecular Weight: ~1817 Da; 16 amino acid peptide (Tyr-hGH 177-191); Storage: 2-8°C",
    researchReferences: [
      {
        title: "Effects of human GH and its lipolytic fragment (AOD9604) on lipid metabolism",
        url: "https://pubmed.ncbi.nlm.nih.gov/11713213/",
        source: "PubMed"
      }
    ],
    images: ["/images/products/AOD-9604.png"],
    inStock: true,
    featured: false,
    bestSeller: false,
    tags: ["research", "peptide", "metabolic", "lipolysis", "bone-health"],
    createdAt: "2024-03-10",
    updatedAt: "2024-11-20",
  },
  {
    id: "nad-plus",
    name: "NAD+",
    fullName: "NAD+ (Nicotinamide Adenine Dinucleotide)",
    slug: "nad-plus",
    description: "Essential coenzyme for cellular energy and repair - 500mg",
    shortDescription: "Cellular energy coenzyme for longevity research",
    longDescription: "NAD+ is a coenzyme found in every cell of your body. It's essential for converting food into energy and supporting DNA repair. NAD+ levels decline by over 50% as we age.",
    price: 50,
    originalPrice: 99,
    sku: "PS-NAD-500MG",
    type: "lyophilized",
    category: "metabolic",
    categoryDisplay: "Metabolic",
    dosage: "500mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "663.43 g/mol",
    storageInstructions: "Store at -80°C for optimal stability. Reconstituted solution stable for 14 days at 2-8°C.",
    researchApplications: ["Cellular energy", "DNA repair", "Longevity research", "Mitochondrial function"],
    benefits: [
      "Powers your cells' energy production",
      "Supports DNA repair and cellular health",
      "May help slow age-related decline (levels drop 50%+ with aging)",
      "Supports brain and heart function",
      "Essential for metabolism",
      "Helps regulate sleep and circadian rhythms"
    ],
    mechanismOfAction: "NAD+ functions as a critical electron shuttle in redox reactions, accepting hydride ions to form NADH which drives ATP synthesis through the electron transport chain. It serves as a cofactor for sirtuins and PARPs.",
    specifications: "Type: Dinucleotide coenzyme; Molecular Formula: C₂₁H₂₇N₇O₁₄P₂; Molecular Weight: 663.43 g/mol; Storage: -80°C for stability",
    researchReferences: [
      {
        title: "NAD+ metabolism and its roles in cellular processes during aging",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7963035/",
        source: "PMC/NIH"
      },
      {
        title: "NAD+ Metabolism in Cardiac Health, Aging, and Disease",
        url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.121.056589",
        source: "Circulation (American Heart Association)"
      }
    ],
    images: ["/images/products/NAD+.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["research", "coenzyme", "energy", "longevity", "cellular-health"],
    createdAt: "2024-03-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "melanotan",
    name: "Melanotan II",
    fullName: "Melanotan II",
    slug: "melanotan-ii",
    description: "Cyclic melanocortin receptor agonist for melanogenesis research - 10mg",
    shortDescription: "α-MSH analog for pigmentation research",
    longDescription: "Melanotan II is a cyclic lactam analogue of α-melanocyte-stimulating hormone (α-MSH) designed for laboratory investigation of melanocortin receptor pathways.",
    price: 65,
    originalPrice: 99,
    sku: "PS-MT2-10MG",
    type: "lyophilized",
    category: "metabolic",
    categoryDisplay: "Metabolic",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "1,024.2 Da",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH₂",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Melanogenesis", "Skin pigmentation", "Melanocortin receptor", "Research only"],
    benefits: [
      "Stimulates skin pigmentation (tanning effect)",
      "Researched for potential sun damage protection",
      "Activates melanin production in skin cells",
      "More potent than natural tanning hormones",
      "Cyclic structure provides enhanced stability"
    ],
    mechanismOfAction: "Melanotan II functions as a non-selective melanocortin receptor agonist, binding primarily to MC1, MC3, MC4, and MC5 receptors. The peptide's melanogenic effects occur through MC1 receptor activation.",
    specifications: "Molecular Formula: C₅₀H₆₉N₁₅O₉; Molecular Weight: 1024.2 Da; CAS: 121062-08-6; Storage: 2-8°C",
    researchReferences: [
      {
        title: "Evaluation of melanotan-II, a superpotent cyclic melanotropic peptide in a pilot phase-I clinical study",
        url: "https://pubmed.ncbi.nlm.nih.gov/8637402/",
        source: "PubMed/NIH"
      }
    ],
    images: ["/images/products/MELANOTAN.png"],
    inStock: true,
    featured: false,
    bestSeller: false,
    tags: ["research", "peptide", "melanocortin", "cyclic"],
    createdAt: "2024-03-20",
    updatedAt: "2024-11-20",
  },

  // RECOVERY PEPTIDES
  {
    id: "bpc-157",
    name: "BPC-157",
    fullName: "BPC-157 (Body Protection Compound)",
    slug: "bpc-157",
    description: "Versatile healing and recovery research peptide - 10mg",
    shortDescription: "Pentadecapeptide for tissue repair research",
    longDescription: "BPC-157 (Body Protection Compound-157) is a pentadecapeptide (15 amino acid chain) derived from protective compounds found in human gastric juice. Widely researched for its multifaceted role in tissue healing, cellular protection, and regenerative pathways.",
    price: 50,
    originalPrice: 100,
    sku: "PS-BPC157-10MG",
    type: "lyophilized",
    category: "recovery",
    categoryDisplay: "Recovery",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "1,419.56 Da",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Wound healing", "Tendon repair", "Gut health", "Anti-inflammatory"],
    benefits: [
      "Speeds up healing of tendons, ligaments, and muscles",
      "Reduces inflammation and pain",
      "Supports gut health and healing",
      "May protect against stomach ulcers",
      "Promotes blood vessel growth to injured areas",
      "Helps protect brain cells (neuroprotective)"
    ],
    mechanismOfAction: "BPC-157 enhances growth hormone receptor expression at both mRNA and protein levels in tendon fibroblasts. It promotes cell migration, survival under stress conditions, and tissue outgrowth through FAK-paxillin pathway activation.",
    specifications: "Molecular Formula: C₆₂H₉₈N₁₆O₂₂; Molecular Weight: 1,419.56 Da; 15 amino acid peptide; Storage: 2-8°C",
    researchReferences: [
      {
        title: "Emerging Use of BPC-157 in Orthopaedic Sports Medicine: A Systematic Review",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12313605/",
        source: "PMC/NIH"
      },
      {
        title: "Pentadecapeptide BPC 157 Enhances Growth Hormone Receptor Expression in Tendon Fibroblasts",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6271067/",
        source: "PMC/NIH"
      }
    ],
    images: ["/images/products/BPC-157.png"],
    inStock: true,
    featured: true,
    bestSeller: true,
    tags: ["research", "peptide", "recovery", "healing"],
    createdAt: "2024-01-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "lipo-c",
    name: "LIPO-C",
    fullName: "Lipoic Acid Complex",
    slug: "lipo-c",
    description: "Lipotropic vitamin and amino acid blend for fat metabolism - 10ml",
    shortDescription: "MIC complex for fat metabolism support",
    longDescription: "LIPO-C is a lipotropic vitamin and amino acid blend. It combines fat-metabolizing nutrients (MIC: Methionine, Inositol, Choline) with B vitamins to support fat breakdown, liver health, and energy production.",
    price: 99,
    originalPrice: 135,
    sku: "PS-LIPOC-10ML",
    type: "injectable",
    category: "recovery",
    categoryDisplay: "Recovery",
    dosage: "10ml",
    form: "Injectable Solution",
    purity: "99%+",
    storageInstructions: "Store at 2-8°C. Use within 30 days of opening.",
    researchApplications: ["Fat metabolism", "Liver support", "Energy production", "Weight management"],
    benefits: [
      "Helps your body break down and use stored fat",
      "Supports liver health and detoxification",
      "Boosts energy through B vitamins",
      "May help with weight management when combined with diet and exercise",
      "Supports healthy metabolism"
    ],
    mechanismOfAction: "LIPO-C works synergistically through multiple lipotropic pathways: Methionine helps break down fat in the liver. Inositol supports fat metabolism and cellular signaling. Choline helps transport fat out of the liver.",
    specifications: "Type: Lipotropic vitamin/amino acid blend; Components: Methionine 25mg/mL, Inositol 50mg/mL, Choline 50mg/mL, B12 1mg/mL; Concentration: 216 mg/ml",
    researchReferences: [
      {
        title: "Lipo-C for Metabolic and Liver Support Research",
        url: "https://empower-peptides.com/blogs/empower-peptides-research-grade-peptides/lipo-c-lc216-peptide-for-metabolic-liver-support-1",
        source: "Empower Peptides Research"
      }
    ],
    images: ["/images/products/LIPO-C.png"],
    inStock: true,
    featured: false,
    bestSeller: false,
    tags: ["research", "lipotropic", "metabolism", "vitamins"],
    createdAt: "2024-04-01",
    updatedAt: "2024-11-20",
  },
  {
    id: "dsip",
    name: "DSIP",
    fullName: "DSIP (Delta Sleep-Inducing Peptide)",
    slug: "dsip",
    description: "Sleep quality and neuroprotection research peptide - 10mg",
    shortDescription: "Nonapeptide for sleep and stress research",
    longDescription: "DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring nonapeptide with molecular weight 850 Da. Extensively researched for its role in sleep architecture, neuroprotection, and stress response modulation.",
    price: 75,
    originalPrice: 125,
    sku: "PS-DSIP-10MG",
    type: "lyophilized",
    category: "recovery",
    categoryDisplay: "Recovery",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "850 Da",
    sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Sleep research", "Neuroprotection", "Stress response", "Recovery"],
    benefits: [
      "Promotes deep, restorative sleep",
      "Reduces stress hormone levels (cortisol)",
      "May help with chronic sleep issues",
      "Supports natural sleep patterns",
      "Has exceptional safety profile in research",
      "May support recovery from neurological stress"
    ],
    mechanismOfAction: "DSIP's mechanism involves multiple pathways including MAPK cascade modulation and homology to glucocorticoid-induced leucine zipper (GILZ). In the brain, its action is mediated by NMDA receptors and GABA-A receptors.",
    specifications: "Molecular Formula: C₃₅H₄₈N₁₀O₁₅; Molecular Weight: 850 Da; Nonapeptide (9 amino acids); Storage: 2-8°C",
    researchReferences: [
      {
        title: "Effects of delta sleep-inducing peptide on chronic insomniac patients",
        url: "https://pubmed.ncbi.nlm.nih.gov/1299794/",
        source: "PubMed"
      }
    ],
    images: ["/images/products/DISP.png"],
    inStock: true,
    featured: false,
    bestSeller: false,
    tags: ["research", "peptide", "sleep", "neuroprotection", "stress-reduction"],
    createdAt: "2024-04-10",
    updatedAt: "2024-11-20",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    fullName: "GHK-Cu Copper Peptide",
    slug: "ghk-cu",
    description: "Regenerative copper peptide for tissue repair research - 50mg",
    shortDescription: "Copper tripeptide for regeneration research",
    longDescription: "GHK-Cu (Glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring tripeptide with high affinity for copper ions, found in human plasma, saliva, and urine.",
    price: 54.99,
    originalPrice: 89,
    sku: "PS-GHKCU-50MG",
    type: "lyophilized",
    category: "recovery",
    categoryDisplay: "Recovery",
    dosage: "50mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "403 Da",
    sequence: "Gly-His-Lys",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Collagen synthesis", "Wound healing", "Antioxidant", "Anti-aging"],
    benefits: [
      "Boosts collagen production for healthier skin",
      "Speeds wound healing and tissue repair",
      "Reduces wrinkles and improves skin quality",
      "Supports hair growth and thicker hair",
      "Powerful antioxidant protection",
      "Reduces inflammation naturally",
      "Attracts stem cells to damaged areas"
    ],
    mechanismOfAction: "GHK-Cu binds copper(II) ions with high affinity, forming a stable complex that modulates gene expression through multiple pathways. It activates the ubiquitin-proteasome system and attracts immune cells and stem cells to injury sites.",
    specifications: "Molecular Formula: C₁₄H₂₄CuN₆O₄; Molecular Weight: ~403 Da; Tripeptide-copper complex; Storage: 2-8°C",
    researchReferences: [
      {
        title: "GHK-Cu: Cosmetic and Regenerative Dermatology Applications",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7899524/",
        source: "PMC/NIH"
      },
      {
        title: "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4508379/",
        source: "PMC/NIH"
      }
    ],
    images: ["/images/products/GHK-Cu.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["research", "peptide", "recovery", "copper-peptide", "regeneration", "collagen"],
    createdAt: "2024-04-15",
    updatedAt: "2024-11-20",
  },

  // COGNITIVE PEPTIDES
  {
    id: "semax",
    name: "Semax",
    fullName: "Semax Cognitive Peptide",
    slug: "semax",
    description: "Cognitive enhancement research peptide - 10mg",
    shortDescription: "ACTH-derived nootropic peptide",
    longDescription: "Semax is a synthetic peptide derivative of ACTH (adrenocorticotropic hormone) developed for research into cognitive function and neuroprotection.",
    price: 60,
    originalPrice: 99,
    sku: "PS-SEMAX-10MG",
    type: "lyophilized",
    category: "cognitive",
    categoryDisplay: "Cognitive",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Cognitive enhancement", "Neuroprotection", "BDNF expression", "Memory research"],
    benefits: [
      "Improves focus, memory, and mental clarity",
      "Supports brain health and protection",
      "May help with learning and concentration",
      "Used in Russia as a prescription cognitive enhancer",
      "Promotes brain-derived growth factors (BDNF)"
    ],
    mechanismOfAction: "Semax, derived from the 4-10 fragment of ACTH, activates specific neural pathways involved in cognitive processing and neuroprotection. It modulates neurotransmitter systems and promotes neural plasticity through mechanisms involving BDNF.",
    specifications: "ACTH(4-10) synthetic derivative; 7 amino acid heptapeptide; Storage: 2-8°C; pH: 3.0-5.0",
    researchReferences: [
      {
        title: "Semax and Cognitive Enhancement in Preclinical Models",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        source: "PubMed Central"
      }
    ],
    images: ["/images/products/Semax.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["research", "peptide", "cognitive"],
    createdAt: "2024-05-01",
    updatedAt: "2024-11-20",
  },
  {
    id: "selank",
    name: "Selank",
    fullName: "Selank Anxiolytic Peptide",
    slug: "selank",
    description: "Mood and anxiety research peptide - 10mg",
    shortDescription: "Tuftsin-derived peptide for anxiety research",
    longDescription: "Selank is a synthetic heptapeptide (7 amino acids) derived from the naturally occurring immunoregulatory peptide tuftsin. Developed at the Institute of Molecular Genetics of the Russian Academy of Sciences.",
    price: 50,
    originalPrice: 75,
    sku: "PS-SELANK-10MG",
    type: "lyophilized",
    category: "cognitive",
    categoryDisplay: "Cognitive",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "861 Da",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Anxiolytic effects", "Mood regulation", "GABA modulation", "Stress response"],
    benefits: [
      "Reduces anxiety without causing drowsiness",
      "Improves mood and emotional balance",
      "Supports mental performance under stress",
      "No withdrawal or dependence issues reported",
      "May enhance memory and focus",
      "Works fast—some see results within 1-3 days"
    ],
    mechanismOfAction: "Selank influences GABA binding to GABAA receptors by modulating peptide properties that change affinity of endogenous ligands. It enhances serotonin metabolism and rapidly elevates BDNF expression in the hippocampus.",
    specifications: "Synthetic heptapeptide (7 amino acids); Molecular Weight: ~861 Da; Storage: 2-8°C; pH: 3.0-5.0",
    researchReferences: [
      {
        title: "Peptide Selank Enhances Diazepam Effects in Anxiety Reduction",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5322660/",
        source: "PMC/NIH"
      },
      {
        title: "Selank Administration Affects GABAergic Neurotransmission Gene Expression",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4757669/",
        source: "PMC/NIH"
      }
    ],
    images: ["/images/products/SELANK.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["research", "peptide", "mood", "anxiety"],
    createdAt: "2024-05-10",
    updatedAt: "2024-11-20",
  },
  {
    id: "tesa",
    name: "Tesamorelin",
    fullName: "Tesamorelin (TESA)",
    slug: "tesamorelin",
    description: "GHRH analog for growth hormone research - 10mg",
    shortDescription: "FDA-approved GHRH analog",
    longDescription: "Tesamorelin is a synthetic 44-amino acid peptide that mimics the body's natural growth hormone-releasing hormone (GHRH). It is FDA-approved (Egrifta) for reducing excess abdominal fat.",
    price: 75,
    originalPrice: 100,
    sku: "PS-TESA-10MG",
    type: "lyophilized",
    category: "growth-hormone",
    categoryDisplay: "Growth Hormone",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "5,135.9 Da",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 28 days at 2-8°C.",
    researchApplications: ["Growth hormone release", "Visceral fat reduction", "Body composition", "GH axis research"],
    benefits: [
      "Reduces stubborn belly fat (visceral fat)",
      "Supports lean muscle maintenance",
      "May improve liver fat levels",
      "Boosts natural growth hormone production",
      "FDA-approved and clinically tested"
    ],
    mechanismOfAction: "Tesamorelin binds to GHRH receptors in the pituitary gland, triggering the natural release of growth hormone. This increases fat breakdown (lipolysis), especially in the abdominal area, while preserving lean muscle mass.",
    specifications: "Molecular Formula: C₂₂₁H₃₆₆N₇₂O₆₇S; Molecular Weight: 5,135.9 Da; 44 amino acid peptide; Storage: 2-8°C",
    researchReferences: [
      {
        title: "Tesamorelin for the Treatment of HIV-Associated Lipodystrophy",
        url: "https://pubmed.ncbi.nlm.nih.gov/21091203/",
        source: "PubMed"
      }
    ],
    images: ["/images/products/TESA.png"],
    inStock: true,
    featured: false,
    bestSeller: false,
    tags: ["research", "peptide", "growth-hormone", "fda-approved", "ghrh"],
    createdAt: "2024-05-15",
    updatedAt: "2024-11-20",
  },

  // GROWTH HORMONE PEPTIDES
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    fullName: "Ipamorelin (NNC 26-0161)",
    slug: "ipamorelin",
    description: "Selective growth hormone secretagogue research peptide - 10mg",
    shortDescription: "First truly selective GHRP-receptor agonist",
    longDescription: "Ipamorelin (NNC 26-0161) is a synthetic pentapeptide and the first truly selective GHRP-receptor agonist. It selectively binds to the GHSR-1a receptor, stimulating growth hormone release without significantly affecting other hormones.",
    price: 120,
    originalPrice: 199,
    sku: "PS-IPA-10MG",
    type: "lyophilized",
    category: "growth-hormone",
    categoryDisplay: "Growth Hormone",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    molecularWeight: "711 Da",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Growth hormone release", "Body composition", "Bone health", "Selective GH secretion"],
    benefits: [
      "Stimulates natural growth hormone release",
      "Highly selective—doesn't affect cortisol or other hormones",
      "Supports lean muscle and bone health",
      "May improve body composition",
      "Fewer side effects than other growth hormone stimulators",
      "Well-tolerated in clinical studies"
    ],
    mechanismOfAction: "Ipamorelin selectively binds to the GHSR-1a receptor (ghrelin/growth hormone secretagogue receptor), stimulating growth hormone release from the pituitary gland. Its hallmark characteristic is exceptional selectivity.",
    specifications: "Molecular Formula: C₃₈H₄₉N₉O₅; Molecular Weight: ~711 Da; Pentapeptide (5 amino acids); Storage: 2-8°C",
    researchReferences: [
      {
        title: "Ipamorelin, the first selective growth hormone secretagogue",
        url: "https://pubmed.ncbi.nlm.nih.gov/9849822/",
        source: "PubMed"
      },
      {
        title: "Ipamorelin dose-dependently induces longitudinal bone growth in rats",
        url: "https://pubmed.ncbi.nlm.nih.gov/10373343/",
        source: "PubMed"
      }
    ],
    images: ["/images/products/IPAMORELIN.png"],
    inStock: true,
    featured: true,
    bestSeller: true,
    tags: ["research", "peptide", "growth-hormone", "bone-health", "selective"],
    createdAt: "2024-06-01",
    updatedAt: "2024-11-20",
  },

  // PEPTIDE BLENDS
  {
    id: "klow-blend",
    name: "KLOW Blend",
    fullName: "KLOW Regenerative Blend",
    slug: "klow-blend",
    description: "Premium 4-peptide regenerative blend for repair, recovery, and inflammation modulation - 80mg",
    shortDescription: "GHK-Cu + BPC-157 + TB500 + KPV synergistic blend",
    longDescription: "KLOW 80 mg is a premium research formulation combining four of the most powerful regenerative peptides—GHK-Cu, BPC-157, TB500, and KPV—specifically engineered for advanced studies in tissue repair, recovery optimization, and inflammation modulation.",
    price: 129,
    originalPrice: 189,
    sku: "PS-KLOW-80MG",
    type: "blend",
    category: "blends",
    categoryDisplay: "Blends",
    dosage: "80mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Tissue repair", "Anti-inflammatory", "Regeneration", "Recovery optimization"],
    benefits: [
      "Speeds healing of tissues, tendons, and ligaments",
      "Reduces inflammation throughout the body",
      "Promotes collagen production for better tissue quality",
      "Supports blood vessel growth to injured areas",
      "Combines 4 proven repair peptides for maximum effect",
      "May reduce scarring and improve healing outcomes",
      "Supports overall recovery and regeneration"
    ],
    mechanismOfAction: "KLOW Blend operates through synergistic multi-pathway activation: GHK-Cu activates gene expression for collagen and growth factors, BPC-157 enhances growth hormone receptors and angiogenesis, TB500 promotes actin regulation and cell migration, KPV suppresses pro-inflammatory cytokine production.",
    specifications: "Multi-Peptide Blend — 80 mg Total | Composition: GHK-Cu 50 mg | BPC-157 10 mg | TB500 10 mg | KPV 10 mg | Storage: 2-8°C",
    researchReferences: [
      {
        title: "Copper Peptide GHK-Cu: Cosmetic and Regenerative Dermatology Applications",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7899524/",
        source: "PMC/NIH"
      }
    ],
    images: ["/images/products/KLOW.png"],
    inStock: true,
    featured: true,
    bestSeller: true,
    tags: ["blend", "research", "recovery", "regeneration", "inflammation", "repair"],
    createdAt: "2024-06-15",
    updatedAt: "2024-11-20",
  },
  {
    id: "glow-blend",
    name: "GLOW Blend",
    fullName: "GLOW Regenerative Blend",
    slug: "glow-blend",
    description: "Synergistic regenerative research blend with GHK-Cu, TB-500, BPC-157 - 70mg",
    shortDescription: "GHK-Cu + BPC-157 + TB-500 skin and healing blend",
    longDescription: "GLOW is a precision-formulated research peptide blend combining three complementary compounds: GHK-Cu (50mg), BPC-157 (10mg), and TB-500 (10mg).",
    price: 129,
    originalPrice: 189,
    sku: "PS-GLOW-70MG",
    type: "blend",
    category: "blends",
    categoryDisplay: "Blends",
    dosage: "70mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Skin health", "Tissue repair", "Collagen synthesis", "Regeneration"],
    benefits: [
      "Supports skin health and rejuvenation",
      "Promotes collagen production (GHK-Cu)",
      "Speeds tissue healing and repair (BPC-157)",
      "Enhances cell migration for faster healing (TB-500)",
      "Reduces inflammation naturally",
      "May improve wound healing and recovery",
      "Combines 3 synergistic peptides for comprehensive support"
    ],
    mechanismOfAction: "GLOW's three-component formulation: GHK-Cu modulates gene expression for tissue remodeling, BPC-157 demonstrates cytoprotective properties, TB-500 facilitates actin polymerization and cellular migration.",
    specifications: "Total Content: 70mg per vial; Components: GHK-Cu 50mg, BPC-157 10mg, TB-500 10mg; Storage: 2-8°C",
    researchReferences: [
      {
        title: "GLOW Peptide Blend: GHK-Cu, TB-500, and BPC-157 in Regenerative Research",
        url: "https://tydes.is/glow-peptide-blend-ghkcu-tb500-bpc157-regeneration/",
        source: "Tydes Research"
      }
    ],
    images: ["/images/products/GLOW.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["research", "peptide", "blend", "regenerative", "ghk-cu", "bpc-157", "tb-500"],
    createdAt: "2024-07-01",
    updatedAt: "2024-11-20",
  },
  {
    id: "wolverine-stack",
    name: "Wolverine Stack",
    fullName: "Wolverine Healing Stack",
    slug: "wolverine-stack",
    description: "Classic 2-peptide healing and recovery blend - 10mg",
    shortDescription: "BPC-157 + TB-500 legendary healing stack",
    longDescription: "The Wolverine Stack is the legendary peptide combination that earned its name from the Marvel superhero known for rapid regeneration. This classic healing blend combines BPC-157 and TB-500.",
    price: 75,
    originalPrice: 109,
    sku: "PS-WOLV-10MG",
    type: "blend",
    category: "blends",
    categoryDisplay: "Blends",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Wound healing", "Tissue repair", "Recovery", "Anti-inflammatory"],
    benefits: [
      "Classic healing stack named after the superhero known for rapid regeneration",
      "BPC-157 speeds healing of tendons, ligaments, and gut",
      "TB-500 promotes cell movement and tissue repair",
      "Together they work synergistically for faster recovery",
      "Reduces inflammation for better healing environment",
      "Supports blood vessel growth to injured areas"
    ],
    mechanismOfAction: "The Wolverine Stack operates through two complementary healing pathways: BPC-157 enhances growth hormone receptor expression and promotes cell migration, TB-500 facilitates actin regulation and wound healing.",
    specifications: "Dual-Peptide Blend — 10mg Total | Composition: BPC-157 5mg | TB-500 5mg | Storage: 2-8°C",
    researchReferences: [
      {
        title: "The Complete Guide to Wolverine Stack: BPC-157 and TB-500",
        url: "https://driphydration.com/blog/wolverine-stack/",
        source: "Drip Hydration"
      }
    ],
    images: ["/images/products/WolverineStack.png"],
    inStock: true,
    featured: false,
    bestSeller: true,
    tags: ["blend", "research", "recovery", "wolverine", "bpc-157", "tb-500", "healing"],
    createdAt: "2024-07-10",
    updatedAt: "2024-11-20",
  },
  {
    id: "growth-stack",
    name: "Growth Stack",
    fullName: "CJC-1295/Ipamorelin Growth Stack",
    slug: "growth-stack",
    description: "Synergistic GH secretagogue blend for growth hormone research - 10mg",
    shortDescription: "CJC-1295 + Ipamorelin synergistic GH stack",
    longDescription: "The Growth Stack combines two of the most researched growth hormone secretagogues—CJC-1295 (no DAC) and Ipamorelin—into a single synergistic formulation.",
    price: 99,
    originalPrice: 129,
    sku: "PS-GROWTH-10MG",
    type: "blend",
    category: "blends",
    categoryDisplay: "Blends",
    dosage: "10mg",
    form: "Lyophilized Powder",
    purity: "99%+",
    storageInstructions: "Store at 2-8°C. Reconstituted solution stable for 30 days at 2-8°C.",
    researchApplications: ["Growth hormone release", "Body composition", "Recovery", "GH optimization"],
    benefits: [
      "Stimulates natural growth hormone production through two pathways",
      "Creates natural GH pulse patterns for optimal results",
      "Highly selective—doesn't affect cortisol or stress hormones",
      "CJC-1295 provides sustained baseline while Ipamorelin adds pulses",
      "Supports lean muscle, bone health, and recovery",
      "Well-tolerated classic stack for growth hormone optimization"
    ],
    mechanismOfAction: "The Growth Stack operates through two distinct but synergistic mechanisms: CJC-1295 activates GHRH receptors for sustained GH elevation, Ipamorelin triggers ghrelin receptors for pulsatile GH release.",
    specifications: "Dual-Peptide Blend — 10mg Total | Composition: CJC-1295 (no DAC) 5mg + Ipamorelin 5mg | Storage: 2-8°C",
    researchReferences: [
      {
        title: "Ipamorelin and CJC-1295 Combination: Synergistic Effects",
        url: "https://www.atlantismedcenter.com/peptide-stack-ipamorelin-cjc-1295-combination/",
        source: "Atlantis Medical Center"
      }
    ],
    images: ["/images/products/GrowthSignalStack.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    tags: ["blend", "research", "growth-hormone", "cjc-1295", "ipamorelin", "secretagogue"],
    createdAt: "2024-07-15",
    updatedAt: "2024-11-20",
  },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByType(type: string): Product[] {
  return products.filter((p) => p.type === type);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category || p.categoryDisplay.toLowerCase() === category.toLowerCase());
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getSaleProducts(): Product[] {
  return products.filter((p) => p.onSale);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.categoryDisplay.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterByPrice(products: Product[], min: number, max: number): Product[] {
  return products.filter(p => p.price >= min && p.price <= max);
}

export function sortProducts(productList: Product[], sortBy: string): Product[] {
  const sorted = [...productList];

  switch(sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}
