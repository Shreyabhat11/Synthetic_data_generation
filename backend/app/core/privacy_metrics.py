import numpy as np
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import NearestNeighbors

def disclosure_risk(real_df, synthetic_df, n_neighbors=1):
    """
    Average distance to nearest synthetic neighbor.
    Memory-safe & scalable.
    """

    cat_cols = real_df.select_dtypes(include=["object", "category"]).columns
    num_cols = real_df.select_dtypes(exclude=["object", "category"]).columns

    preprocessor = ColumnTransformer(
        [
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
            ("num", StandardScaler(), num_cols),
        ]
    )

    # Fit ONLY on real data
    real_enc = preprocessor.fit_transform(real_df)
    synth_enc = preprocessor.transform(synthetic_df)

    # Nearest neighbor search
    nn = NearestNeighbors(
        n_neighbors=n_neighbors,
        metric="euclidean",
        algorithm="auto",
        n_jobs=-1
    )

    nn.fit(synth_enc)
    distances, _ = nn.kneighbors(real_enc, return_distance=True)

    return float(np.mean(distances))

def normalize_disclosure_risk(distance, scale=5.0):
    """
    Converts unbounded distance into [0,1] privacy score
    Higher = better privacy
    """
    score = 1 - np.exp(-distance / scale)
    return float(np.clip(score, 0, 1))

