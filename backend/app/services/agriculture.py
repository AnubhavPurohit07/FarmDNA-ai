"""Agricultural decision-support calculations for FarmDNA.

Crop prediction uses a locally trained scikit-learn model. Fertilizer and
irrigation outputs are transparent screening estimates, not prescriptions.
"""
from __future__ import annotations

import json
import csv
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "models" / "crop_recommender.joblib"
METRICS_PATH = BASE_DIR / "models" / "training_metrics.json"

FEATURES = ["Nitrogen", "Phosphorus", "Potassium", "Temperature", "Humidity", "pH_Value", "Rainfall"]

def _load_reference_csv(filename: str) -> list[dict[str, str]]:
    path = BASE_DIR / "data" / "reference" / filename
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


# The bundled reference datasets are read at runtime rather than duplicated in UI code.
CROP_KC = {
    row["crop"].lower(): {
        stage: float(row[stage]) for stage in ("initial", "development", "mid", "late")
    }
    for row in _load_reference_csv("crop_water_coefficients.csv")
}
SOIL_TEST_BANDS = {
    row["nutrient"]: (float(row["low_upper_kg_ha"]), float(row["medium_upper_kg_ha"]))
    for row in _load_reference_csv("soil_test_screening_bands.csv")
}


def model_status() -> dict[str, Any]:
    if not MODEL_PATH.exists():
        return {"ready": False, "message": "Crop model is not trained yet. Download the dataset and run the training script."}
    metrics = json.loads(METRICS_PATH.read_text()) if METRICS_PATH.exists() else {}
    return {"ready": True, "message": "Crop recommendation model is ready.", "metrics": metrics}


def recommend_crops(values: dict[str, float]) -> dict[str, Any]:
    if not MODEL_PATH.exists():
        raise RuntimeError("Crop model is not trained yet. Run: python -m scripts.train_crop_model")
    model = joblib.load(MODEL_PATH)
    row = pd.DataFrame([[values[key] for key in FEATURES]], columns=FEATURES)
    probabilities = model.predict_proba(row)[0]
    classes = model.classes_
    ranked = sorted(zip(classes, probabilities), key=lambda item: item[1], reverse=True)[:3]
    return {
        "recommendations": [
            {"crop": str(crop).title(), "model_score": round(float(score) * 100, 1)}
            for crop, score in ranked
        ],
        "model": "Random Forest classifier",
        "disclaimer": "Model confidence is not a guarantee of yield. Validate soil, weather, season, market access and local recommendations before sowing.",
    }


def fertilizer_advice(crop: str, n: float, p: float, k: float, area_ha: float) -> dict[str, Any]:
    crop_name = crop.strip().title()
    current = {"N": n, "P": p, "K": k}
    status = {}
    for nutrient, value in current.items():
        low, high = SOIL_TEST_BANDS[nutrient]
        category = "Low" if value < low else "Medium" if value <= high else "High"
        status[nutrient] = {
            "measured": round(value, 1), "screening_band": f"{low}-{high} kg/ha",
            "status": category,
        }
    low = [key for key, item in status.items() if item["status"] == "Low"]
    high = [key for key, item in status.items() if item["status"] == "High"]
    advice = []
    if low:
        advice.append(f"{', '.join(low)} are in the low screening band. Discuss a crop- and stage-specific nutrient plan with your local KVK after confirming the soil-test method.")
    if high:
        advice.append(f"{', '.join(high)} are in the high screening band. Avoid adding these nutrients without an agronomist's recommendation.")
    if not advice:
        advice.append("All three values fall in the medium screening bands. Use the crop, season and yield target with a local soil-test recommendation before applying fertilizer.")
    return {
        "crop": crop_name, "area_ha": area_ha, "nutrients": status,
        "priority": low, "recommendations": advice,
        "note": "These broad screening bands are educational examples, not a state-specific soil fertility rating or fertilizer prescription. Soil-test extraction methods and reporting units vary. Do not infer a fertilizer dose from these categories; consult your soil laboratory/KVK.",
    }


def irrigation_plan(crop: str, area_ha: float, eto_mm_day: float, rainfall_mm: float,
                    soil_moisture_pct: float, growth_stage: str, efficiency_pct: float) -> dict[str, Any]:
    crop_key = crop.strip().lower()
    coefficients = CROP_KC.get(crop_key, CROP_KC["default"])
    kc = coefficients[growth_stage]
    crop_use = eto_mm_day * kc
    effective_rain = rainfall_mm * 0.8
    net_depth = max(0.0, crop_use - effective_rain)
    # Soil moisture is used as a cautious adjustment signal, not a direct sensor calibration.
    if soil_moisture_pct >= 70:
        net_depth *= 0.5
    elif soil_moisture_pct >= 50:
        net_depth *= 0.75
    gross_depth = net_depth / (efficiency_pct / 100)
    area_m2 = area_ha * 10000
    litres = gross_depth * area_m2
    return {
        "crop": crop.title(), "area_ha": area_ha, "growth_stage": growth_stage,
        "crop_coefficient": kc, "estimated_crop_water_use_mm_day": round(crop_use, 2),
        "effective_rainfall_mm": round(effective_rain, 2),
        "net_irrigation_depth_mm": round(net_depth, 2),
        "gross_irrigation_depth_mm": round(gross_depth, 2),
        "estimated_water_litres": round(litres),
        "estimated_water_m3": round(litres / 1000, 2),
        "message": "No irrigation is indicated by these inputs today." if litres == 0 else "Use this as a planning estimate and confirm field moisture before irrigating.",
        "note": "Simplified FAO-style crop-coefficient estimate. It is not a live weather forecast or a calibrated soil-water-balance model. Local soil, slope, irrigation method and crop variety can change actual demand.",
    }
