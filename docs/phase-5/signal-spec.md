# Signal Index Specification v1

- **Author:** Data Scientist
- **Status:** Draft

This document defines the rules for the Signal Index, which categorizes business performance into three levels: Green (Healthy), Orange (Warning), and Red (Critical).

## 1. Signal Levels

The signal is determined by evaluating a set of rules. The highest severity level triggered by any rule becomes the final signal for the period.

- **🟢 Green (Healthy):** Business is performing within acceptable parameters.
- **🟠 Orange (Warning):** One or more key metrics are deviating from the norm, requiring attention.
- **🔴 Red (Critical):** One or more key metrics are at a critical level, requiring immediate action.

## 2. Signal Rules

These rules are evaluated based on the most recent monthly data.

### Rule 1: Profit Margin

- **Metric:** `(Net Profit / Total Sales) * 100`
- **Comparison:** Compared against industry average profit margin.

- **🔴 Red Signal:**
  - Profit Margin is **less than 50%** of the industry average.
  - *Example: Industry average is 15%, business is at 7%.*

- **🟠 Orange Signal:**
  - Profit Margin is **between 50% and 80%** of the industry average.
  - *Example: Industry average is 15%, business is at 10%.*

- **🟢 Green Signal:**
  - Profit Margin is **above 80%** of the industry average.

### Rule 2: Sales Growth (Month-over-Month)

- **Metric:** `((Current Month Sales - Previous Month Sales) / Previous Month Sales) * 100`

- **🔴 Red Signal:**
  - Sales Growth is **below -15%**.

- **🟠 Orange Signal:**
  - Sales Growth is **between -15% and 0%**.

- **🟢 Green Signal:**
  - Sales Growth is **0% or greater**.

### Rule 3: Settlement Delays

- **Metric:** `Total amount of all currently delayed settlements.`
- **Comparison:** Compared against a fixed threshold.

- **🔴 Red Signal:**
  - Total delayed settlement amount is **greater than 1,000,000 KRW**.

- **🟠 Orange Signal:**
  - Total delayed settlement amount is **between 1 KRW and 1,000,000 KRW**.

- **🟢 Green Signal:**
  - There are **no delayed settlements**.

## 3. Final Signal Logic

The final signal is the most severe signal triggered by any of the rules above.

```
IF (Rule1 == Red OR Rule2 == Red OR Rule3 == Red) THEN
  FinalSignal = Red
ELSE IF (Rule1 == Orange OR Rule2 == Orange OR Rule3 == Orange) THEN
  FinalSignal = Orange
ELSE
  FinalSignal = Green
END IF
```
