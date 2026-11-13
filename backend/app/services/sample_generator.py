import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "sample_data"))
SAMPLE_FILE_PATH = os.path.join(SAMPLE_DIR, "sample_sales_data.csv")

def generate_sample_sales_dataset(start_date="2023-01-01", end_date="2025-12-31") -> str:
    """
    Generates a realistic multi-store, multi-product historical sales dataset spanning 3 full years.
    Includes seasonal trends, day-of-week cycles, promotional campaigns, and national holidays.
    """
    os.makedirs(SAMPLE_DIR, exist_ok=True)
    
    dates = pd.date_range(start=start_date, end=end_date, freq="D")
    
    products = [
        {"id": "PROD_101", "name": "Smart 4K Ultra TV", "base_price": 650.0, "base_units": 6},
        {"id": "PROD_102", "name": "Wireless Pro Headphones", "base_price": 180.0, "base_units": 24},
        {"id": "PROD_103", "name": "Ultra-Slim Performance Laptop", "base_price": 950.0, "base_units": 5},
        {"id": "PROD_104", "name": "Fitness Smartwatch Active", "base_price": 120.0, "base_units": 32},
        {"id": "PROD_105", "name": "Bluetooth Surround Speaker", "base_price": 85.0, "base_units": 28},
        {"id": "PROD_106", "name": "Ergonomic Gaming Mouse", "base_price": 45.0, "base_units": 45},
    ]
    
    stores = [
        {"id": "STORE_01", "name": "Downtown Metro Hub", "factor": 1.35},
        {"id": "STORE_02", "name": "North Mall Center", "factor": 1.15},
        {"id": "STORE_03", "name": "Westside Plaza", "factor": 0.95},
        {"id": "STORE_04", "name": "Suburban Mega Outlet", "factor": 1.10},
        {"id": "STORE_05", "name": "Airport Terminal Express", "factor": 0.75},
    ]

    # Major holiday dates across 2023, 2024, 2025
    holiday_dates = set([
        "2023-01-01", "2023-05-29", "2023-07-04", "2023-09-04", "2023-11-23", "2023-11-24", "2023-12-24", "2023-12-25", "2023-12-31",
        "2024-01-01", "2024-05-27", "2024-07-04", "2024-09-02", "2024-11-28", "2024-11-29", "2024-12-24", "2024-12-25", "2024-12-31",
        "2025-01-01", "2025-05-26", "2025-07-04", "2025-09-01", "2025-11-27", "2025-11-28", "2025-12-24", "2025-12-25", "2025-12-31"
    ])

    np.random.seed(42)
    records = []
    
    total_days = len(dates)
    for idx, dt in enumerate(dates):
        dt_str = dt.strftime("%Y-%m-%d")
        is_holiday = 1 if dt_str in holiday_dates else 0
        
        # Day of week factor (Mon=0, Sun=6)
        dow = dt.dayofweek
        if dow in [4, 5, 6]: # Fri, Sat, Sun
            dow_multiplier = 1.35 if dow == 5 else 1.25
        else:
            dow_multiplier = 0.90
            
        # Month seasonality (Q4 spike e.g. Nov, Dec; Summer bump Jul, Aug)
        month = dt.month
        month_factors = {
            1: 0.85, 2: 0.80, 3: 0.90, 4: 0.95, 5: 1.05, 6: 1.10,
            7: 1.15, 8: 1.10, 9: 1.00, 10: 1.08, 11: 1.45, 12: 1.65
        }
        seasonal_mult = month_factors.get(month, 1.0)
        
        # Subtle long-term annual growth (~10% per year)
        trend_mult = 1.0 + (idx / total_days) * 0.22
        
        # Holiday surge
        holiday_mult = 1.85 if is_holiday == 1 else 1.0
        
        # Randomized promotion campaigns (e.g. 18% chance for a given day)
        promo_day = 1 if (np.random.rand() < 0.18 or is_holiday == 1 or dow == 5 and np.random.rand() < 0.4) else 0

        for store in stores:
            s_mult = store["factor"]
            for prod in products:
                # Promotion on this specific product
                prod_promo = promo_day if np.random.rand() < 0.8 else 0
                promo_mult = 1.45 if prod_promo == 1 else 1.0
                
                # Base expected units
                mean_units = prod["base_units"] * s_mult * dow_multiplier * seasonal_mult * trend_mult * holiday_mult * promo_mult
                noise = np.random.normal(0, max(1.2, mean_units * 0.12))
                units = max(1, int(round(mean_units + noise)))
                
                # Unit price with slight promo discount (10-15% off)
                unit_price = prod["base_price"] * (0.88 if prod_promo == 1 else 1.0)
                revenue = round(units * unit_price, 2)
                
                records.append({
                    "Date": dt_str,
                    "Product_ID": prod["id"],
                    "Store_ID": store["id"],
                    "Units_Sold": units,
                    "Revenue": revenue,
                    "Promotion": prod_promo,
                    "Holiday": is_holiday
                })
                
    df = pd.DataFrame(records)
    df.to_csv(SAMPLE_FILE_PATH, index=False)
    print(f"Sample dataset generated successfully at {SAMPLE_FILE_PATH} with {len(df)} rows.")
    return SAMPLE_FILE_PATH

if __name__ == "__main__":
    generate_sample_sales_dataset()
