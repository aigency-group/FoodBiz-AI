# Data Schemas for KPI Aggregation

- **Author:** Data Scientist
- **Status:** Draft

This document defines the SQL table schemas for aggregating the key performance indicators (KPIs) required for the dashboard.

## 1. `daily_sales`

Stores daily aggregated sales data for each business.

```sql
CREATE TABLE daily_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL, -- Foreign key to a businesses table
  date DATE NOT NULL,
  total_sales NUMERIC(10, 2) NOT NULL,
  transaction_count INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, date)
);
```

## 2. `daily_costs`

Stores daily aggregated cost data for each business.

```sql
CREATE TABLE daily_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  date DATE NOT NULL,
  total_costs NUMERIC(10, 2) NOT NULL,
  cost_category VARCHAR(50), -- e.g., ingredients, labor, rent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, date, cost_category)
);
```

## 3. `settlement_delays`

Tracks delayed settlements from payment processors or delivery platforms.

```sql
CREATE TABLE settlement_delays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  processor VARCHAR(100) NOT NULL, -- e.g., Visa, Mastercard, DeliveryApp
  delayed_amount NUMERIC(10, 2) NOT NULL,
  expected_date DATE NOT NULL,
  actual_date DATE,
  status VARCHAR(20) DEFAULT 'delayed', -- delayed, resolved
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```
