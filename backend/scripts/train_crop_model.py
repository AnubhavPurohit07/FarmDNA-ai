"""Train and evaluate FarmDNA's crop recommendation classifier."""
from pathlib import Path
import json
import sys

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "raw" / "Crop_Recommendation.csv"
MODEL_DIR = ROOT / "models"
FEATURES = ["Nitrogen", "Phosphorus", "Potassium", "Temperature", "Humidity", "pH_Value", "Rainfall"]
TARGET = "Crop"


def main():
    if not DATA.exists():
        raise SystemExit("Dataset not found. First run: python -m scripts.download_crop_dataset")
    df = pd.read_csv(DATA)
    missing = set(FEATURES + [TARGET]) - set(df.columns)
    if missing:
        raise SystemExit(f"Dataset is missing required columns: {', '.join(sorted(missing))}")
    df = df[FEATURES + [TARGET]].dropna().drop_duplicates()
    for column in FEATURES:
        df[column] = pd.to_numeric(df[column], errors="coerce")
    df = df.dropna()
    if df[TARGET].nunique() < 2 or len(df) < 100:
        raise SystemExit("Dataset needs at least 100 valid rows and two crop classes.")

    X, y = df[FEATURES], df[TARGET].astype(str).str.strip().str.lower()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    model = RandomForestClassifier(
        n_estimators=350, max_features="sqrt", class_weight="balanced",
        random_state=42, n_jobs=-1,
    )
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    metrics = {
        "dataset_rows_after_cleaning": int(len(df)),
        "train_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "crop_classes": int(y.nunique()),
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "classification_report": classification_report(y_test, predictions, output_dict=True, zero_division=0),
        "confusion_matrix": confusion_matrix(y_test, predictions, labels=model.classes_).tolist(),
        "class_labels": model.classes_.tolist(),
        "feature_importance": {name: round(float(value), 5) for name, value in zip(FEATURES, model.feature_importances_)},
        "random_state": 42,
        "note": "Holdout metrics describe this dataset split only; they do not establish field-level accuracy.",
    }
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_DIR / "crop_recommender.joblib")
    (MODEL_DIR / "training_metrics.json").write_text(json.dumps(metrics, indent=2))
    print(f"Model trained. Holdout accuracy: {metrics['accuracy']:.2%}")
    print(f"Saved model to {MODEL_DIR / 'crop_recommender.joblib'}")


if __name__ == "__main__":
    main()
