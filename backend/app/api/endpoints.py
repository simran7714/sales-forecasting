import os
import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Response
from fastapi.responses import StreamingResponse, FileResponse
from typing import Optional, Dict, Any

from app.models.schemas import (
    ColumnMapping, 
    PreprocessingOptions, 
    ForecastRequest, 
    TimeSeriesDecomposeRequest
)
from app.services.data_processor import inspect_dataset, clean_and_preprocess
from app.services.eda_analyzer import perform_eda
from app.services.time_series import decompose_time_series
from app.services.forecasting import (
    prepare_time_series_data,
    train_and_forecast_linear_regression,
    train_and_forecast_random_forest,
    train_and_forecast_arima,
    train_and_forecast_moving_average,
    run_model_comparison
)
from app.services.business_insights import generate_business_insights
from app.services.report_generator import (
    generate_csv_forecast_report,
    generate_excel_full_report,
    generate_pdf_report
)
from app.services.sample_generator import SAMPLE_FILE_PATH, generate_sample_sales_dataset

router = APIRouter()

# In-memory storage of the current active dataset session
class ActiveDataSession:
    raw_df: Optional[pd.DataFrame] = None
    clean_df: Optional[pd.DataFrame] = None
    eda_cache: Optional[Dict[str, Any]] = None
    latest_forecast: Optional[Dict[str, Any]] = None
    latest_model_name: str = "Random Forest Regressor"
    latest_metrics: Dict[str, Any] = {}
    is_sample_data: bool = False

session = ActiveDataSession()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "has_raw_data": session.raw_df is not None,
        "has_clean_data": session.clean_df is not None,
        "is_sample_data": session.is_sample_data
    }

@router.get("/sample/generate")
def get_or_create_sample():
    """Generates and loads the 3-year realistic sample sales dataset."""
    if not os.path.exists(SAMPLE_FILE_PATH):
        generate_sample_sales_dataset()
        
    df = pd.read_csv(SAMPLE_FILE_PATH)
    session.raw_df = df.copy()
    session.is_sample_data = True
    
    # Automatically clean and compute initial EDA for seamless immediate interaction
    clean_df, clean_info = clean_and_preprocess(df)
    session.clean_df = clean_df
    session.eda_cache = perform_eda(clean_df)
    
    inspection = inspect_dataset(df)
    return {
        "message": "Sample dataset loaded successfully.",
        "is_sample_data": True,
        "inspection": inspection,
        "preprocessing_summary": clean_info
    }

@router.get("/sample/download")
def download_sample_file():
    """Directly downloads the generated sample dataset CSV."""
    if not os.path.exists(SAMPLE_FILE_PATH):
        generate_sample_sales_dataset()
    return FileResponse(
        path=SAMPLE_FILE_PATH,
        filename="sample_historical_sales_dataset.csv",
        media_type="text/csv"
    )

