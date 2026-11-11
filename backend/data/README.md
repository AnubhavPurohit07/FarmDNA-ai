# FarmDNA agriculture datasets

## Bundled reference dataset

`reference/crop_water_coefficients.csv` is included in this project and supplies starter crop-coefficient values used by the irrigation planner. These values are simplified planning references and must be calibrated to local crop variety, soil, climate and irrigation method.

## Crop recommendation ML dataset (2,200 records)

The project includes a validated downloader for the public Crop Recommendation Dataset. The 2,200-row CSV itself could not be embedded in this delivery because the file-transfer runtime could not retrieve the upstream raw file. It is **not** replaced with fabricated or synthetic training data.

From the `backend/` directory, run:

```bash
python -m scripts.download_crop_dataset
python -m scripts.train_crop_model
```

The downloader fetches the public CSV mirror, checks its eight expected columns and verifies at least 1,000 rows before saving `data/raw/Crop_Recommendation.csv`. The training script cleans the data, performs a stratified 80/20 train/test split, trains a Random Forest classifier, and saves the model plus holdout metrics under `models/`.

Dataset source mirror: https://github.com/nileshiq/Crop-Recommendation
Original commonly used dataset: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset

Review the upstream license and attribution before redistributing the downloaded CSV. Model scores describe the dataset holdout split only; they do not establish field-level accuracy. Validate with local field data before practical use.
