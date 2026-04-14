SELECT
    *,
    MIN(order_date) OVER (PARTITION BY customer_name) AS customer_first_order_date,

    CASE
        WHEN order_date = MIN(order_date) OVER (PARTITION BY customer_name)
        THEN 1 ELSE 0
    END AS is_new_customer,

    CASE
        WHEN order_date > MIN(order_date) OVER (PARTITION BY customer_name)
        THEN 1 ELSE 0
    END AS is_repeat_customer

FROM `linked-368910.lightdash_poc.fact_sales_for_protein_company`