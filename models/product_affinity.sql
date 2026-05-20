-- Product Affinity: which products are frequently bought together
-- Self-join on order_id to find all product pairs within the same order
WITH order_products AS (
  SELECT
    order_id,
    order_date,
    product_id,
    product_name,
    category,
    line_total,
    line_gross_profit
  FROM `linked-368910.lightdash_poc.ecommerce_order`
),

-- Generate all unique product pairs within each order
product_pairs AS (
  SELECT
    a.order_id,
    a.order_date,
    a.product_id AS product_a_id,
    a.product_name AS product_a_name,
    a.category AS category_a,
    b.product_id AS product_b_id,
    b.product_name AS product_b_name,
    b.category AS category_b,
    a.line_total + b.line_total AS pair_revenue,
    a.line_gross_profit + b.line_gross_profit AS pair_profit
  FROM order_products a
  INNER JOIN order_products b
    ON a.order_id = b.order_id
    AND a.product_id < b.product_id  -- avoid duplicates and self-pairs
)

SELECT
  product_a_id,
  product_a_name,
  category_a,
  product_b_id,
  product_b_name,
  category_b,
  CONCAT(product_a_name, ' + ', product_b_name) AS bundle_pair,
  CASE
    WHEN category_a <= category_b THEN CONCAT(category_a, ' + ', category_b)
    ELSE CONCAT(category_b, ' + ', category_a)
  END AS category_pair,
  CASE
    WHEN category_a = category_b THEN 'Same Category'
    ELSE 'Cross Category'
  END AS bundle_type,
  COUNT(DISTINCT order_id) AS times_bought_together,
  SUM(pair_revenue) AS total_pair_revenue,
  SUM(pair_profit) AS total_pair_profit,
  SAFE_DIVIDE(SUM(pair_profit), SUM(pair_revenue)) AS pair_margin_pct,
  AVG(pair_revenue) AS avg_pair_revenue
FROM product_pairs
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9
ORDER BY times_bought_together DESC
