import unittest
from app.models.agriculture import CropRecommendationInput, FertilizerInput, IrrigationInput
from app.services.agriculture import fertilizer_advice, irrigation_plan


class AgricultureServiceTests(unittest.TestCase):
    def test_fertilizer_screening_flags_low_nutrients(self):
        result = fertilizer_advice("wheat", 100, 8, 150, 1.5)
        self.assertEqual(result["priority"], ["N", "P"])
        self.assertEqual(result["area_ha"], 1.5)

    def test_irrigation_estimate_is_non_negative(self):
        result = irrigation_plan("wheat", 1, 4.5, 30, 75, "development", 75)
        self.assertGreaterEqual(result["estimated_water_litres"], 0)
        self.assertEqual(result["estimated_water_litres"], 0)

    def test_irrigation_estimate_uses_area(self):
        one = irrigation_plan("wheat", 1, 4.5, 0, 20, "mid", 75)
        two = irrigation_plan("wheat", 2, 4.5, 0, 20, "mid", 75)
        self.assertEqual(two["estimated_water_litres"], one["estimated_water_litres"] * 2)

    def test_crop_input_validation(self):
        payload = CropRecommendationInput(nitrogen=90, phosphorus=42, potassium=43,
            temperature=25, humidity=80, ph=6.5, rainfall=200)
        self.assertEqual(payload.ph, 6.5)

    def test_irrigation_input_rejects_invalid_stage(self):
        with self.assertRaises(ValueError):
            IrrigationInput(crop="wheat", area_ha=1, eto_mm_day=4, rainfall_mm=0,
                soil_moisture_pct=20, growth_stage="flowering", efficiency_pct=75)


if __name__ == "__main__":
    unittest.main()
