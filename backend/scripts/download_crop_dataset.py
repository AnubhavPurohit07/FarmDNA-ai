"""Download the public 2,200-row Crop Recommendation dataset.

The CSV is sourced from a public GitHub mirror of the widely used Kaggle
Crop Recommendation Dataset. Review the upstream license/attribution before
redistributing outside an academic project.
"""
from pathlib import Path
from urllib.request import Request, urlopen
import argparse
import csv

URL = "https://raw.githubusercontent.com/nileshiq/Crop-Recommendation/main/Crop_Recommendation.csv"
EXPECTED = {"Nitrogen", "Phosphorus", "Potassium", "Temperature", "Humidity", "pH_Value", "Rainfall", "Crop"}
DEST = Path(__file__).resolve().parents[1] / "data" / "raw" / "Crop_Recommendation.csv"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=URL, help="Optional alternate direct CSV URL")
    args = parser.parse_args()
    DEST.parent.mkdir(parents=True, exist_ok=True)
    request = Request(args.url, headers={"User-Agent": "FarmDNA-Academic-Project/1.0"})
    with urlopen(request, timeout=60) as response:
        content = response.read()
    text = content.decode("utf-8-sig")
    rows = list(csv.DictReader(text.splitlines()))
    if not rows or not EXPECTED.issubset(rows[0].keys()):
        raise SystemExit("Downloaded file does not match the expected Crop Recommendation schema.")
    if len(rows) < 1000:
        raise SystemExit(f"Dataset validation failed: expected at least 1,000 rows, received {len(rows)}.")
    DEST.write_bytes(content)
    print(f"Saved {len(rows)} rows to {DEST}")


if __name__ == "__main__":
    main()