@router.post("/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Uploads CSV or Excel (.xlsx, .xls) and returns detailed inspection."""
    filename = file.filename.lower()
    contents = await file.read()
    
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a CSV or Excel (.xlsx/.xls) file.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if len(df) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file contains no data rows.")

    session.raw_df = df.copy()
    session.clean_df = None
    session.eda_cache = None
    session.latest_forecast = None
    session.is_sample_data = False

    inspection = inspect_dataset(df)
    return {
        "filename": file.filename,
        "message": "File uploaded and analyzed successfully.",
        "inspection": inspection
    }

@router.post("/dataset/preprocess")
def preprocess_dataset(payload: Dict[str, Any]):
    """Applies column mapping and cleans dataset."""
    if session.raw_df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded. Please upload a dataset or load the sample data first.")

    mapping_data = payload.get("mapping", {})
    options_data = payload.get("options", {})
    
    mapping = ColumnMapping(**mapping_data) if mapping_data else ColumnMapping()
    options = PreprocessingOptions(**options_data) if options_data else PreprocessingOptions()

    try:
        clean_df, clean_info = clean_and_preprocess(session.raw_df, mapping, options)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Data preprocessing failed: {str(e)}")

    session.clean_df = clean_df
    session.eda_cache = perform_eda(clean_df) # Refresh EDA cache
    session.latest_forecast = None

    return {
        "message": "Dataset successfully preprocessed.",
        "cleaning_report": clean_info,
        "available_products": ["ALL"] + sorted(clean_df["Product_ID"].unique().tolist()),
        "available_stores": ["ALL"] + sorted(clean_df["Store_ID"].unique().tolist()),
    }

@router.get("/dataset/eda")
def get_eda_analysis():
    """Returns exploratory data analysis metrics, distributions and trends."""
    if session.clean_df is None:
        if session.raw_df is not None:
            # Auto-clean if raw dataset exists
            clean_df, _ = clean_and_preprocess(session.raw_df)
            session.clean_df = clean_df
        else:
            # Fallback to sample data
            get_or_create_sample()

    if session.eda_cache is None:
        session.eda_cache = perform_eda(session.clean_df)

    return session.eda_cache

@router.post("/timeseries/decompose")
def decompose_series(req: TimeSeriesDecomposeRequest):
    """Decomposes historical sales into Trend, Seasonal, and Residual components."""
    if session.clean_df is None:
        raise HTTPException(status_code=400, detail="Please clean and prepare dataset before time series analysis.")

    try:
        result = decompose_time_series(
            df=session.clean_df,
            frequency=req.frequency,
            target_metric=req.target_metric,
            model_type=req.model_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Decomposition failed: {str(e)}")

@router.post("/forecasting/train-predict")
def train_and_predict(req: ForecastRequest):
    """Trains selected model and generates chronological evaluation and future predictions."""
    if session.clean_df is None:
        raise HTTPException(status_code=400, detail="Please upload and preprocess dataset first.")

    try:
        ts_df = prepare_time_series_data(
            df=session.clean_df,
            frequency=req.frequency,
            target_metric=req.target_metric,
            product_filter=req.product_filter,
            store_filter=req.store_filter
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    model_name = req.model_name
    res = None
    
    try:
        if "Linear Regression" in model_name:
            res = train_and_forecast_linear_regression(ts_df, req.target_metric, req.test_size, req.horizon_periods, req.frequency)
        elif "Random Forest" in model_name:
            res = train_and_forecast_random_forest(ts_df, req.target_metric, req.test_size, req.horizon_periods, req.frequency)
        elif "ARIMA" in model_name:
            res = train_and_forecast_arima(ts_df, req.target_metric, req.test_size, req.horizon_periods, req.frequency)
        elif "Moving Average" in model_name:
            res = train_and_forecast_moving_average(ts_df, req.target_metric, req.test_size, req.horizon_periods, req.frequency)
        else:
            # Default to Random Forest
            res = train_and_forecast_random_forest(ts_df, req.target_metric, req.test_size, req.horizon_periods, req.frequency)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training and forecasting error: {str(e)}")

    session.latest_forecast = res
    session.latest_model_name = res["model_name"]
    session.latest_metrics = res["metrics"]

    return {
        "success": True,
        "target_metric": req.target_metric,
        "frequency": req.frequency,
        "horizon_periods": req.horizon_periods,
        "result": res
    }

@router.post("/forecasting/compare-all")
def compare_all_models(req: ForecastRequest):
    """Evaluates all 4 models on identical split and ranks them."""
    if session.clean_df is None:
        raise HTTPException(status_code=400, detail="Please upload and preprocess dataset first.")

    try:
        ts_df = prepare_time_series_data(
            df=session.clean_df,
            frequency=req.frequency,
            target_metric=req.target_metric,
            product_filter=req.product_filter,
            store_filter=req.store_filter
        )
        comparison = run_model_comparison(
            ts_df=ts_df,
            target_metric=req.target_metric,
            test_size=req.test_size,
            horizon_periods=req.horizon_periods,
            freq=req.frequency
        )
        return comparison
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

@router.get("/insights")
def get_insights():
    """Generates dynamic business intelligence insights from data and forecasts."""
    if session.clean_df is None:
        get_or_create_sample()

    if session.eda_cache is None:
        session.eda_cache = perform_eda(session.clean_df)

    insights = generate_business_insights(session.eda_cache, session.latest_forecast)
    return insights

@router.get("/reports/download-csv")
def download_csv_report():
    """Exports current forecast as CSV."""
    if session.latest_forecast is None or "forecast" not in session.latest_forecast:
        raise HTTPException(status_code=400, detail="No forecast generated yet. Run a forecast first.")

    csv_data = generate_csv_forecast_report(
        session.latest_forecast["forecast"],
        session.latest_model_name
    )
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sales_forecast_predictions.csv"}
    )

@router.get("/reports/download-excel")
def download_excel_report():
    """Exports multi-tab analytical Excel workbook."""
    if session.clean_df is None:
        raise HTTPException(status_code=400, detail="No active dataset.")
    if session.eda_cache is None:
        session.eda_cache = perform_eda(session.clean_df)

    forecast_data = session.latest_forecast.get("forecast", []) if session.latest_forecast else []
    
    excel_stream = generate_excel_full_report(
        eda_data=session.eda_cache,
        clean_df=session.clean_df,
        forecast_data=forecast_data,
        model_name=session.latest_model_name,
        metrics=session.latest_metrics
    )
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=Sales_Forecasting_Report.xlsx"}
    )

@router.get("/reports/download-pdf")
def download_pdf_report():
    """Exports comprehensive executive & academic PDF report."""
    if session.clean_df is None:
        raise HTTPException(status_code=400, detail="No active dataset.")
    if session.eda_cache is None:
        session.eda_cache = perform_eda(session.clean_df)

    forecast_data = session.latest_forecast.get("forecast", []) if session.latest_forecast else []
    insights = generate_business_insights(session.eda_cache, session.latest_forecast)

    pdf_stream = generate_pdf_report(
        eda_data=session.eda_cache,
        model_name=session.latest_model_name,
        metrics=session.latest_metrics,
        forecast_data=forecast_data,
        insights=insights
    )
    return StreamingResponse(
        pdf_stream,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Sales_Forecasting_Academic_Report.pdf"}
    )
