# 📊 Lightdash Metrics & Dimensions Reference

## Quick Access: All Available Metrics

### 💰 Revenue Metrics
```
✓ total_revenue              → Sum of all final_price
✓ total_subtotal            → Sum before discounts
✓ total_discount            → Sum of all discounts applied
✓ total_cogs                → Cost of goods sold
✓ total_gross_profit        → Revenue - COGS
✓ gross_margin_pct          → Gross Profit % of Revenue
✓ avg_order_value (AOV)     → Revenue / Orders
```

### 📈 Order & Customer Metrics
```
✓ total_orders              → Count of distinct orders
✓ unique_customers          → Count of distinct customers
✓ first_time_customers      → New customer count
✓ returning_customers       → Repeat customer count
✓ pct_first_time_orders     → % of orders from new customers
✓ pct_returning_orders      → % of orders from repeat customers
✓ conversion_rate           → Orders / Customers
✓ repeat_customer_rate      → Repeat Customers / Total Customers
```

### 📢 Marketing & Advertising Metrics
```
✓ total_ad_spend            → Sum of all ad_spend
✓ avg_roas                  → Return on Ad Spend (Revenue / Ad Spend)
✓ total_attributed_revenue  → Revenue from paid channels only
✓ paid_orders               → Count of orders from paid sources
✓ organic_orders            → Count of orders from non-paid sources
✓ cpa                       → Cost Per Acquisition (Ad Spend / Paid Orders)
```

### 🏪 Channel Metrics
```
✓ amazon_revenue            → Revenue from Amazon channel
✓ shopify_revenue           → Revenue from Shopify channel
✓ amazon_orders             → Order count from Amazon
✓ shopify_orders            → Order count from Shopify
```

### 🎯 Campaign Metrics
```
✓ first_time_discount_revenue   → Revenue from first-time customer campaign
✓ black_friday_revenue          → Revenue from Black Friday campaign
✓ easter_special_revenue        → Revenue from Easter Special campaign
✓ organic_revenue               → Revenue from organic traffic
✓ total_campaigns               → Count of unique campaigns running
```

### 🔍 Traffic Source Metrics
```
✓ paid_social_revenue       → Revenue from paid social ads
✓ paid_search_revenue       → Revenue from paid search/Google Ads
✓ organic_source_revenue    → Revenue from organic search
✓ email_revenue             → Revenue from email campaigns
✓ direct_revenue            → Revenue from direct traffic
✓ referral_revenue          → Revenue from referrals
```

### 📱 Device Metrics
```
✓ mobile_revenue            → Revenue from mobile devices
✓ desktop_revenue           → Revenue from desktop
✓ tablet_revenue            → Revenue from tablets
✓ mobile_orders             → Order count from mobile
```

### 👥 Session & Cohort Metrics
```
✓ total_sessions            → Count of unique sessions
✓ orders_per_session        → Average orders per session
✓ customer_lifetime_value   → Avg LTV per customer
✓ total_cohorts             → Count of unique customer cohorts
✓ avg_days_since_first      → Average age of customers
```

### 🎲 Other Metrics
```
✓ avg_discount_rate         → Average discount applied across orders
```

---

## Quick Access: All Available Dimensions

### 🔑 Identifiers
```
→ order_id          (e.g., ORD000001)
→ customer_id       (e.g., C1001)
→ order_number      (e.g., SO-1)
→ session_id        (e.g., S00001)
```

### 📅 Dates
```
→ order_date        (Supports: DAY, WEEK, MONTH, QUARTER, YEAR)
→ created_at        (Order creation date)
```

### 🏢 Channel & Marketing
```
→ channel           (Values: Amazon, Shopify)
→ source            (Values: paid_social, paid_search, organic, direct, email, referral)
→ campaign          (Values: first_time_customer, black_friday, easter_special, organic)
→ device            (Values: mobile, desktop, tablet)
```

### 🛍️ Product
```
→ product_id        (e.g., P001)
→ product_name      (e.g., Whey Isolate - Choc)
→ category          (Values: Powder, Butter, Chips, Bars, Kits)
→ quantity          (Number of items ordered)
```

### 💵 Financial
```
→ unit_price        (Average unit price)
→ subtotal          (Before discount)
→ discount_pct      (0, 10, 15)
→ discount_amount   (Dollar amount discounted)
→ final_price       (After discount)
→ cogs              (Cost of goods sold)
→ gross_profit      (Final price - COGS)
→ ad_spend          (Marketing spend)
→ roas              (Return on Ad Spend ratio)
```

### 👤 Customer
```
→ is_first_time_customer    (TRUE/FALSE)
→ cohort                    (e.g., 2025-01)
→ days_since_first          (Number of days)
→ customer_lifetime_value   (Total $ from customer)
```

---

## 🎨 Sample Dashboard Tiles

### Tile 1: KPI Card
```
Metric:    total_revenue
Period:    Last 30 Days
Comparison: Month over Month
Format:    $XX,XXX
```

### Tile 2: Campaign Performance
```
Metric:    campaign
Breakdown: 
  - first_time_discount_revenue
  - black_friday_revenue
  - easter_special_revenue
  - organic_revenue
Format:    Stacked Bar Chart
```

### Tile 3: Channel Comparison
```
Dimensions: channel
Metrics:
  - total_revenue (color by channel)
  - total_orders (size)
Format:    Pie Chart or Donut
```

### Tile 4: ROAS by Source
```
Dimensions: source
Metrics:    avg_roas
Filter:     ad_spend > 0
Format:    Horizontal Bar Chart
Sort:      Highest to Lowest ROAS
```

