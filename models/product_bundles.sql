SELECT
  o1.product_name as main_sku,
  o2.product_name as bundled_sku,
  COUNT(DISTINCT o1.order_id) as order_count,
  ROUND(COUNT(DISTINCT o1.order_id) / COUNT(DISTINCT o1.order_id) OVER (PARTITION BY o1.product_name), 2) as confidence_score,
  ROUND(COUNT(DISTINCT o1.order_id) / COUNT(DISTINCT o1.order_id) OVER () * 100, 2) as bundle_percentage
FROM `linked-368910.lightdash_poc.ecommerce_order` o1
INNER JOIN `linked-368910.lightdash_poc.ecommerce_order` o2
  ON o1.order_id = o2.order_id
  AND o1.product_id != o2.product_id
WHERE o1.product_id < o2.product_id  -- Avoid duplicates (A,B) and (B,A)
GROUP BY main_sku, bundled_sku
HAVING order_count >= 2  -- Only bundles bought together 2+ times
ORDER BY order_count DESC
