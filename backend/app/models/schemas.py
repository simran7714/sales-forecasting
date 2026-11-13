from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ColumnMapping(BaseModel):
    date_col: str = "Date"
    product_col: Optional[str] = "Product_ID"
    store_col: Optional[str] = "Store_ID"
    units_col: str = "Units_Sold"
    revenue_col: str = "Revenue"
    promo_col: Optional[str] = "Promotion"
    holiday_col: Optional[str] = "Holiday"

class PreprocessingOptions(BaseModel):
    handle_missing: str = "impute_forward" # "drop", "impute_mean", "impute_forward"
    remove_duplicates: bool = True
    handle_outliers: bool = True # IQR capping
    sort_by_date: bool = True

class ForecastRequest(BaseModel):
    model_name: str = "Random Forest Regressor" # "Linear Regression", "ARIMA", "Moving Average", "Random Forest Regressor"
    frequency: str = "D" # "D" (daily), "W" (weekly), "M" (monthly)
    horizon_periods: int = 30 # 7, 30, 90, 180
    target_metric: str = "Revenue" # "Revenue" or "Units_Sold"
    product_filter: Optional[str] = "ALL"
    store_filter: Optional[str] = "ALL"
    test_size: float = 0.2

class TimeSeriesDecomposeRequest(BaseModel):
    frequency: str = "D"
    target_metric: str = "Revenue"
    model_type: str = "additive" # "additive" or "multiplicative"
