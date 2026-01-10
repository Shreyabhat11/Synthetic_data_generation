from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from app.core.state import STATE

SYNTH_DIR = "data/synthetic"

router = APIRouter()


@router.get("/synthetic")
def download_synthetic_data():
    """
    Download the generated synthetic dataset as CSV
    """

    if STATE.dataset_id is None:
        raise HTTPException(400, "No dataset uploaded")

    file_path = os.path.join(
        SYNTH_DIR,
        f"{STATE.dataset_id}_synthetic.csv"
    )

    if not os.path.exists(file_path):
        raise HTTPException(400, "Synthetic data not generated yet")

    return FileResponse(
        path=file_path,
        filename="synthetic_data.csv",
        media_type="text/csv"
    )
