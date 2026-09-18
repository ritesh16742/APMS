CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('PERSONNEL','ADMIN')),
  personnel_id INTEGER UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personnel (
  id SERIAL PRIMARY KEY,
  service_number VARCHAR(40) UNIQUE NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  rank VARCHAR(80) NOT NULL,
  unit VARCHAR(160) NOT NULL,
  date_of_birth DATE,
  blood_group VARCHAR(8),
  phone VARCHAR(30),
  email VARCHAR(160),
  address TEXT,
  joining_date DATE,
  current_posting_unit VARCHAR(160),
  current_posting_location VARCHAR(160),
  service_status VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_personnel_id_fkey') THEN
    ALTER TABLE users ADD CONSTRAINT users_personnel_id_fkey FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS family (
  id SERIAL PRIMARY KEY,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  relationship VARCHAR(80) NOT NULL,
  date_of_birth DATE,
  occupation VARCHAR(120),
  contact_number VARCHAR(30),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaves (
  id SERIAL PRIMARY KEY,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  leave_type VARCHAR(80) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
  remarks TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS postings (
  id SERIAL PRIMARY KEY,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  unit VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  document_name VARCHAR(180) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  description TEXT,
  storage_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (expiry_date IS NULL OR issue_date IS NULL OR expiry_date >= issue_date)
);

CREATE TABLE IF NOT EXISTS awards (
  id SERIAL PRIMARY KEY,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  award_name VARCHAR(180) NOT NULL,
  award_date DATE,
  awarding_authority VARCHAR(180),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  payment_type VARCHAR(100) NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  payment_date DATE NOT NULL,
  payment_month VARCHAR(30),
  slip_reference VARCHAR(100) UNIQUE,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_family_personnel ON family(personnel_id);
CREATE INDEX IF NOT EXISTS idx_leaves_personnel ON leaves(personnel_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
CREATE INDEX IF NOT EXISTS idx_postings_personnel ON postings(personnel_id);
CREATE INDEX IF NOT EXISTS idx_documents_personnel ON documents(personnel_id);
CREATE INDEX IF NOT EXISTS idx_awards_personnel ON awards(personnel_id);
CREATE INDEX IF NOT EXISTS idx_payments_personnel ON payments(personnel_id);
