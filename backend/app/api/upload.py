from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from io import StringIO
import os
import uuid

from app.core.state import STATE

DATA_DIR = "data/uploads"
os.makedirs(DATA_DIR, exist_ok=True)

router = APIRouter()

@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload CSV dataset for CTGAN training.
    This resets any previously trained model or generated data.
    """

    # ---- 1. File type validation ----
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported"
        )

    try:
        # ---- 2. Read file contents ----
        contents = await file.read()
        decoded = contents.decode("utf-8")

        # ---- 3. Load into pandas ----
        df = pd.read_csv(StringIO(decoded))

        dataset_id = str(uuid.uuid4())
        file_path = os.path.join(DATA_DIR, f"{dataset_id}.csv")

        df.to_csv(file_path, index=False)

        


    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read CSV file: {str(e)}"
        )

    # ---- 4. Basic dataset validation ----
    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="Uploaded CSV is empty"
        )

    if df.shape[1] < 2:
        raise HTTPException(
            status_code=400,
            detail="Dataset must have at least 2 columns"
        )

    # ---- 5. Store dataset in shared state ----
    STATE.dataframe = df
    STATE.dataset_id = dataset_id
    STATE.model = None
    STATE.synthetic_df = None  # reset old synthetic data

    # ---- 6. Return metadata to frontend ----
    return {
    "message": "Dataset uploaded successfully",
    "dataset_id": dataset_id,
    "rows": df.shape[0],
    "columns": list(df.columns)
    }
