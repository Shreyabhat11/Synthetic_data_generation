import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score


def evaluate_tstr(real_df, synthetic_df, target_col, model):
    # Split features & target
    Xs = synthetic_df.drop(columns=[target_col])
    ys = synthetic_df[target_col]

    Xr = real_df.drop(columns=[target_col])
    yr = real_df[target_col]

    # Detect column types
    cat_cols = Xs.select_dtypes(include=["object", "category"]).columns.tolist()
    num_cols = Xs.select_dtypes(exclude=["object", "category"]).columns.tolist()

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
            ("num", "passthrough", num_cols)
        ]
    )

    pipeline = Pipeline(
        steps=[
            ("prep", preprocessor),
            ("model", model)
        ]
    )

    # Train on synthetic data
    pipeline.fit(Xs, ys)

    # Predict probabilities
    y_pred_proba = pipeline.predict_proba(Xr)

    n_classes = len(np.unique(yr))

    # ---- Binary classification ----
    if n_classes == 2:
        auc = roc_auc_score(yr, y_pred_proba[:, 1])

    # ---- Multiclass classification ----
    else:
        auc = roc_auc_score(
            yr,
            y_pred_proba,
            multi_class="ovr",
            average="macro"
        )

    return float(auc)
