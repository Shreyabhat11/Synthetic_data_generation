from fastapi import APIRouter, HTTPException
import pandas as pd
import os

from sklearn.ensemble import RandomForestClassifier

from app.core.evaluator import evaluate_tstr
from app.core.privacy_metrics import disclosure_risk
from app.core.advanced_evaluator import (
    compute_mse,
    compute_kl_divergence,
    compute_correlation_difference,
    compute_statistical_similarity
)
from app.core.state import STATE

REAL_DIR = "data/uploads"
SYNTH_DIR = "data/synthetic"

router = APIRouter()


@router.get("/")
def evaluate():
    if STATE.dataset_id is None:
        raise HTTPException(400, "No dataset uploaded")

    real_path = os.path.join(REAL_DIR, f"{STATE.dataset_id}.csv")
    synth_path = os.path.join(SYNTH_DIR, f"{STATE.dataset_id}_synthetic.csv")

    if not os.path.exists(real_path) or not os.path.exists(synth_path):
        raise HTTPException(400, "Required datasets not found")

    real_df = pd.read_csv(real_path)
    synth_df = pd.read_csv(synth_path)

    target_col = real_df.columns[-1]

    # ---- Metrics ----
    tstr_auc = evaluate_tstr(
        real_df,
        synth_df,
        target_col,
        RandomForestClassifier()
    )

    mse = compute_mse(real_df, synth_df)
    kl = compute_kl_divergence(real_df, synth_df)
    corr_diff = compute_correlation_difference(real_df, synth_df)
    stat_sim = compute_statistical_similarity(mse, kl)

    privacy = disclosure_risk(real_df, synth_df)

    # ---- Distribution data (top 5 numeric cols) ----
    num_cols = real_df.select_dtypes(include="number").columns[:5]

    distributions = [
        {
            "feature": col,
            "real": float(real_df[col].mean()),
            "synthetic": float(synth_df[col].mean())
        }
        for col in num_cols
    ]

    # ---- Correlation pairs ----
    corr_pairs = []
    real_corr = real_df[num_cols].corr()
    synth_corr = synth_df[num_cols].corr()

    for i in range(len(num_cols)):
        for j in range(i + 1, len(num_cols)):
            corr_pairs.append({
                "pair": f"{num_cols[i]}-{num_cols[j]}",
                "real": float(real_corr.iloc[i, j]),
                "synthetic": float(synth_corr.iloc[i, j])
            })

    return {
        "utility": {
            "tstr_auc": round(tstr_auc, 4),
            "mean_squared_error": round(mse, 4),
            "kullback_leibler_divergence": round(kl, 4),
            "correlation_difference": round(corr_diff, 4),
            "statistical_similarity": round(stat_sim, 4)
        },
        "privacy": {
            "disclosure_risk": round(privacy, 4)
        },
        "distributions": distributions,
        "correlation_comparison": corr_pairs
    }
