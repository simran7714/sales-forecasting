import os
import io
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple, Optional
from app.models.schemas import ColumnMapping, PreprocessingOptions

COLUMN_ALIASES = {
    "Date": ["date", "sales_date", "transaction_date", "order_date", "timestamp", "dt", "day"],
    "Product_ID": ["product_id", "product", "item_id", "sku", "prod_id", "item", "product_code"],
    "Store_ID": ["store_id", "store", "shop_id", "branch_id", "outlet_id", "location_id", "branch"],
    "Units_Sold": ["units_sold", "quantity", "qty", "volume", "units", "items_sold", "sold_qty"],
    "Revenue": ["revenue", "sales", "total_sales", "amount", "sales_amount", "turnover", "income", "price_total"],
    "Promotion": ["promotion", "promo", "discount", "is_promo", "promotional", "sale_event"],
    "Holiday": ["holiday", "is_holiday", "holiday_flag", "public_holiday", "festival"]
}

def auto_detect_columns(columns: list) -> Dict[str, Optional[str]]:
    """Detects standard column mappings based on common column name variations."""
    mapping = {}
    lower_cols = {col.lower().strip().replace(" ", "_"): col for col in columns}
    
    for std_col, aliases in COLUMN_ALIASES.items():
        found = None
        for alias in aliases:
            if alias in lower_cols:
                found = lower_cols[alias]
                break
        mapping[std_col] = found
    return mapping

def inspect_dataset(df: pd.DataFrame) -> Dict[str, Any]:
    """Generates a detailed structural inspection report of the dataset."""
    total_rows = len(df)
    total_cols = len(df.columns)
    
    # Missing values per column
    missing_counts = df.isnull().sum().to_dict()
    missing_pct = {k: round((v / max(1, total_rows)) * 100, 2) for k, v in missing_counts.items()}
    total_missing = int(df.isnull().sum().sum())
    
    # Duplicate rows
    duplicate_count = int(df.duplicated().sum())
    
    # Data types and sample values
    column_info = []
    for col in df.columns:
        col_type = str(df[col].dtype)
        unique_vals = int(df[col].nunique())
        sample_vals = df[col].dropna().head(3).tolist()
        column_info.append({
            "name": col,
            "type": col_type,
            "unique_count": unique_vals,
            "missing_count": int(missing_counts[col]),
            "missing_pct": missing_pct[col],
            "samples": sample_vals
        })
        
    detected_mapping = auto_detect_columns(df.columns.tolist())
    
    # Numerical summaries
    num_summary = {}
    num_cols = df.select_dtypes(include=[np.number]).columns
    for c in num_cols:
        series = df[c].dropna()
        if len(series) > 0:
            num_summary[c] = {
                "mean": round(float(series.mean()), 2),
                "std": round(float(series.std()), 2) if len(series) > 1 else 0.0,
                "min": round(float(series.min()), 2),
                "max": round(float(series.max()), 2),
                "q25": round(float(series.quantile(0.25)), 2),
                "median": round(float(series.median()), 2),
                "q75": round(float(series.quantile(0.75)), 2),
            }

    return {
        "total_rows": total_rows,
        "total_columns": total_cols,
        "column_info": column_info,
        "detected_mapping": detected_mapping,
        "total_missing_values": total_missing,
        "duplicate_rows": duplicate_count,
        "numerical_summary": num_summary,
        "preview_head": df.head(10).replace({np.nan: None}).to_dict(orient="records"),
        "preview_tail": df.tail(5).replace({np.nan: None}).to_dict(orient="records")
    }

