-- ============================================================
-- Event Exhibition Platform — Supabase Migration 001
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. ADMIN USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role  text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 2. is_admin() HELPER FUNCTION
--    Used by ALL RLS policies — single source of truth
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────
-- 3. CONTENT BLOCKS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_blocks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page        text NOT NULL,        -- 'home','about','services','footer','settings'
  block       text NOT NULL,        -- 'hero','stats','why_us','process','services_list', etc.
  data        jsonb NOT NULL DEFAULT '{}',
  "order"     int DEFAULT 0,
  is_visible  boolean DEFAULT true,
  updated_at  timestamptz DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS content_blocks_page_block_idx ON content_blocks(page, block);

-- ─────────────────────────────────────────────
-- 4. PROJECTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  event_type      text NOT NULL,  -- 'Exhibition','Conference','Mall Activation','Outdoor','Custom Booth'
  tags            text[] DEFAULT '{}',
  city            text,
  country         text DEFAULT 'UAE',
  year            int,
  booth_size      text,
  services        text[] DEFAULT '{}',
  description     text,
  cover_image_url text,
  is_published    boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  created_by      uuid REFERENCES auth.users(id),
  updated_by      uuid REFERENCES auth.users(id)
);

-- ─────────────────────────────────────────────
-- 5. PROJECT MEDIA (separate — reorder + single delete)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid REFERENCES projects(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('image','video')),
  url         text NOT NULL,
  "order"     int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 6. SERVICE AREAS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_areas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city        text NOT NULL,
  country     text DEFAULT 'UAE',
  description text,
  image_url   text,
  is_active   boolean DEFAULT true,
  "order"     int DEFAULT 0,
  updated_at  timestamptz DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id)
);

-- ─────────────────────────────────────────────
-- 7. MESSAGES (contact form)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text,
  email      text,
  phone      text,
  subject    text,
  message    text,
  is_read    boolean DEFAULT false,
  ip_hash    text,   -- SHA-256 of requester IP for rate limiting
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 8. ENABLE ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media    ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 9. RLS POLICIES
-- ─────────────────────────────────────────────

-- admin_users: only own row or admin
CREATE POLICY "Admin users: read own row" ON admin_users
  FOR SELECT USING (id = auth.uid() OR is_admin());

-- content_blocks
CREATE POLICY "Public: read visible content blocks" ON content_blocks
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins: full access to content_blocks" ON content_blocks
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- projects
CREATE POLICY "Public: read published projects" ON projects
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins: full access to projects" ON projects
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- project_media
CREATE POLICY "Public: read media for published projects" ON project_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_media.project_id AND p.is_published = true
    )
  );

CREATE POLICY "Admins: full access to project_media" ON project_media
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- service_areas
CREATE POLICY "Public: read active service areas" ON service_areas
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins: full access to service_areas" ON service_areas
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- messages: public INSERT, admin manages
CREATE POLICY "Public: submit messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins: manage messages" ON messages
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ─────────────────────────────────────────────
-- 10. SEED: Default content blocks
-- ─────────────────────────────────────────────
INSERT INTO content_blocks (page, block, "order", data) VALUES

-- HOME
('home', 'hero', 1, '{
  "title": "We Build Exhibition Stands That Win Attention",
  "subtitle": "End-to-end custom stand design, fabrication & logistics across the UAE and beyond.",
  "cta_primary": "View Our Projects",
  "cta_primary_link": "/projects",
  "cta_secondary": "Get a Quote",
  "cta_secondary_link": "/contact",
  "background_type": "image",
  "background_url": ""
}'::jsonb),

('home', 'stats', 2, '{
  "items": [
    { "value": "200+", "label": "Projects Delivered" },
    { "value": "15+",  "label": "Cities Covered" },
    { "value": "10+",  "label": "Years Experience" },
    { "value": "98%",  "label": "Client Satisfaction" }
  ]
}'::jsonb),

('home', 'services_overview', 3, '{
  "heading": "What We Do",
  "subheading": "Comprehensive exhibition solutions from concept to completion.",
  "services": [
    { "icon": "Layout",        "title": "Custom Stand Design",      "desc": "Bespoke booth designs tailored to your brand identity and exhibition goals." },
    { "icon": "Hammer",        "title": "Fabrication & Build",      "desc": "High-quality construction using premium materials and skilled craftsmen." },
    { "icon": "Truck",         "title": "Logistics & Installation",  "desc": "Full project management including transport, setup and dismantling." },
    { "icon": "Lightbulb",     "title": "Lighting & AV",            "desc": "Immersive lighting and audio-visual solutions that bring your stand to life." },
    { "icon": "Paintbrush",    "title": "Branding & Graphics",      "desc": "Large-format print and digital branding that commands attention." },
    { "icon": "HeadphonesIcon","title": "On-site Support",          "desc": "Dedicated support team available throughout your event." }
  ]
}'::jsonb),

('home', 'why_choose_us', 4, '{
  "heading": "Why Choose Us",
  "subheading": "We combine creative excellence with flawless execution.",
  "points": [
    { "title": "Fast Turnaround",    "desc": "We deliver on tight deadlines without compromising quality." },
    { "title": "UAE Specialists",    "desc": "Deep knowledge of UAE venues, regulations and logistics." },
    { "title": "End-to-End Service", "desc": "One team handles design, build, transport and teardown." },
    { "title": "Budget Flexible",    "desc": "Solutions for every budget — from modular to fully custom." }
  ],
  "image_url": ""
}'::jsonb),

