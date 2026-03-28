import sys
import os
import asyncio

# Setup path to import app services
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

async def test_ml_prediction():
    try:
        from app.services.models import model_service
        
        print("\n--- ML Model Integration Test ---")
        
        # Test 1: Single Prediction
        # [traffic, energy, renewable_fraction, temperature]
        test_inputs = {
            "traffic": 120.0,
            "energy": 45.0,
            "renewable_fraction": 0.3,
            "temperature": 28.0
        }
        
        prediction = model_service.predict_carbon_emission(**test_inputs)
        print(f"Input: {test_inputs}")
        print(f"ML Model Prediction: {prediction:.2f} kg CO2/h")
        
        # Test 2: 24h Forecast
        print("\n--- 24h Forecast Prediction ---")
        base_values = {
            "traffic": 70, 
            "energy": 450, 
            "renewable_fraction": 0.35, 
            "temperature": 28
        }
        forecast = model_service.forecast_24h(base_values)
        print(f"Forecast length: {len(forecast)} points")
        print(f"Sample point [12:00]: {forecast[12] if len(forecast) > 12 else 'N/A'}")
        
        print("\n--- Summary ---")
        if model_service.model:
            print("Status: ✅ Model loaded successfully.")
            if hasattr(model_service.model, "feature_names_in_"):
                print(f"Expected Features ({len(model_service.model.feature_names_in_)}): {model_service.model.feature_names_in_}")
            else:
                print("Model does not have feature_names_in_ attribute.")
        else:
            print("Status: ⚠️ Using fallback logic. Model file not found or failed to load.")
            
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ml_prediction())
