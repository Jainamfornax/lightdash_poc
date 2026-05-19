SELECT
  customer_id,
  COUNT(DISTINCT order_id) AS total_orders,
  SUM(line_total) AS total_revenue,
  SUM(line_gross_profit) AS total_profit,
  MIN(order_date) AS first_order_date,
  MAX(order_date) AS last_order_date,
  MAX(customer_lifetime_value) AS lifetime_value,
  COUNTIF(is_first_time_customer = FALSE) > 0 AS is_repeat_customer,
  SAFE_DIVIDE(SUM(line_gross_profit), SUM(line_total)) AS avg_margin_pct,
  STRING_AGG(DISTINCT category, ', ' ORDER BY category) AS categories_purchased,
  STRING_AGG(DISTINCT channel, ', ' ORDER BY channel) AS channels_used,
  FORMAT_DATE('%Y-%m', MIN(order_date)) AS cohort
FROM `linked-368910.lightdash_poc.ecommerce_order`
GROUP BY customer_id
ORDER BY total_revenue DESC
