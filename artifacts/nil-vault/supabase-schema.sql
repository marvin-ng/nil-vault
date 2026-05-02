-- NIL Vault — Supabase Schema + RLS
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ─── EXTENSIONS ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROGRAMS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  school      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read their program"
  ON programs FOR SELECT
  USING (
    id IN (
      SELECT program_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ─── PROFILES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  sport       TEXT,
  school      TEXT,
  division    TEXT,
  role        TEXT NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'admin')),
  program_id  UUID REFERENCES programs(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Athletes can only read/write their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Admins can read profiles within their program
CREATE POLICY "Admins can read athletes in their program"
  ON profiles FOR SELECT
  USING (
    program_id IS NOT NULL AND
    program_id = (SELECT program_id FROM profiles WHERE id = auth.uid())
  );

-- ─── DEALS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  brand_name        TEXT NOT NULL,
  amount            NUMERIC(10, 2),
  status            TEXT NOT NULL DEFAULT 'inquiry'
                    CHECK (status IN ('inquiry', 'negotiating', 'signed', 'posted', 'paid')),
  deliverable_type  TEXT,
  deadline          DATE,
  source            TEXT CHECK (source IN ('dm', 'email', 'other')),
  notes             TEXT,
  ftc_compliant     BOOLEAN DEFAULT false,
  caption           TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can CRUD own deals"
  ON deals FOR ALL
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Admins can read deals of athletes in their program"
  ON deals FOR SELECT
  USING (
    athlete_id IN (
      SELECT id FROM profiles
      WHERE program_id = (SELECT program_id FROM profiles WHERE id = auth.uid())
    )
  );

-- ─── DELIVERABLES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deliverables (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id     UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  completed   BOOLEAN DEFAULT false,
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can CRUD own deliverables"
  ON deliverables FOR ALL
  USING (
    deal_id IN (SELECT id FROM deals WHERE athlete_id = auth.uid())
  )
  WITH CHECK (
    deal_id IN (SELECT id FROM deals WHERE athlete_id = auth.uid())
  );

CREATE POLICY "Admins can read deliverables in their program"
  ON deliverables FOR SELECT
  USING (
    deal_id IN (
      SELECT d.id FROM deals d
      JOIN profiles p ON p.id = d.athlete_id
      WHERE p.program_id = (SELECT program_id FROM profiles WHERE id = auth.uid())
    )
  );

-- ─── PAYMENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id     UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  athlete_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount      NUMERIC(10, 2) NOT NULL,
  paid_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can CRUD own payments"
  ON payments FOR ALL
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Admins can read payments in their program"
  ON payments FOR SELECT
  USING (
    athlete_id IN (
      SELECT id FROM profiles
      WHERE program_id = (SELECT program_id FROM profiles WHERE id = auth.uid())
    )
  );

-- ─── DOCUMENTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id     UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  athlete_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can CRUD own documents"
  ON documents FOR ALL
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Admins can read documents in their program"
  ON documents FOR SELECT
  USING (
    athlete_id IN (
      SELECT id FROM profiles
      WHERE program_id = (SELECT program_id FROM profiles WHERE id = auth.uid())
    )
  );

-- ─── STORAGE BUCKET ───────────────────────────────────────────────────────────
-- Run in Dashboard → Storage → New Bucket → name: "contracts", toggle Private
-- Then add these policies in Storage → Policies:
--
-- INSERT: (auth.uid() = owner) AND bucket_id = 'contracts'
-- SELECT: (auth.uid()::text = (storage.foldername(name))[1]) AND bucket_id = 'contracts'
-- DELETE: (auth.uid()::text = (storage.foldername(name))[1]) AND bucket_id = 'contracts'

-- ─── AUTO-UPDATE updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'athlete');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