def clean_and_preprocess(
    df: pd.DataFrame, 
    mapping: Optional[ColumnMapping] = None, 
    options: Optional[PreprocessingOptions] = None
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Executes actual data preprocessing:
    - Renames mapped columns to standard names
    - Handles missing values
    - Removes duplicate records
    - Parses and normalizes dates into chronological order
    - Detects and caps outliers using IQR Winsorization
    - Validates numerical integrity
    """
    if options is None:
        options = PreprocessingOptions()
        
    df_raw = df.copy()
    stats_before = {
        "rows": len(df_raw),
        "missing_values": int(df_raw.isnull().sum().sum()),
        "duplicates": int(df_raw.duplicated().sum())
    }
    
    # Apply column mapping if provided
    rename_dict = {}
    if mapping:
        if mapping.date_col and mapping.date_col in df_raw.columns:
            rename_dict[mapping.date_col] = "Date"
        if mapping.revenue_col and mapping.revenue_col in df_raw.columns:
            rename_dict[mapping.revenue_col] = "Revenue"
        if mapping.units_col and mapping.units_col in df_raw.columns:
            rename_dict[mapping.units_col] = "Units_Sold"
        if mapping.product_col and mapping.product_col in df_raw.columns:
            rename_dict[mapping.product_col] = "Product_ID"
        if mapping.store_col and mapping.store_col in df_raw.columns:
            rename_dict[mapping.store_col] = "Store_ID"
        if mapping.promo_col and mapping.promo_col in df_raw.columns:
            rename_dict[mapping.promo_col] = "Promotion"
        if mapping.holiday_col and mapping.holiday_col in df_raw.columns:
            rename_dict[mapping.holiday_col] = "Holiday"
            
    df_clean = df_raw.rename(columns=rename_dict)
    
    # Verify mandatory columns
    if "Date" not in df_clean.columns:
        # Fallback search
        detected = auto_detect_columns(df_clean.columns.tolist())
        if detected.get("Date"):
            df_clean = df_clean.rename(columns={detected["Date"]: "Date"})
        else:
            raise ValueError("Dataset is missing a mandatory 'Date' column.")
            
    if "Revenue" not in df_clean.columns and "Units_Sold" in df_clean.columns:
        # If Revenue missing but Units_Sold exists, synthesize standard revenue
        df_clean["Revenue"] = df_clean["Units_Sold"] * 50.0
    elif "Revenue" not in df_clean.columns:
        detected = auto_detect_columns(df_clean.columns.tolist())
        if detected.get("Revenue"):
            df_clean = df_clean.rename(columns={detected["Revenue"]: "Revenue"})
        else:
            raise ValueError("Dataset is missing a mandatory 'Revenue' or 'Units_Sold' column.")
            
    if "Units_Sold" not in df_clean.columns:
        df_clean["Units_Sold"] = np.maximum(1, (df_clean["Revenue"] / 50.0).round().astype(int))
    if "Product_ID" not in df_clean.columns:
        df_clean["Product_ID"] = "DEFAULT_PROD"
    if "Store_ID" not in df_clean.columns:
        df_clean["Store_ID"] = "DEFAULT_STORE"
    if "Promotion" not in df_clean.columns:
        df_clean["Promotion"] = 0
    if "Holiday" not in df_clean.columns:
        df_clean["Holiday"] = 0

    # 1. Remove duplicate records
    removed_duplicates = 0
    if options.remove_duplicates:
        initial_count = len(df_clean)
        df_clean = df_clean.drop_duplicates()
        removed_duplicates = initial_count - len(df_clean)
        
    # 2. Date parsing & sorting
    try:
        df_clean["Date"] = pd.to_datetime(df_clean["Date"], errors="coerce")
    except Exception as e:
        raise ValueError(f"Error parsing date column: {str(e)}")
        
    # Drop rows where Date could not be parsed
    invalid_dates_dropped = int(df_clean["Date"].isna().sum())
    if invalid_dates_dropped > 0:
        df_clean = df_clean.dropna(subset=["Date"])
        
    if options.sort_by_date:
        df_clean = df_clean.sort_values(by="Date").reset_index(drop=True)
        
    # 3. Numeric conversion & validation
    df_clean["Revenue"] = pd.to_numeric(df_clean["Revenue"], errors="coerce")
    df_clean["Units_Sold"] = pd.to_numeric(df_clean["Units_Sold"], errors="coerce")
    df_clean["Promotion"] = pd.to_numeric(df_clean["Promotion"], errors="coerce").fillna(0).astype(int)
    df_clean["Holiday"] = pd.to_numeric(df_clean["Holiday"], errors="coerce").fillna(0).astype(int)
    df_clean["Product_ID"] = df_clean["Product_ID"].astype(str)
    df_clean["Store_ID"] = df_clean["Store_ID"].astype(str)
    
    # 4. Handle Missing Values
    missing_before_imputation = int(df_clean.isnull().sum().sum())
    if options.handle_missing == "drop":
        df_clean = df_clean.dropna(subset=["Revenue", "Units_Sold"]).reset_index(drop=True)
    elif options.handle_missing == "impute_mean":
        df_clean["Revenue"] = df_clean["Revenue"].fillna(df_clean["Revenue"].mean())
        df_clean["Units_Sold"] = df_clean["Units_Sold"].fillna(df_clean["Units_Sold"].mean())
    else: # impute_forward / backward
        df_clean["Revenue"] = df_clean["Revenue"].ffill().bfill().fillna(0)
        df_clean["Units_Sold"] = df_clean["Units_Sold"].ffill().bfill().fillna(1)
        
    # Ensure no negative sales
    df_clean["Revenue"] = df_clean["Revenue"].clip(lower=0.0)
    df_clean["Units_Sold"] = df_clean["Units_Sold"].clip(lower=0)

    # 5. Outlier Detection and Capping (IQR)
    outliers_treated = 0
    if options.handle_outliers and len(df_clean) > 10:
        for col in ["Revenue", "Units_Sold"]:
            q25 = df_clean[col].quantile(0.25)
            q75 = df_clean[col].quantile(0.75)
            iqr = q75 - q25
            lower_bound = max(0, q25 - 2.5 * iqr)
            upper_bound = q75 + 2.5 * iqr
            outlier_mask = (df_clean[col] < lower_bound) | (df_clean[col] > upper_bound)
            outliers_treated += int(outlier_mask.sum())
            df_clean[col] = df_clean[col].clip(lower=lower_bound, upper=upper_bound)

    # Format Date column back to YYYY-MM-DD string for JSON serialization
    df_clean["Date"] = df_clean["Date"].dt.strftime("%Y-%m-%d")

    stats_after = {
        "rows": len(df_clean),
        "missing_values": int(df_clean.isnull().sum().sum()),
        "duplicates": int(df_clean.duplicated().sum()),
        "duplicates_removed": removed_duplicates,
        "invalid_dates_dropped": invalid_dates_dropped,
        "outliers_treated": outliers_treated,
        "date_range": {
            "start": df_clean["Date"].min(),
            "end": df_clean["Date"].max()
        }
    }
    
    return df_clean, {
        "stats_before": stats_before,
        "stats_after": stats_after,
        "cleaning_summary": {
            "duplicate_records_removed": removed_duplicates,
            "missing_values_handled": missing_before_imputation,
            "outliers_capped": outliers_treated,
            "final_clean_rows": len(df_clean),
            "data_quality_score": round(max(50.0, 100.0 - (removed_duplicates * 0.5 + missing_before_imputation * 0.2)), 1)
        },
        "preview_cleaned": df_clean.head(10).to_dict(orient="records")
    }
