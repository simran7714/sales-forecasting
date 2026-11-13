import pandas as pd
import numpy as np
from typing import Dict, Any, List

def perform_eda(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs comprehensive Exploratory Data Analysis (EDA) on cleaned sales data:
    - Sales Overview (Total, Average, Min, Max, Standard Deviation)
    - Temporal Aggregations (Daily, Weekly, Monthly, Yearly)
    - Trend & Seasonality Analysis (Day of week, Monthly patterns, Growth rates, Peaks/Lows)
    - Product Performance (Best and lowest selling by revenue & units)
    - Store Performance (Store comparisons, market shares, top/bottom stores)
    - Promotion & Holiday Impact Analysis (Uplift percentages, comparisons)
    """
    df_work = df.copy()
    df_work["Date"] = pd.to_datetime(df_work["Date"])
    df_work["Year"] = df_work["Date"].dt.year
    df_work["Month"] = df_work["Date"].dt.month
    df_work["Month_Name"] = df_work["Date"].dt.strftime("%b")
    df_work["Year_Month"] = df_work["Date"].dt.strftime("%Y-%m")
    df_work["Day_Name"] = df_work["Date"].dt.strftime("%a")
    df_work["Day_Of_Week"] = df_work["Date"].dt.dayofweek # Mon=0, Sun=6
    df_work["Week"] = df_work["Date"].dt.isocalendar().week

    # --- 1. OVERALL SALES KPIS ---
    total_revenue = float(df_work["Revenue"].sum())
    total_units = int(df_work["Units_Sold"].sum())
    total_records = len(df_work)
    total_products = int(df_work["Product_ID"].nunique())
    total_stores = int(df_work["Store_ID"].nunique())
    avg_order_value = float(df_work["Revenue"].mean())
    avg_units_per_order = float(df_work["Units_Sold"].mean())
    
    # Daily overall aggregation for time series curves
    daily_agg = df_work.groupby("Date").agg({
        "Revenue": "sum",
        "Units_Sold": "sum",
        "Promotion": "max",
        "Holiday": "max"
    }).reset_index().sort_values("Date")
    
    daily_agg["Date_Str"] = daily_agg["Date"].dt.strftime("%Y-%m-%d")
    daily_agg["Revenue_MA7"] = daily_agg["Revenue"].rolling(window=7, min_periods=1).mean().round(2)
    daily_agg["Revenue_MA30"] = daily_agg["Revenue"].rolling(window=30, min_periods=1).mean().round(2)

    # Convert daily series for frontend charts (subsample if more than 365 points for responsive rendering)
    daily_trend = []
    step = max(1, len(daily_agg) // 250) if len(daily_agg) > 400 else 1
    for _, row in daily_agg.iloc[::step].iterrows():
        daily_trend.append({
            "date": row["Date_Str"],
            "revenue": round(float(row["Revenue"]), 2),
            "units": int(row["Units_Sold"]),
            "ma7": round(float(row["Revenue_MA7"]), 2),
            "ma30": round(float(row["Revenue_MA30"]), 2),
            "is_promo": int(row["Promotion"]),
            "is_holiday": int(row["Holiday"])
        })

    # --- 2. TEMPORAL AGGREGATIONS ---
    # Weekly Analysis
    weekly_agg = df_work.groupby(pd.Grouper(key="Date", freq="W")).agg({
        "Revenue": "sum",
        "Units_Sold": "sum"
    }).reset_index()
    weekly_series = [
        {"week": r["Date"].strftime("%Y-W%W"), "revenue": round(float(r["Revenue"]), 2), "units": int(r["Units_Sold"])}
        for _, r in weekly_agg.tail(52).iterrows()
    ]

    # Monthly Revenue & Growth (MoM)
    monthly_agg = df_work.groupby("Year_Month").agg({
        "Revenue": "sum",
        "Units_Sold": "sum"
    }).reset_index().sort_values("Year_Month")
    monthly_agg["MoM_Growth"] = monthly_agg["Revenue"].pct_change() * 100
    monthly_agg["MoM_Growth"] = monthly_agg["MoM_Growth"].fillna(0).round(2)
    
    monthly_analysis = [
        {
            "month": r["Year_Month"],
            "revenue": round(float(r["Revenue"]), 2),
            "units": int(r["Units_Sold"]),
            "growth_rate": float(r["MoM_Growth"])
        }
        for _, r in monthly_agg.iterrows()
    ]

    # Yearly Analysis
    yearly_agg = df_work.groupby("Year").agg({
        "Revenue": "sum",
        "Units_Sold": "sum"
    }).reset_index().sort_values("Year")
    yearly_analysis = [
        {"year": str(int(r["Year"])), "revenue": round(float(r["Revenue"]), 2), "units": int(r["Units_Sold"])}
        for _, r in yearly_agg.iterrows()
    ]

    # --- 3. TREND & SEASONALITY PATTERNS ---
    # Day-of-Week pattern (Mon to Sun)
    dow_order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    dow_agg = df_work.groupby(["Day_Of_Week", "Day_Name"]).agg({
        "Revenue": "mean",
        "Units_Sold": "mean"
    }).reset_index().sort_values("Day_Of_Week")
    day_of_week_pattern = [
        {
            "day": r["Day_Name"],
            "avg_revenue": round(float(r["Revenue"]), 2),
            "avg_units": round(float(r["Units_Sold"]), 1)
        }
        for _, r in dow_agg.iterrows()
    ]

    # Month-of-Year seasonality (Jan to Dec average)
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    moy_agg = df_work.groupby(["Month", "Month_Name"]).agg({
        "Revenue": "mean",
        "Units_Sold": "mean"
    }).reset_index().sort_values("Month")
    monthly_seasonality = [
        {
            "month": r["Month_Name"],
            "avg_revenue": round(float(r["Revenue"]), 2),
            "avg_units": round(float(r["Units_Sold"]), 1)
        }
        for _, r in moy_agg.iterrows()
    ]

    # Peak & Low-demand dates
    daily_sorted = daily_agg.sort_values(by="Revenue", ascending=False)
    peak_periods = [
        {"date": r["Date_Str"], "revenue": round(float(r["Revenue"]), 2), "units": int(r["Units_Sold"])}
        for _, r in daily_sorted.head(5).iterrows()
    ]
    low_periods = [
        {"date": r["Date_Str"], "revenue": round(float(r["Revenue"]), 2), "units": int(r["Units_Sold"])}
        for _, r in daily_sorted.tail(5).sort_values("Revenue").iterrows()
    ]

    # --- 4. PRODUCT PERFORMANCE ANALYSIS ---
    prod_agg = df_work.groupby("Product_ID").agg({
        "Revenue": ["sum", "mean"],
        "Units_Sold": ["sum", "mean"]
    })
    prod_agg.columns = ["total_revenue", "avg_revenue", "total_units", "avg_units"]
    prod_agg = prod_agg.reset_index()
    prod_agg["revenue_share"] = (prod_agg["total_revenue"] / max(1, total_revenue)) * 100
    prod_agg = prod_agg.sort_values(by="total_revenue", ascending=False)
    
    product_performance = [
        {
            "product_id": r["Product_ID"],
            "total_revenue": round(float(r["total_revenue"]), 2),
            "avg_revenue": round(float(r["avg_revenue"]), 2),
            "total_units": int(r["total_units"]),
            "avg_units": round(float(r["avg_units"]), 1),
            "revenue_share": round(float(r["revenue_share"]), 2),
            "implied_unit_price": round(float(r["total_revenue"]) / max(1, int(r["total_units"])), 2)
        }
        for _, r in prod_agg.iterrows()
    ]
    
    top_products = product_performance[:5]
    lowest_products = product_performance[-5:] if len(product_performance) >= 5 else product_performance

    # --- 5. STORE PERFORMANCE ANALYSIS ---
    store_agg = df_work.groupby("Store_ID").agg({
        "Revenue": ["sum", "mean"],
        "Units_Sold": ["sum", "mean"]
    })
    store_agg.columns = ["total_revenue", "avg_revenue", "total_units", "avg_units"]
    store_agg = store_agg.reset_index()
    store_agg["revenue_share"] = (store_agg["total_revenue"] / max(1, total_revenue)) * 100
    store_agg = store_agg.sort_values(by="total_revenue", ascending=False)

    store_performance = [
        {
            "store_id": r["Store_ID"],
            "total_revenue": round(float(r["total_revenue"]), 2),
            "avg_revenue": round(float(r["avg_revenue"]), 2),
            "total_units": int(r["total_units"]),
            "avg_units": round(float(r["avg_units"]), 1),
            "revenue_share": round(float(r["revenue_share"]), 2)
        }
        for _, r in store_agg.iterrows()
    ]
    best_store = store_performance[0] if store_performance else None
    lowest_store = store_performance[-1] if store_performance else None

    # --- 6. PROMOTION & HOLIDAY IMPACT ANALYSIS ---
    promo_stats = df_work.groupby("Promotion").agg({
        "Revenue": ["mean", "sum"],
        "Units_Sold": ["mean", "sum"],
        "Date": "count"
    })
    promo_mean_rev = promo_stats.xs("mean", axis=1, level=1)["Revenue"].to_dict()
    promo_mean_units = promo_stats.xs("mean", axis=1, level=1)["Units_Sold"].to_dict()
    
    rev_non_promo = float(promo_mean_rev.get(0, 1.0))
    rev_promo = float(promo_mean_rev.get(1, rev_non_promo))
    promo_uplift_pct = round(((rev_promo - rev_non_promo) / max(0.1, rev_non_promo)) * 100, 2)

    holiday_stats = df_work.groupby("Holiday").agg({
        "Revenue": ["mean", "sum"],
        "Units_Sold": ["mean", "sum"],
        "Date": "count"
    })
    hol_mean_rev = holiday_stats.xs("mean", axis=1, level=1)["Revenue"].to_dict()
    rev_non_hol = float(hol_mean_rev.get(0, 1.0))
    rev_hol = float(hol_mean_rev.get(1, rev_non_hol))
    holiday_uplift_pct = round(((rev_hol - rev_non_hol) / max(0.1, rev_non_hol)) * 100, 2)

    promotion_analysis = {
        "regular_sales_avg_revenue": round(rev_non_promo, 2),
        "promotional_sales_avg_revenue": round(rev_promo, 2),
        "promotional_uplift_pct": promo_uplift_pct,
        "promo_avg_units": round(float(promo_mean_units.get(1, 0)), 1),
        "non_promo_avg_units": round(float(promo_mean_units.get(0, 0)), 1),
    }

    holiday_analysis = {
        "non_holiday_avg_revenue": round(rev_non_hol, 2),
        "holiday_avg_revenue": round(rev_hol, 2),
        "holiday_uplift_pct": holiday_uplift_pct
    }

    return {
        "kpis": {
            "total_revenue": round(total_revenue, 2),
            "total_units": total_units,
            "total_records": total_records,
            "total_products": total_products,
            "total_stores": total_stores,
            "avg_order_value": round(avg_order_value, 2),
            "avg_units_per_order": round(avg_units_per_order, 2),
            "date_start": df_work["Date"].min().strftime("%Y-%m-%d"),
            "date_end": df_work["Date"].max().strftime("%Y-%m-%d")
        },
        "daily_trend": daily_trend,
        "weekly_series": weekly_series,
        "monthly_analysis": monthly_analysis,
        "yearly_analysis": yearly_analysis,
        "day_of_week_pattern": day_of_week_pattern,
        "monthly_seasonality": monthly_seasonality,
        "peak_periods": peak_periods,
        "low_periods": low_periods,
        "product_performance": product_performance,
        "top_products": top_products,
        "lowest_products": lowest_products,
        "store_performance": store_performance,
        "best_store": best_store,
        "lowest_store": lowest_store,
        "promotion_analysis": promotion_analysis,
        "holiday_analysis": holiday_analysis
    }
