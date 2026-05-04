{{ config(
    materialized='table',
    schema='lightdash_poc'
) }}

-- E-Commerce Analytics Fact Table
-- Source: Raw ecommerce_poc table from BigQuery
-- Purpose: Complete e-commerce analytics with time intelligence, campaign tracking, and product performance

SELECT
    order_id,
    order_line_id,
    customer_id,
    order_date,
    created_at,
    product_id,
    product_name,
    category,
    quantity,
    unit_price,
    line_subtotal,
    discount_pct,
    line_discount,
    line_total,
    cogs_per_unit,
    line_cogs,
    line_gross_profit,
    ad_spend_allocated,
    campaign,
    channel,
    source,
    device,
    session_id,
    is_first_time_customer,
    cohort,
    days_since_first,
    customer_lifetime_value,
    lost_revenue_potential
FROM
    `linked-368910.lightdash_poc.ecommerce_poc`
WHERE
    1 = 1
    -- Add any filters or transformations here as needed