('home', 'process', 5, '{
  "heading": "How We Work",
  "subheading": "A streamlined process built for speed and quality.",
  "steps": [
    { "step": "01", "title": "Brief & Concept",     "desc": "We understand your goals and create initial concepts." },
    { "step": "02", "title": "Design & Approval",   "desc": "3D renders and detailed plans for your sign-off." },
    { "step": "03", "title": "Fabrication",          "desc": "Expert craftsmen build your stand to spec." },
    { "step": "04", "title": "Install & Support",    "desc": "We handle logistics, setup, and on-site presence." }
  ]
}'::jsonb),

('home', 'cta_banner', 6, '{
  "heading": "Ready to Stand Out at Your Next Exhibition?",
  "subheading": "Let us design and build an unforgettable stand for you.",
  "cta_text": "Get a Free Quote",
  "cta_link": "/contact"
}'::jsonb),

-- ABOUT
('about', 'hero', 1, '{
  "heading": "About Us",
  "subheading": "Crafting exhibition experiences since 2014.",
  "image_url": "",
  "background_url": ""
}'::jsonb),

('about', 'story', 2, '{
  "heading": "Our Story",
  "body": "Founded in 2014, ExhibitPro has grown from a small fabrication workshop into one of the UAE'\''s most trusted exhibition stand specialists. With hundreds of successful projects across Dubai, Abu Dhabi, and international venues, we bring creativity, precision, and passion to every stand we build.",
  "image_url": ""
}'::jsonb),

('about', 'team', 3, '{
  "heading": "Meet the Team",
  "members": []
}'::jsonb),

('about', 'values', 4, '{
  "heading": "Our Values",
  "values": [
    { "title": "Quality First",    "desc": "Premium materials and meticulous craftsmanship in everything we create." },
    { "title": "Client Partnership","desc": "We work as an extension of your team, not just a supplier." },
    { "title": "Innovation",        "desc": "Always exploring new materials, techniques and technologies." }
  ]
}'::jsonb),

-- SERVICES
('services', 'hero', 1, '{
  "heading": "Our Services",
  "subheading": "Everything you need for a world-class exhibition presence.",
  "image_url": ""
}'::jsonb),

('services', 'services_list', 2, '{
  "services": [
    {
      "title": "Custom Stand Design",
      "desc": "Fully bespoke stands designed around your brand, goals and budget.",
      "features": ["3D renders", "Mood boards", "Structural drawings"],
      "image_url": ""
    },
    {
      "title": "Modular Stands",
      "desc": "Reusable, reconfigurable systems perfect for multi-show exhibitors.",
      "features": ["Fast assembly", "Cost-effective", "Multiple configurations"],
      "image_url": ""
    },
    {
      "title": "Fabrication & Build",
      "desc": "In-house workshop with skilled carpenters, metalworkers and finishers.",
      "features": ["Wood & metal", "Curved structures", "Multi-storey"],
      "image_url": ""
    },
    {
      "title": "Logistics & Installation",
      "desc": "Full project management — transport, installation and dismantling.",
      "features": ["UAE-wide delivery", "Venue coordination", "Post-show dismantling"],
      "image_url": ""
    },
    {
      "title": "Lighting & AV",
      "desc": "Professional lighting design and audio-visual integration.",
      "features": ["LED lighting", "Digital screens", "Sound systems"],
      "image_url": ""
    },
    {
      "title": "Branding & Graphics",
      "desc": "Large-format print, digital and environmental branding.",
      "features": ["Backlit panels", "Digital printing", "Vinyl wraps"],
      "image_url": ""
    }
  ]
}'::jsonb),

-- FOOTER
('footer', 'main', 1, '{
  "company_name": "ExhibitPro",
  "tagline": "Premium Exhibition Stand Design & Build",
  "description": "End-to-end exhibition stand specialists serving the UAE and international markets since 2014.",
  "address": "Dubai, United Arab Emirates",
  "phone": "+971 50 000 0000",
  "email": "info@exhibitpro.ae",
  "whatsapp": "+971500000000",
  "socials": [
    { "platform": "Instagram", "icon": "Instagram", "url": "https://instagram.com" },
    { "platform": "LinkedIn",  "icon": "Linkedin",  "url": "https://linkedin.com" },
    { "platform": "Facebook",  "icon": "Facebook",  "url": "https://facebook.com" }
  ],
  "privacy_policy": "Your privacy is important to us. We collect only the information necessary to respond to your enquiries and improve our services. We do not sell or share your data with third parties.",
  "terms": "By using this website, you agree to our terms of service. All content and designs are the intellectual property of ExhibitPro. Reproduction without permission is prohibited."
}'::jsonb),

-- SETTINGS
('settings', 'global', 1, '{
  "site_name": "ExhibitPro",
  "whatsapp_number": "+971500000000",
  "whatsapp_message": "Hi! I am interested in your exhibition stand services.",
  "notification_email": "admin@exhibitpro.ae",
  "show_whatsapp_float": true
}'::jsonb)

ON CONFLICT (page, block) DO NOTHING;

-- ─────────────────────────────────────────────
-- 11. SEED: Default service areas
-- ─────────────────────────────────────────────
INSERT INTO service_areas (city, country, description, "order") VALUES
('Dubai',       'UAE', 'Our home base — serving all major Dubai exhibition venues including DWTC and Dubai Expo City.', 1),
('Abu Dhabi',   'UAE', 'Covering ADNEC and all Abu Dhabi exhibition centres.', 2),
('Sharjah',     'UAE', 'Expo Centre Sharjah and surrounding venues.', 3),
('Riyadh',      'KSA', 'Saudi Arabia''s capital — serving Riyadh International Convention and Exhibition Center.', 4),
('Doha',        'Qatar', 'Qatar National Convention Centre and Doha-based events.', 5),
('International','Various', 'We travel for international projects — contact us to discuss your requirements.', 6)
ON CONFLICT DO NOTHING;
