import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error
from scipy.stats import entropy


def compute_mse(real_df, synth_df):
    num_cols = real_df.select_dtypes(include=np.number).columns
    return float(mean_squared_error(
        real_df[num_cols].mean(),
        synth_df[num_cols].mean()
    ))


def compute_kl_divergence(real_df, synth_df, bins=20):
    num_cols = real_df.select_dtypes(include=np.number).columns
    kl_scores = []

    for col in num_cols:
        real_hist, _ = np.histogram(real_df[col], bins=bins, density=True)
        synth_hist, _ = np.histogram(synth_df[col], bins=bins, density=True)

        real_hist += 1e-8
        synth_hist += 1e-8

        kl_scores.append(entropy(real_hist, synth_hist))

    return float(np.mean(kl_scores))


def compute_correlation_difference(real_df, synth_df):
    real_corr = real_df.corr(numeric_only=True)
    synth_corr = synth_df.corr(numeric_only=True)

    diff = (real_corr - synth_corr).abs().values
    return float(np.nanmean(diff))


def compute_statistical_similarity(mse, kl):
    return float(np.exp(-(mse + kl)))
