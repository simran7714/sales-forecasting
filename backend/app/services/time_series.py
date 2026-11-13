import pandas as pd
import numpy as np
from typing import Dict, Any
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller

def decompose_time_series(
    df: pd.DataFrame, 
    frequency: str = "D", 
    target_metric: str = "Revenue",
    model_type: str = "additive"
) -> Dict[str, Any]:
    """
    Performs Time Series Decomposition using Statsmodels:
    - Resamples to desired frequency ('D', 'W', 'M')
    - Extracts Trend, Seasonal, and Residual components
    - Runs Augmented Dickey-Fuller (ADF) test for stationarity
    - Quantifies seasonal amplitude and residual noise
    """
    df_work = df.copy()
    df_work["Date"] = pd.to_datetime(df_work["Date"])
    
    # Aggregate target metric across the dataset
    ts = df_work.groupby("Date")[target_metric].sum().sort_index()
    
    # Resample according to frequency
    freq_map = {"D": "D", "W": "W", "M": "ME"}
    actual_freq = freq_map.get(frequency, "D")
    
    # Forward-fill any calendar gaps
    ts_resampled = ts.resample(actual_freq).sum()
    ts_resampled = ts_resampled.replace(0, np.nan).ffill().bfill().fillna(1.0)
    
    # Period for seasonal decomposition
    period = 7 if frequency == "D" else (52 if frequency == "W" else 12)
    
    # Validate series length
    if len(ts_resampled) < (period * 2):
        # Fallback period if dataset is shorter
        period = max(2, len(ts_resampled) // 3)

    # Multiplicative requires strictly positive values
    if model_type == "multiplicative" and (ts_resampled <= 0).any():
        model_type = "additive"

    try:
        decomp = seasonal_decompose(ts_resampled, model=model_type, period=period, extrapolate_trend="freq")
        trend = decomp.trend
        seasonal = decomp.seasonal
        resid = decomp.resid
    except Exception as e:
        # Fallback if decomposition fails
        model_type = "additive"
        decomp = seasonal_decompose(ts_resampled, model="additive", period=period, extrapolate_trend="freq")
        trend = decomp.trend
        seasonal = decomp.seasonal
        resid = decomp.resid

    # Stationarity Test (Augmented Dickey-Fuller)
    adf_result = {}
    try:
        adf_stat, adf_pvalue, usedlag, nobs, critical_values, icbest = adfuller(ts_resampled.dropna())
        adf_result = {
            "test_statistic": round(float(adf_stat), 4),
            "p_value": round(float(adf_pvalue), 4),
            "used_lag": int(usedlag),
            "num_observations": int(nobs),
            "critical_values": {k: round(float(v), 4) for k, v in critical_values.items()},
            "is_stationary": bool(adf_pvalue < 0.05),
            "interpretation": (
                "The time series is stationary (p < 0.05). Mean and variance remain stable over time."
                if adf_pvalue < 0.05
                else "The time series is non-stationary (p >= 0.05). Trend or seasonal differencing is beneficial."
            )
        }
    except Exception as e:
        adf_result = {
            "error": str(e),
            "is_stationary": False,
            "interpretation": "Insufficient data points for conclusive ADF test."
        }

    # Format components for interactive charts
    records = []
    # If daily and long, sample evenly to ensure lightweight JSON
    step = max(1, len(ts_resampled) // 250) if len(ts_resampled) > 400 else 1
    
    resampled_dates = ts_resampled.index
    for i in range(0, len(ts_resampled), step):
        dt = resampled_dates[i]
        date_str = dt.strftime("%Y-%m-%d")
        
        obs_val = float(ts_resampled.iloc[i])
        trend_val = float(trend.iloc[i]) if not pd.isna(trend.iloc[i]) else obs_val
        season_val = float(seasonal.iloc[i]) if not pd.isna(seasonal.iloc[i]) else 0.0
        resid_val = float(resid.iloc[i]) if not pd.isna(resid.iloc[i]) else 0.0
        
        records.append({
            "date": date_str,
            "observed": round(obs_val, 2),
            "trend": round(trend_val, 2),
            "seasonal": round(season_val, 2),
            "residual": round(resid_val, 2)
        })

    # Summary metrics
    variance_total = float(ts_resampled.var())
    variance_resid = float(resid.dropna().var())
    seasonal_strength = max(0.0, min(1.0, 1.0 - (variance_resid / max(1e-6, float((trend + seasonal).dropna().var())))))

    return {
        "frequency": frequency,
        "period": period,
        "model_type": model_type,
        "target_metric": target_metric,
        "adf_test": adf_result,
        "decomposition_data": records,
        "summary": {
            "total_points": len(ts_resampled),
            "seasonal_strength_score": round(seasonal_strength, 3),
            "trend_direction": "Upward" if trend.iloc[-1] > trend.iloc[0] else "Downward",
            "average_seasonality_amplitude": round(float(seasonal.abs().mean()), 2)
        }
    }
