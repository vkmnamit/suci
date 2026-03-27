-- SUCI - Supabase Database Schema
-- Implementations for Section 8.3 (Time-Series) and 8.4 (Relational)

-- 🧬 City Graph (Zones & Infrastructure)
CREATE TABLE IF NOT EXISTS zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    area_km2 FLOAT,
    population INTEGER,
    lat FLOAT,
    lng FLOAT,
    carbon_score FLOAT DEFAULT 0.0,
    carbon_intensity FLOAT DEFAULT 0.0,
    renewable_fraction FLOAT DEFAULT 0.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buildings (
    id TEXT PRIMARY KEY,
    zone_id TEXT REFERENCES zones(id),
    type TEXT CHECK (type IN ('residential', 'commercial', 'industrial')),
    floor_area_m2 FLOAT,
    energy_rating TEXT,
    hvac_load_kw FLOAT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- 🏗️ SUCI CONSOLIDATED SCHEMA (Relational + Graph + Time Series)

-- 1. Governance & Assets (Section 8.4)
CREATE TABLE IF NOT EXISTS organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tier TEXT, -- v1, v2, v3
    city_ids TEXT[], 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT,
    org_id UUID REFERENCES organisations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 🏙️ 2. City Graph (Relational Representation)
CREATE TABLE IF NOT EXISTS zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lat FLOAT, lng FLOAT,
    carbon_score FLOAT DEFAULT 0.0,
    renewable_fraction FLOAT DEFAULT 0.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ⏱️ 3. Time Series Data (Section 8.3)
CREATE TABLE IF NOT EXISTS energy_readings (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    zone_id TEXT REFERENCES zones(id),
    mwh FLOAT NOT NULL,
    source TEXT CHECK (source IN ('grid', 'solar', 'wind')),
    is_forecast BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS carbon_scores (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    zone_id TEXT REFERENCES zones(id),
    kg_co2 FLOAT NOT NULL,
    intensity_kg_per_mwh FLOAT
);

-- 🤖 4. AI & Monitoring Logs
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    org_id UUID REFERENCES organisations(id),
    user_id UUID REFERENCES users(id),
    action TEXT,
    resource_id TEXT,
    payload JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (Indices for speed)
CREATE INDEX IF NOT EXISTS idx_energy_zone ON energy_readings(zone_id, timestamp DESC);

);

CREATE TABLE IF NOT EXISTS substations (
    id TEXT PRIMARY KEY,
    zone_id TEXT REFERENCES zones(id),
    capacity_mw FLOAT,
    current_load_mw FLOAT,
    renewable_fraction FLOAT,
    grid_voltage FLOAT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ⏱️ Time-Series (Core Decision Engine data)
CREATE TABLE IF NOT EXISTS energy_readings (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    zone_id TEXT REFERENCES zones(id),
    mwh FLOAT NOT NULL,
    source TEXT CHECK (source IN ('grid', 'solar', 'wind')),
    is_forecast BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS carbon_scores (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    zone_id TEXT REFERENCES zones(id),
    kg_co2 FLOAT NOT NULL,
    intensity_kg_per_mwh FLOAT,
    source_breakdown JSONB -- Breakdown of emissions per source type
);

CREATE TABLE IF NOT EXISTS weather_readings (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    zone_id TEXT REFERENCES zones(id),
    temp_c FLOAT,
    solar_w_m2 FLOAT,
    wind_ms FLOAT,
    humidity_pct FLOAT
);

-- 🤖 AI & RLAIF (Self-improvement logs)
CREATE TABLE IF NOT EXISTS model_predictions (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    zone_id TEXT REFERENCES zones(id),
    predicted_mwh FLOAT,
    actual_mwh FLOAT,
    mape FLOAT,
    model_version TEXT
);

CREATE TABLE IF NOT EXISTS rlaif_log (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    iteration INTEGER,
    mape_before FLOAT,
    mape_after FLOAT,
    root_cause TEXT,
    model_version TEXT
);

CREATE TABLE IF NOT EXISTS intervention_log (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    zone_id TEXT REFERENCES zones(id),
    action TEXT,
    dispatched_by TEXT,
    projected_co2_reduction FLOAT,
    actual_co2_reduction FLOAT
);

-- 📊 Management & Reporting
CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT,
    lat FLOAT,
    lng FLOAT,
    timezone TEXT,
    data_source_config JSONB
);

CREATE TABLE IF NOT EXISTS alert_configs (
    id BIGSERIAL PRIMARY KEY,
    zone_id TEXT REFERENCES zones(id),
    metric TEXT,
    threshold FLOAT,
    operator TEXT,
    notify_emails TEXT[]
);

CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    type TEXT,
    params JSONB,
    status TEXT,
    s3_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    action TEXT,
    resource_type TEXT,
    resource_id TEXT,
    payload JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_energy_readings_zone_time ON energy_readings(zone_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_carbon_scores_zone_time ON carbon_scores(zone_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_weather_readings_zone_time ON weather_readings(zone_id, timestamp DESC);
