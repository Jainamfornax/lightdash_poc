SELECT
  *,

  -- Time dimensions
  EXTRACT(YEAR FROM transaction_date) AS transaction_year,
  EXTRACT(QUARTER FROM transaction_date) AS transaction_quarter,
  EXTRACT(MONTH FROM transaction_date) AS transaction_month,
  FORMAT_DATE('%B', transaction_date) AS transaction_month_name,
  EXTRACT(WEEK FROM transaction_date) AS transaction_week,
  FORMAT_DATE('%A', transaction_date) AS transaction_day_name,

  -- Period flags
  CASE WHEN EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE())
       AND transaction_date <= CURRENT_DATE() THEN TRUE ELSE FALSE END AS is_ytd,

  CASE WHEN EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE())
       AND EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE())
       AND transaction_date <= CURRENT_DATE() THEN TRUE ELSE FALSE END AS is_mtd,

  CASE WHEN EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE())
       AND EXTRACT(QUARTER FROM transaction_date) = EXTRACT(QUARTER FROM CURRENT_DATE())
       AND transaction_date <= CURRENT_DATE() THEN TRUE ELSE FALSE END AS is_qtd,

  CASE WHEN EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE()) - 1
       AND EXTRACT(DAYOFYEAR FROM transaction_date) <= EXTRACT(DAYOFYEAR FROM CURRENT_DATE())
       THEN TRUE ELSE FALSE END AS is_sply,

  CASE WHEN transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
       THEN TRUE ELSE FALSE END AS is_last_30_days,

  CASE WHEN transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
       THEN TRUE ELSE FALSE END AS is_last_90_days

FROM `linked-368910`.`lightdash_poc`.`fact_sales`
