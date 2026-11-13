import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.services.sample_generator import generate_sample_sales_dataset, SAMPLE_FILE_PATH

app = FastAPI(
    title="Sales Forecasting System API",
    description="Backend API for Sales Forecasting System Using Machine Learning and Time Series Analysis",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount endpoints under /api
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
def on_startup():
    print("Initializing Sales Forecasting System Backend...")
    # Pre-generate sample dataset if not present
    if not os.path.exists(SAMPLE_FILE_PATH):
        try:
            print("Generating realistic 3-year sample historical sales dataset...")
            generate_sample_sales_dataset()
        except Exception as e:
            print(f"Warning during sample generation: {e}")

@app.get("/")
def root():
    return {
        "project": "Sales Forecasting System Using Machine Learning and Time Series Analysis",
        "tagline": "Analyze Past Sales. Predict Future Growth.",
        "status": "online",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
