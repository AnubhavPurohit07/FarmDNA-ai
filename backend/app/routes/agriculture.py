from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.db.connection import agriculture_collection
from app.middleware.auth_middleware import require_auth
from app.models.agriculture import CropRecommendationInput, FertilizerInput, IrrigationInput
from app.services.agriculture import model_status, recommend_crops, fertilizer_advice, irrigation_plan

router = APIRouter(prefix="/api/agriculture", tags=["agriculture"])


@router.get("/status")
async def agriculture_status():
    return {"crop_model": model_status(), "modules": ["crop-recommendation", "fertilizer-advisor", "irrigation-planner"]}


async def save_result(user: dict, module: str, inputs: dict, output: dict):
    await agriculture_collection.insert_one({
        "user_id": user["user_id"], "module": module, "inputs": inputs,
        "output": output, "created_at": datetime.now(timezone.utc).isoformat(),
    })


@router.post("/crop-recommendation")
async def crop_recommendation(payload: CropRecommendationInput, user: dict = Depends(require_auth)):
    values = {
        "Nitrogen": payload.nitrogen, "Phosphorus": payload.phosphorus,
        "Potassium": payload.potassium, "Temperature": payload.temperature,
        "Humidity": payload.humidity, "pH_Value": payload.ph, "Rainfall": payload.rainfall,
    }
    try:
        result = recommend_crops(values)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    await save_result(user, "crop-recommendation", payload.model_dump(), result)
    return result


@router.post("/fertilizer-advice")
async def fertilizer_recommendation(payload: FertilizerInput, user: dict = Depends(require_auth)):
    try:
        result = fertilizer_advice(payload.crop, payload.nitrogen, payload.phosphorus, payload.potassium, payload.area_ha)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    await save_result(user, "fertilizer-advisor", payload.model_dump(), result)
    return result


@router.post("/irrigation-plan")
async def irrigation_recommendation(payload: IrrigationInput, user: dict = Depends(require_auth)):
    result = irrigation_plan(**payload.model_dump())
    await save_result(user, "irrigation-planner", payload.model_dump(), result)
    return result


@router.get("/history")
async def agriculture_history(user: dict = Depends(require_auth), limit: int = 20):
    limit = max(1, min(limit, 100))
    cursor = agriculture_collection.find({"user_id": user["user_id"]}).sort("created_at", -1).limit(limit)
    docs = await cursor.to_list(length=limit)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
        doc.pop("user_id", None)
    return docs
