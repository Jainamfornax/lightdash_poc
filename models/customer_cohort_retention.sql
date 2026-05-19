WITH customer_first_order AS (
  SELECT
    customer_id,
    FORMAT_DATE('%Y-%m', MIN(order_date)) AS cohort_month,
    MIN(order_date) AS first_order_date
  FROM `linked-368910.lightdash_poc.ecommerce_order`
  GROUP BY customer_id
),

customer_orders AS (
  SELECT
    o.customer_id,
    c.cohort_month,
    c.first_order_date,
    o.order_date,
    DATE_DIFF(
      DATE_TRUNC(o.order_date, MONTH),
      DATE_TRUNC(c.first_order_date, MONTH),
      MONTH
    ) AS months_since_first
  FROM `linked-368910.lightdash_poc.ecommerce_order` o
  JOIN customer_first_order c ON o.customer_id = c.customer_id
),

cohort_sizes AS (
  SELECT
    cohort_month,
    COUNT(DISTINCT customer_id) AS cohort_size
  FROM customer_first_order
  GROUP BY cohort_month
),

retention AS (
  SELECT
    co.cohort_month,
    co.months_since_first,
    COUNT(DISTINCT co.customer_id) AS active_customers
  FROM customer_orders co
  GROUP BY co.cohort_month, co.months_since_first
),

cohort_revenue AS (
  SELECT
    c.cohort_month,
    DATE_DIFF(
      DATE_TRUNC(o.order_date, MONTH),
      DATE_TRUNC(c.first_order_date, MONTH),
      MONTH
    ) AS months_since_first,
    SUM(o.line_total) AS cohort_month_revenue
  FROM `linked-368910.lightdash_poc.ecommerce_order` o
  JOIN customer_first_order c ON o.customer_id = c.customer_id
  GROUP BY c.cohort_month, 2
)

SELECT
  r.cohort_month,
  r.months_since_first,
  cs.cohort_size,
  r.active_customers,
  SAFE_DIVIDE(r.active_customers, cs.cohort_size) AS retention_rate,
  COALESCE(cr.cohort_month_revenue, 0) AS cohort_month_revenue,
  SAFE_DIVIDE(COALESCE(cr.cohort_month_revenue, 0), r.active_customers) AS revenue_per_active_customer
FROM retention r
JOIN cohort_sizes cs ON r.cohort_month = cs.cohort_month
LEFT JOIN cohort_revenue cr ON r.cohort_month = cr.cohort_month AND r.months_since_first = cr.months_since_first
ORDER BY r.cohort_month, r.months_since_first
