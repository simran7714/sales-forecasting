-- =====================================================================
-- SALES FORECASTING SYSTEM - SUPABASE DATABASE SCHEMA
-- Project ID: wrsmvucfxqaxkunxblqj
-- "Analyze Past Sales. Predict Future Growth."
-- =====================================================================

-- 1. SALES DATASETS TABLE (Stores metadata for each uploaded dataset)
CREATE TABLE IF NOT EXISTS sales_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    total_rows INT NOT NULL DEFAULT 0,
    total_columns INT NOT NULL DEFAULT 0,
    is_sample BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. HISTORICAL SALES TRANSACTIONS (Stores cleaned daily sales records)
CREATE TABLE IF NOT EXISTS historical_sales (
    id BIGSERIAL PRIMARY KEY,
    dataset_id UUID REFERENCES sales_datasets(id) ON DELETE CASCADE,
    sale_date DATE NOT NULL,
    product_id TEXT NOT NULL,
    store_id TEXT NOT NULL,
    units_sold INT NOT NULL,
    revenue NUMERIC(14, 2) NOT NULL,
    promotion INT DEFAULT 0,
    holiday INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create fast query indexes for historical sales
CREATE INDEX IF NOT EXISTS idx_sales_dataset_date ON historical_sales(dataset_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_prod_date ON historical_sales(product_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_store_date ON historical_sales(store_id, sale_date);

-- 3. FORECAST RUNS TABLE (Stores model training and execution metadata)
CREATE TABLE IF NOT EXISTS forecast_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES sales_datasets(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    frequency TEXT DEFAULT 'D',
    horizon_periods INT NOT NULL,
    target_metric TEXT DEFAULT 'Revenue',
    product_filter TEXT DEFAULT 'ALL',
    store_filter TEXT DEFAULT 'ALL',
    mae NUMERIC(14, 2),
    mse NUMERIC(20, 4),
    rmse NUMERIC(14, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. FORECAST PREDICTIONS TABLE (Stores future projected values with 95% confidence intervals)
CREATE TABLE IF NOT EXISTS forecast_predictions (
    id BIGSERIAL PRIMARY KEY,
    forecast_run_id UUID REFERENCES forecast_runs(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    predicted_value NUMERIC(14, 2) NOT NULL,
    lower_bound NUMERIC(14, 2),
    upper_bound NUMERIC(14, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. MODEL EVALUATIONS TABLE (Stores comparative benchmarks: RF, Linear Reg, ARIMA, MA)
CREATE TABLE IF NOT EXISTS model_evaluations (
    id BIGSERIAL PRIMARY KEY,
    dataset_id UUID REFERENCES sales_datasets(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    mae NUMERIC(14, 2) NOT NULL,
    mse NUMERIC(20, 4) NOT NULL,
    rmse NUMERIC(14, 2) NOT NULL,
    is_best BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. BUSINESS INSIGHTS TABLE (Stores dynamic actionable takeaways)
CREATE TABLE IF NOT EXISTS business_insights (
    id BIGSERIAL PRIMARY KEY,
    dataset_id UUID REFERENCES sales_datasets(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    level TEXT DEFAULT 'info', -- 'positive', 'warning', 'info'
    summary TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables open read/write access for your publishable & secret keys
-- =====================================================================

ALTER TABLE sales_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;

-- Allow read/write access for publishable anon key & service key
CREATE POLICY "Allow public read-write for sales_datasets" ON sales_datasets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for historical_sales" ON historical_sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for forecast_runs" ON forecast_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for forecast_predictions" ON forecast_predictions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for model_evaluations" ON model_evaluations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for business_insights" ON business_insights FOR ALL USING (true) WITH CHECK (true);
