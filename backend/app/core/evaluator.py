from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score


def evaluate_tstr(real_df, synthetic_df, target_col, model):
    # Split features & target properly
    Xs = synthetic_df.drop(columns=[target_col])
    ys = synthetic_df[target_col]        # 1D Series

    Xr = real_df.drop(columns=[target_col])
    yr = real_df[target_col]              # 1D Series

    # Detect categorical & numeric columns
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

    # Train on synthetic
    pipeline.fit(Xs, ys)

    # Predict probability for positive class only
    y_pred_proba = pipeline.predict_proba(Xr)[:, 1]

    # Binary ROC-AUC
    auc = roc_auc_score(yr, y_pred_proba)

    return float(auc)
