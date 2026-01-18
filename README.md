#  Synthetic Data Generation & Evaluation Platform

An end-to-end **Synthetic Data Generation and Evaluation Platform** built using **CTGAN**, providing a practical interface to generate high-quality synthetic tabular data and evaluate it across **utility** and **privacy** dimensions.

The system integrates **machine learning evaluation (TSTR)**, **privacy risk analysis**, and a **full-stack web application** for interactive experimentation.

---

##  Key Features

* Upload real tabular datasets (CSV)
*  Train **CTGAN** models on mixed (categorical + numerical) data
*  Generate synthetic datasets
*  Evaluate **Utility** using **TSTR (Train on Synthetic, Test on Real)**
*  Evaluate **Privacy Risk** using disclosure-based metrics
*  Visual dashboards for metrics and comparisons
*  FastAPI backend + React frontend
*  Modular, extensible ML evaluation pipeline

---

##  System Architecture

```
frontend/        → React (Vite) UI
backend/
 ├── app/
 │   ├── api/           → FastAPI routes (upload, train, generate, evaluate)
 │   ├── core/          → CTGAN training, evaluation & privacy logic
 │   ├── state.py       → In-memory experiment state
 │   └── main.py        → FastAPI app entrypoint
 └── requirements.txt
```

---

##  Methodology Overview

### 1️ Synthetic Data Generation

* Model: **CTGAN (Conditional Tabular GAN)**
* Handles:

  * Mixed data types
  * High-cardinality categorical features
* Preprocessing:

  * Missing value handling
  * Log-transformation (`log1p`) for skewed numerical columns
  * Explicit categorical column detection

### 2️ Utility Evaluation (TSTR)

**Train on Synthetic, Test on Real**

* Classifier: RandomForest
* Metric:

  * Binary targets → ROC-AUC
  * Multiclass targets → One-vs-Rest ROC-AUC (macro)
* Purpose:

  * Measures how well synthetic data preserves predictive structure

### 3️ Privacy Evaluation

* Disclosure-based privacy metrics
* Quantifies similarity and re-identification risk
* Evaluated independently from utility metrics

---

##  Metrics Used

| Category      | Metric                                     |
| ------------- | ------------------------------------------ |
| Utility       | TSTR ROC-AUC                               |
| Privacy       | Disclosure Risk                            |
| Evaluation    | Binary & Multiclass AUC                    |
| Visualization | Distribution comparison, metric dashboards |

---

##  Privacy–Utility Tradeoff

This platform explicitly highlights the **privacy–utility tradeoff**:

* Higher utility → increased similarity to real data → higher privacy risk
* Strong privacy → degraded downstream ML performance

The dashboard enables practitioners to **balance both objectives** based on use-case requirements.

---

##  Tech Stack

### Backend

* **FastAPI**
* **CTGAN / SDV**
* **Scikit-Learn**
* **Pandas / NumPy**
* **PyTorch (via CTGAN)**

### Frontend

* **React (Vite)**
* **Axios**
* **Chart.js / Recharts**
* **Modern UI components**

---

##  Running the Project Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  Example Use Cases

* Privacy-preserving data sharing
* Synthetic datasets for ML model development
* Compliance-aware analytics
* Safe experimentation on sensitive datasets (healthcare, finance, etc.)

---

##  Limitations

* GAN training is computationally intensive
* Tradeoff between training speed and data fidelity
* Evaluation metrics depend on downstream model choice
* Not suitable for high-dimensional time-series (current scope)

---

##  Future Enhancements

* Differential Privacy integration (DP-CTGAN)
* Async training jobs (Celery / background workers)
* Model checkpointing
* Advanced privacy metrics (Membership Inference Attacks)
* Experiment tracking (MLflow)

---

##  Author

**Shreya Bhat**
📧 [shreyabhat545@gmail.com](mailto:shreyabhat545@gmail.com)
🎓 Capstone Project – Synthetic Data Generation & Evaluation
