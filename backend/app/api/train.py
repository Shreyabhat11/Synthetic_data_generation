from fastapi import APIRouter, HTTPException
from ctgan import CTGAN
import pandas as pd
import numpy as np

from app.core.state import STATE

router = APIRouter()


@router.post("/")
def train_model(epochs: int = 20, batch_size: int = 512):

    if STATE.dataframe is None:
        raise HTTPException(400, "No dataset uploaded")

    df = STATE.dataframe.copy()

    # ---- 1. Replace common missing value tokens ----
    df.replace("?", pd.NA, inplace=True)

    # ---- 2. Identify categorical columns ----
    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

    if not categorical_columns:
        raise HTTPException(
            400, "No categorical columns detected — CTGAN requires mixed data"
        )
    number_columns = df.select_dtypes(
        include=["number", "float", "int"]
    ).columns.tolist()

    # ---- 1. Handle missing values ----
    df[number_columns] = df[number_columns].fillna(0)
    df[categorical_columns] = df[categorical_columns].fillna("Unknown")

    # ---- 2 Apply log1p transformation to numerical columns ----
    for col in number_columns:
        if (df[col] >= 0).all():
            df[col] = np.log1p(df[col])

    # ---- 3. Train CTGAN with explicit discrete columns ----
    model = CTGAN(
        epochs=epochs,
        batch_size=batch_size,
        generator_lr=2e-4,
        discriminator_lr=2e-4,
        pac=8,
        verbose=True
    )

    model.fit(
        df,
        discrete_columns=categorical_columns
    )

    STATE.model = model
    STATE.dataframe = df  # store cleaned version

    return {
        "message": "Training completed successfully",
        "epochs": epochs,
        "categorical_columns": categorical_columns
    }
