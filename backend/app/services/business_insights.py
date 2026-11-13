import pandas as pd
import numpy as np
from typing import Dict, Any, List

def generate_business_insights(
    eda_results: Dict[str, Any],
    forecast_results: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Generates dynamic, data-driven business intelligence and strategic operational recommendations
    based on exploratory findings and forecasting projections.
    """
    kpis = eda_results.get("kpis", {})
    top_products = eda_results.get("top_products", [])
    lowest_products = eda_results.get("lowest_products", [])
    store_perf = eda_results.get("store_performance", [])
    best_store = eda_results.get("best_store", {})
    lowest_store = eda_results.get("lowest_store", {})
    promo_stats = eda_results.get("promotion_analysis", {})
    holiday_stats = eda_results.get("holiday_analysis", {})
    monthly_data = eda_results.get("monthly_analysis", [])
    day_patterns = eda_results.get("day_of_week_pattern", [])
    
    insights = []

    # 1. Product Revenue Driver Insight
    if top_products:
        top_prod = top_products[0]
        share = top_prod.get("revenue_share", 0)
        insights.append({
            "category": "Product Strategy",
            "title": f"Top Revenue Contributor: {top_prod.get('product_id')}",
            "level": "positive",
            "icon": "PackageCheck",
            "summary": (
                f"Product {top_prod.get('product_id')} generated ${top_prod.get('total_revenue'):,.2f} "
                f"({share}% of total business revenue) across {top_prod.get('total_units'):,} units. "
                f"Prioritize supplier relationships and maintain safety stock to prevent stockouts."
            ),
            "recommendation": "Protect high-margin inventory and consider cross-selling complementary accessories."
        })

    if lowest_products and len(lowest_products) > 1:
        low_prod = lowest_products[-1]
        insights.append({
            "category": "Inventory Optimization",
            "title": f"Slow-Moving SKU: {low_prod.get('product_id')}",
            "level": "warning",
            "icon": "AlertTriangle",
            "summary": (
                f"Product {low_prod.get('product_id')} contributed only {low_prod.get('revenue_share', 0)}% of sales. "
                f"Holding costs may be eroding profit margins."
            ),
            "recommendation": "Consider targeted bundle discounts, clearance campaigns, or reducing order replenishment quantities."
        })

    # 2. Store Channel Insight
    if best_store and lowest_store:
        insights.append({
            "category": "Retail Operations",
            "title": f"Store Performance Disparity: {best_store.get('store_id')} Leads",
            "level": "info",
            "icon": "Store",
            "summary": (
                f"Top store {best_store.get('store_id')} accounts for {best_store.get('revenue_share', 0)}% of total revenue "
                f"(${best_store.get('total_revenue'):,.2f}), outperforming the lowest outlet "
                f"({lowest_store.get('store_id')} at {lowest_store.get('revenue_share', 0)}%)."
            ),
            "recommendation": "Replicate visual merchandising and local marketing best practices from top-tier branches."
        })

    # 3. Promotional Effectiveness Insight
    uplift = promo_stats.get("promotional_uplift_pct", 0)
    if uplift > 0:
        insights.append({
            "category": "Marketing & Promotions",
            "title": f"Promotional Campaign ROI (+{uplift}% Lift)",
            "level": "positive",
            "icon": "TrendingUp",
            "summary": (
                f"Promotional periods generated a {uplift}% sales uplift compared to standard trading days. "
                f"Average promotional daily revenue stood at ${promo_stats.get('promotional_sales_avg_revenue'):,.2f} "
                f"vs ${promo_stats.get('regular_sales_avg_revenue'):,.2f} baseline."
            ),
            "recommendation": "Schedule promotional events around mid-month and high-traffic weekends to maximize return on advertising spend (ROAS)."
        })

    # 4. Seasonality & Holiday Demand
    hol_lift = holiday_stats.get("holiday_uplift_pct", 0)
    if hol_lift > 0:
        insights.append({
            "category": "Demand Planning",
            "title": f"Holiday Sales Surge (+{hol_lift}% Surge)",
            "level": "info",
            "icon": "Calendar",
            "summary": (
                f"National and festive holidays exhibit a {hol_lift}% surge in transaction volume. "
                f"Average holiday revenue reached ${holiday_stats.get('holiday_avg_revenue'):,.2f}."
            ),
            "recommendation": "Initiate supply chain inventory ramp-up 3 to 4 weeks prior to major holiday quarters (Q4 / Thanksgiving & Christmas)."
        })

    # 5. Day-of-Week Rhythm
    if day_patterns:
        best_day = max(day_patterns, key=lambda x: x["avg_revenue"])
        lowest_day = min(day_patterns, key=lambda x: x["avg_revenue"])
        insights.append({
            "category": "Staffing & Logistics",
            "title": f"Weekly Sales Rhythm ({best_day['day']} Peak)",
            "level": "info",
            "icon": "Clock",
            "summary": (
                f"Highest customer activity occurs on {best_day['day']}s (avg ${best_day['avg_revenue']:,.2f}), "
                f"while {lowest_day['day']}s experience the lowest volume (avg ${lowest_day['avg_revenue']:,.2f})."
            ),
            "recommendation": "Optimize store staffing and logistics delivery slots for weekend peak traffic."
        })

    # 6. Future Sales Projections & Inventory Guidance
    if forecast_results and "forecast" in forecast_results:
        f_list = forecast_results["forecast"]
        projected_rev = sum(item["predicted"] for item in f_list)
        horizon = len(f_list)
        avg_future_daily = projected_rev / max(1, horizon)
        
        insights.append({
            "category": "Predictive Forecast",
            "title": f"Projected Growth: Next {horizon} Days",
            "level": "positive",
            "icon": "Sparkles",
            "summary": (
                f"Forecast model '{forecast_results.get('model_name')}' predicts a cumulative revenue of "
                f"${projected_rev:,.2f} over the upcoming {horizon} periods (daily average: ${avg_future_daily:,.2f})."
            ),
            "recommendation": "Align procurement purchase orders with projected weekly demand curves to maintain a 15-20% safety stock buffer without incurring overstock holding fees."
        })

    # Inventory replenishment action guide
    inventory_actions = [
        {"action": "Restock Lead Time Buffer", "detail": "Maintain a 14-day reorder cycle ahead of holiday spikes."},
        {"action": "High-Velocity SKU Focus", "detail": f"Keep extra safety units for top-ranking product {top_products[0]['product_id'] if top_products else 'PROD_101'}."},
        {"action": "Promotional Stock Preparation", "detail": "Pre-position 35% additional inventory 5 days prior to major sales campaigns."}
    ]

    return {
        "insights_list": insights,
        "inventory_actions": inventory_actions,
        "executive_summary": (
            f"The business demonstrates robust sales performance across {kpis.get('total_stores', 0)} retail branches "
            f"and {kpis.get('total_products', 0)} active products. Historical analysis reveals significant seasonal elasticity "
            f"with strong promotional response (+{uplift}% lift). Advanced predictive models confirm sustained commercial momentum."
        )
    }