### Tile 5: Device Performance
```
Dimensions: device
Metrics:
  - mobile_revenue
  - mobile_orders
  - avg_order_value (by device)
Format:    Table with Conditional Formatting
```

### Tile 6: Campaign Timeline
```
Dimensions: order_date (MONTH), campaign
Metrics:    total_revenue
Format:    Line Chart
Filters:   Date range picker
```

### Tile 7: Customer Cohort Retention
```
Dimensions: cohort
Metrics:    customer_lifetime_value
Format:    Cohort Table / Heatmap
Sort:      Newest to Oldest
```

### Tile 8: ROAS Trend
```
Dimensions: order_date (WEEK)
Metrics:    avg_roas
Filter:     Only paid orders (ad_spend > 0)
Format:    Line Chart with goal line (2.5x)
```

---

## 🎯 Powerful Filter Combinations

### "Campaign Performance Analysis"
```
Filter 1: campaign = "black_friday"
Metrics to Show:
  - total_orders (18)
  - total_revenue ($1,058.55)
  - avg_order_value ($58.81)
  - avg_roas (varies by source)
Break down by: source, device, channel
```

### "First-Time Customer Conversion"
```
Filter 1: is_first_time_customer = TRUE
Metrics to Show:
  - total_orders (28)
  - conversion_rate (43%)
  - avg_order_value ($45.18)
  - cpa (cost per acquisition)
Break down by: source, device, channel
```

### "Paid Marketing Performance"
```
Filter 1: ad_spend > 0
Metrics to Show:
  - total_ad_spend
  - total_attributed_revenue
  - avg_roas
  - cpa
Break down by: source, campaign
Exclude: organic orders
```

### "Repeat Customer Behavior"
```
Filter 1: is_first_time_customer = FALSE
Metrics to Show:
  - unique_customers (27)
  - total_orders (54 from repeats)
  - customer_lifetime_value
  - avg_days_since_first
Break down by: cohort, channel
```

### "Mobile User Journey"
```
Filter 1: device = "mobile"
Metrics to Show:
  - mobile_revenue ($4,001.30)
  - mobile_orders (62)
  - avg_order_value ($64.54)
  - conversion_rate (for mobile)
Break down by: source, campaign, channel
```

---

## 📊 Pre-Built Queries (Copy-Paste Ready)

### Query 1: Campaign ROI Comparison
```
Campaign              Orders  Revenue      Ad Spend   ROAS
First-Time Customer   28      $1,265.10    $545.20    2.32x
Black Friday          18      $1,058.55    $625.30    1.69x
Easter Special        32      $2,124.60    $925.80    2.30x
Organic               54      $4,301.05    $0         N/A
```

### Query 2: Channel Performance
```
Channel   Orders  Revenue      AOV     ROAS (Paid)
Amazon    68      $4,521.45    $66.49  2.18x
Shopify   64      $4,227.85    $66.06  2.21x
```

### Query 3: Top Performing Source + Campaign Combo
```
Source        Campaign        Revenue      ROAS
Paid Search   Easter Special  $487.50      2.15x
Paid Social   Easter Special  $425.80      2.28x
Email         First-Time      $312.40      N/A
```

---

## ⚠️ Common Mistakes & Solutions

### ❌ Problem: ROAS = 0
**Cause:** Including organic traffic (ad_spend = 0)  
**Solution:** Filter to `ad_spend > 0` only

### ❌ Problem: AOV Looks Too Low
**Cause:** Including discounted orders in calc  
**Solution:** Use `final_price` not `subtotal`

### ❌ Problem: Can't Compare Channels
**Cause:** Amazon & Shopify have different traffic sources  
**Solution:** Show both dimensions: channel + source

### ❌ Problem: ROAS Looks Inflated in Campaign Periods
**Cause:** High-volume discounted orders inflate numbers  
**Solution:** Compare ROAS by source within campaign

### ❌ Problem: Customer LTV is Zero
**Cause:** Calculating for one order only  
**Solution:** Use `customer_lifetime_value` dimension (pre-calculated)

---

## 🔥 Power User Queries

### "Which Campaign Converted Best?"
```
Group by: campaign
Show: 
  - count(DISTINCT order_id) as first_time_customers
  - avg(customer_lifetime_value) as ltv
  - count(DISTINCT CASE WHEN days_since_first > 30 THEN customer_id END) as repeat_purchases
```

### "What's Our Mobile-Only Problem?"
```
Filter: device = "mobile"
Group by: source
Show:
  - total_revenue
  - conversion_rate
  - avg_order_value
Compare to: desktop + tablet averages
```

### "Which Cohort Has Best Retention?"
```
Group by: cohort
Show:
  - count(DISTINCT customer_id) as initial_customers
  - count(DISTINCT CASE WHEN days_since_first > 0 THEN customer_id END) as repeat_customers
  - avg(customer_lifetime_value)
Sort by: LTV DESC
```

---

## ✅ Quick Sanity Checks

Before publishing dashboard, verify:

- [ ] Total revenue = sum of all final_price values ✓ $8,749.30
- [ ] Total orders = 132 ✓
- [ ] Unique customers = 65 ✓
- [ ] AOV = revenue / orders = $66.28 ✓
- [ ] ROAS > 1.0 for all paid campaigns ✓
- [ ] Campaign totals = 18 + 32 + 28 + 54 = 132 ✓
- [ ] Channel totals = 68 + 64 = 132 ✓
- [ ] Device totals = 62 + 52 + 18 = 132 ✓

---

**All metrics pre-calculated in `ecommerce_orders_v2.csv` and defined in `fact_nutrition_ecommerce.yml`** ✨
