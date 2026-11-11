from pydantic import BaseModel, Field
from typing import Literal


class CropRecommendationInput(BaseModel):
    nitrogen: float = Field(ge=0, le=300)
    phosphorus: float = Field(ge=0, le=300)
    potassium: float = Field(ge=0, le=400)
    temperature: float = Field(ge=-5, le=60)
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0, le=2000)


class FertilizerInput(BaseModel):
    crop: str = Field(min_length=2, max_length=40)
    nitrogen: float = Field(ge=0, le=1000)
    phosphorus: float = Field(ge=0, le=1000)
    potassium: float = Field(ge=0, le=1000)
    area_ha: float = Field(gt=0, le=10000)


class IrrigationInput(BaseModel):
    crop: str = Field(min_length=2, max_length=40)
    area_ha: float = Field(gt=0, le=10000)
    eto_mm_day: float = Field(gt=0, le=20, description="Reference evapotranspiration in mm/day")
    rainfall_mm: float = Field(ge=0, le=300)
    soil_moisture_pct: float = Field(ge=0, le=100)
    growth_stage: Literal["initial", "development", "mid", "late"]
    efficiency_pct: float = Field(gt=10, le=100, default=75)
