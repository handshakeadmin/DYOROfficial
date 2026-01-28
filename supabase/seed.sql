-- PeptideSource Seed Data
-- Run this after migrations to populate initial data

-- Insert Categories
INSERT INTO categories (id, name, slug, description, display_order) VALUES
  ('cat-1', 'Lyophilized Peptides', 'lyophilized', 'Freeze-dried peptide powders requiring reconstitution before use', 1),
  ('cat-2', 'Capsules', 'capsules', 'Oral peptide capsules for convenient research applications', 2),
  ('cat-3', 'Nasal Sprays', 'nasal-spray', 'Ready-to-use nasal spray formulations', 3),
  ('cat-4', 'Serums', 'serum', 'Topical peptide serums for dermatological research', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert Products (Lyophilized)
INSERT INTO products (
  id, name, slug, description, short_description, price, sku, product_type,
  category_id, category_name, dosage, form, purity, molecular_weight, sequence,
  storage_instructions, in_stock, featured, best_seller
) VALUES
(
  'prod-1', 'BPC-157 - 10mg', 'bpc-157-10mg',
  'BPC-157 (Body Protection Compound-157) is a pentadecapeptide consisting of 15 amino acids. It is a partial sequence of body protection compound (BPC) that is discovered in and isolated from human gastric juice. Research has shown that BPC-157 accelerates wound healing, including tendon-to-bone healing and superior healing of damaged ligaments.',
  'Pentadecapeptide for tissue repair research',
  54.99, 'PS-BPC157-10MG', 'lyophilized', 'cat-1', 'Healing & Recovery',
  '10mg', 'Lyophilized Powder', '99%+', '1419.53 g/mol',
  'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
  'Store at -20°C. Reconstituted solution stable for 30 days at 2-8°C.',
  true, true, true
),
(
  'prod-2', 'Semaglutide - 10mg', 'semaglutide-10mg',
  'Semaglutide is a glucagon-like peptide-1 (GLP-1) analog that mimics the function of natural incretin hormones. It has been extensively researched for its effects on glucose metabolism, appetite regulation, and metabolic function.',
  'GLP-1 analog for metabolic research',
  189.99, 'PS-SEMA-10MG', 'lyophilized', 'cat-1', 'Metabolic',
  '10mg', 'Lyophilized Powder', '99%+', '4113.58 g/mol', NULL,
  'Store at -20°C. Reconstituted solution stable for 28 days at 2-8°C.',
  true, true, true
),
(
  'prod-3', 'Tirzepatide - 10mg', 'tirzepatide-10mg',
  'Tirzepatide is a novel dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist. Research indicates superior efficacy in metabolic studies compared to single-incretin therapies.',
  'Dual GIP/GLP-1 agonist for advanced metabolic research',
  249.99, 'PS-TIRZ-10MG', 'lyophilized', 'cat-1', 'Metabolic',
  '10mg', 'Lyophilized Powder', '99%+', '4813.45 g/mol', NULL,
  'Store at -20°C. Reconstituted solution stable for 28 days at 2-8°C.',
  true, true, true
),
(
  'prod-4', 'TB-500 - 10mg', 'tb-500',
  'TB-500 is a synthetic version of the naturally occurring peptide present in virtually all human and animal cells, Thymosin Beta-4. It is known for its wound healing and tissue repair properties.',
  'Thymosin Beta-4 fragment for regeneration research',
  64.99, 'PS-TB500-10MG', 'lyophilized', 'cat-1', 'Healing & Recovery',
  '10mg', 'Lyophilized Powder', '99%+', '4963.5 g/mol', NULL,
  'Store at -20°C. Reconstituted solution stable for 30 days at 2-8°C.',
  true, true, true
),
(
  'prod-5', 'GHK-Cu - 50mg', 'ghk-cu',
  'GHK-Cu (Copper peptide) is a naturally occurring copper complex that has been shown to have wound healing and regenerative properties in the skin. Research indicates potential for tissue remodeling and anti-aging.',
  'Copper peptide for skin regeneration research',
  74.99, 'PS-GHKCU-50MG', 'lyophilized', 'cat-1', 'Skin & Anti-Aging',
  '50mg', 'Lyophilized Powder', '99%+', '403.9 g/mol', 'Gly-His-Lys',
  'Store at -20°C. Protect from light. Reconstituted solution stable for 14 days at 2-8°C.',
  true, true, false
),
(
  'prod-6', 'Ipamorelin - 5mg', 'ipamorelin',
  'Ipamorelin is a pentapeptide, a growth hormone secretagogue, and a ghrelin mimetic. It selectively stimulates growth hormone release without significantly affecting cortisol or prolactin levels.',
  'Selective GH secretagogue for research',
  44.99, 'PS-IPAM-5MG', 'lyophilized', 'cat-1', 'Growth Hormone',
  '5mg', 'Lyophilized Powder', '99%+', '711.9 g/mol', 'Aib-His-D-2Nal-D-Phe-Lys',
  'Store at -20°C. Reconstituted solution stable for 30 days at 2-8°C.',
  true, true, false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  featured = EXCLUDED.featured,
  best_seller = EXCLUDED.best_seller,
  updated_at = NOW();

-- Insert Research Applications
INSERT INTO product_research_applications (product_id, application) VALUES
  ('prod-1', 'Wound healing'),
  ('prod-1', 'Tendon repair'),
  ('prod-1', 'Gut health'),
  ('prod-1', 'Anti-inflammatory'),
  ('prod-2', 'Glucose metabolism'),
  ('prod-2', 'Weight management'),
  ('prod-2', 'Appetite regulation'),
  ('prod-2', 'Cardiovascular health'),
  ('prod-3', 'Glucose metabolism'),
  ('prod-3', 'Dual-incretin action'),
  ('prod-3', 'Weight management'),
  ('prod-3', 'Insulin sensitivity'),
  ('prod-4', 'Muscle repair'),
  ('prod-4', 'Tissue healing'),
  ('prod-4', 'Anti-inflammatory'),
  ('prod-4', 'Cardiac repair'),
  ('prod-5', 'Skin regeneration'),
  ('prod-5', 'Wound healing'),
  ('prod-5', 'Anti-aging'),
  ('prod-5', 'Collagen synthesis'),
  ('prod-6', 'Growth hormone research'),
  ('prod-6', 'Body composition'),
  ('prod-6', 'Sleep quality'),
  ('prod-6', 'Recovery')
ON CONFLICT DO NOTHING;

-- Insert Product Images
INSERT INTO product_images (product_id, url, alt_text, display_order, is_primary) VALUES
  ('prod-1', '/images/products/bpc-157.jpg', 'BPC-157 10mg Lyophilized', 0, true),
  ('prod-2', '/images/products/semaglutide.jpg', 'Semaglutide 10mg Lyophilized', 0, true),
  ('prod-3', '/images/products/tirzepatide.jpg', 'Tirzepatide 10mg Lyophilized', 0, true),
  ('prod-4', '/images/products/tb-500.jpg', 'TB-500 10mg Lyophilized', 0, true),
  ('prod-5', '/images/products/ghk-cu.jpg', 'GHK-Cu 50mg Lyophilized', 0, true),
  ('prod-6', '/images/products/ipamorelin.jpg', 'Ipamorelin 5mg Lyophilized', 0, true)
ON CONFLICT DO NOTHING;
