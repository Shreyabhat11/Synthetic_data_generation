from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.state import STATE
import os
import numpy as np

SYNTH_DIR = "data/synthetic"
os.makedirs(SYNTH_DIR, exist_ok=True)

router = APIRouter()



class GenerateRequest(BaseModel):
    num_rows: int

@router.post("/")
def generate(req: GenerateRequest):

    if STATE.model is None:
        raise HTTPException(400, "Model not trained")

    synthetic_df = STATE.model.sample(req.num_rows, random_state=42, temperature=0.8)
    # Inverse transform numerical columns if any transformation was applied
    num_cols = STATE.dataframe.select_dtypes(
        include=["number", "float", "int"]
    ).columns.tolist()

    for col in num_cols:
        if col in synthetic_df.columns:
            synthetic_df[col] = np.expm1(synthetic_df[col])

    file_path = os.path.join(
        SYNTH_DIR,
        f"{STATE.dataset_id}_synthetic.csv"
    )

    synthetic_df.to_csv(file_path, index=False)

    STATE.synthetic_df = synthetic_df


    return {
        "message": "Synthetic data generated",
        "rows": len(synthetic_df),
        "columns": list(synthetic_df.columns),
        "file_path": file_path
    }
