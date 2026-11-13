import io
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

def generate_csv_forecast_report(forecast_data: List[Dict[str, Any]], model_name: str) -> str:
    """Generates a downloadable CSV string of predicted future sales."""
    df_forecast = pd.DataFrame(forecast_data)
    df_forecast["Model_Used"] = model_name
    return df_forecast.to_csv(index=False)

def generate_excel_full_report(
    eda_data: Dict[str, Any],
    clean_df: pd.DataFrame,
    forecast_data: List[Dict[str, Any]],
    model_name: str,
    metrics: Dict[str, Any]
) -> io.BytesIO:
    """
    Generates a multi-sheet, professionally formatted Excel workbook (.xlsx).
    """
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        # Sheet 1: Executive Summary & KPIs
        kpis = eda_data.get("kpis", {})
        summary_rows = [
            ["Metric", "Value"],
            ["Total Historical Revenue", f"${kpis.get('total_revenue', 0):,.2f}"],
            ["Total Units Sold", f"{kpis.get('total_units', 0):,}"],
            ["Total Historical Records", f"{kpis.get('total_records', 0):,}"],
            ["Total Active Products", kpis.get("total_products", 0)],
            ["Total Retail Stores", kpis.get("total_stores", 0)],
            ["Average Order Value", f"${kpis.get('avg_order_value', 0):,.2f}"],
            ["Date Range Start", kpis.get("date_start", "")],
            ["Date Range End", kpis.get("date_end", "")],
            ["Selected Forecasting Model", model_name],
            ["Model MAE (Mean Absolute Error)", metrics.get("mae", "N/A")],
            ["Model RMSE (Root Mean Squared Error)", metrics.get("rmse", "N/A")]
        ]
        df_summary = pd.DataFrame(summary_rows[1:], columns=summary_rows[0])
        df_summary.to_excel(writer, sheet_name="Executive Summary", index=False)

        # Sheet 2: Future Forecast Predictions
        df_forecast = pd.DataFrame(forecast_data)
        df_forecast["Model"] = model_name
        df_forecast.to_excel(writer, sheet_name="Sales Forecast", index=False)

        # Sheet 3: Product Performance
        if "product_performance" in eda_data:
            df_prod = pd.DataFrame(eda_data["product_performance"])
            df_prod.to_excel(writer, sheet_name="Product Analytics", index=False)

        # Sheet 4: Store Performance
        if "store_performance" in eda_data:
            df_store = pd.DataFrame(eda_data["store_performance"])
            df_store.to_excel(writer, sheet_name="Store Analytics", index=False)

        # Sheet 5: Sample Cleaned Sales Data (top 1000 rows to keep file fast)
        clean_df.head(1000).to_excel(writer, sheet_name="Cleaned Sales Data", index=False)

    output.seek(0)
    return output

def generate_pdf_report(
    eda_data: Dict[str, Any],
    model_name: str,
    metrics: Dict[str, Any],
    forecast_data: List[Dict[str, Any]],
    insights: Dict[str, Any]
) -> io.BytesIO:
    """
    Generates a high-quality, professional academic & corporate PDF report using ReportLab.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        alignment=1, # Center
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#6366f1'),
        alignment=1,
        spaceAfter=15
    )
    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )
    bold_body = ParagraphStyle(
        'DocBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    elements = []

    # Title & Header
    elements.append(Paragraph("SALES FORECASTING SYSTEM", title_style))
    elements.append(Paragraph("Machine Learning & Time Series Analysis Report", subtitle_style))
    elements.append(Paragraph(
        "<i>Tagline: 'Analyze Past Sales. Predict Future Growth.' | Generated by Antigravity AI Engine</i>",
        ParagraphStyle('Tag', parent=body_style, alignment=1, textColor=colors.HexColor('#64748b'))
    ))
    elements.append(Spacer(1, 15))

    # Executive Summary
    elements.append(Paragraph("1. Executive Summary", h2_style))
    exec_text = insights.get("executive_summary", "Comprehensive analysis of historical sales trends and machine learning forecasts.")
    elements.append(Paragraph(exec_text, body_style))
    elements.append(Spacer(1, 10))

    # KPI Table
    kpis = eda_data.get("kpis", {})
    kpi_data = [
        ["Total Revenue", f"${kpis.get('total_revenue', 0):,.2f}", "Total Units Sold", f"{kpis.get('total_units', 0):,}"],
        ["Total Records", f"{kpis.get('total_records', 0):,}", "Average Order Value", f"${kpis.get('avg_order_value', 0):,.2f}"],
        ["Active Products", str(kpis.get('total_products', 0)), "Retail Stores", str(kpis.get('total_stores', 0))],
        ["Historical Start", str(kpis.get('date_start', '')), "Historical End", str(kpis.get('date_end', ''))],
    ]
    t_kpi = Table(kpi_data, colWidths=[120, 140, 120, 140])
    t_kpi.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1e293b')),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_kpi)
    elements.append(Spacer(1, 12))

    # Model Evaluation Summary
    elements.append(Paragraph("2. Machine Learning Model Evaluation", h2_style))
    elements.append(Paragraph(
        f"<b>Selected Champion Model:</b> {model_name}<br/>"
        f"Chronological 80/20 train-test split applied to eliminate lookahead bias.",
        body_style
    ))
    
    metric_data = [
        ["Evaluation Metric", "Score", "Academic Description"],
        ["MAE (Mean Absolute Error)", str(metrics.get("mae", "N/A")), "Average magnitude of absolute forecast errors"],
        ["MSE (Mean Squared Error)", str(metrics.get("mse", "N/A")), "Penalizes variance and large discrepancies"],
        ["RMSE (Root Mean Squared Error)", str(metrics.get("rmse", "N/A")), "Standard deviation of prediction residuals (target scale)"]
    ]
    t_metrics = Table(metric_data, colWidths=[140, 90, 290])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#312e81')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f8fafc'), colors.white]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(t_metrics)
    elements.append(Spacer(1, 12))

    # Top Forecast Predictions
    elements.append(Paragraph("3. Future Sales Forecast Projections", h2_style))
    f_headers = ["Forecast Date", "Predicted Revenue", "Lower Bound (95%)", "Upper Bound (95%)"]
    f_rows = [f_headers]
    for row in forecast_data[:10]: # First 10 forecast points
        f_rows.append([
            row["date"],
            f"${row['predicted']:,.2f}",
            f"${row.get('lower_bound', 0):,.2f}",
            f"${row.get('upper_bound', 0):,.2f}"
        ])
    t_forecast = Table(f_rows, colWidths=[110, 130, 140, 140])
    t_forecast.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e1b4b')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f1f5f9'), colors.white]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    elements.append(t_forecast)
    elements.append(Spacer(1, 12))

    # Key Business Insights
    elements.append(Paragraph("4. Strategic Business Insights & Recommendations", h2_style))
    for ins in insights.get("insights_list", [])[:4]:
        title = f"<b>[{ins.get('category')}] {ins.get('title')}</b>"
        elements.append(Paragraph(title, bold_body))
        elements.append(Paragraph(f"Analysis: {ins.get('summary')}", body_style))
        elements.append(Paragraph(f"Action: <i>{ins.get('recommendation')}</i>", body_style))
        elements.append(Spacer(1, 4))

    doc.build(elements)
    buffer.seek(0)
    return buffer
