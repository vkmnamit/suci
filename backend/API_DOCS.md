# SUCI Backend API Documentation

This document outlines all the available API endpoints for the SUCI (Self-Improving Urban Climate Intelligence) backend, designed to help you quickly test responses in Postman or integrate them into your frontend.

All requests should be made to your local environment:
**Base URL:** `http://localhost:8000/api/v1`

---

## 🔐 1. Authentication (Mocked)
The backend is currently equipped with a local fallback, allowing you to log in without a live database connection string.

### Signup
- **Endpoint:** `POST /auth/signup`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "operator@city.gov",
  "password": "password"
}
```

### Login
- **Endpoint:** `POST /auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "operator@city.gov",
  "password": "password"
}
```

---

## 🏙️ 2. City & Infrastructure
Endpoints fetching real-time data about the city's power grid, zones, and current emissions.

### Get All Zones
- **Endpoint:** `GET /city/zones`
- **Description:** Returns a list of all defined city zones with their high-level carbon/renewable metrics.

### Get Single Zone Details
- **Endpoint:** `GET /city/zones/{zone_id}`
- **Example URL:** `http://localhost:8000/api/v1/city/zones/zone-1`
- **Description:** Returns detailed infrastructure data, including associated buildings and power substations for a specific zone.

### Get Real-Time Zone State
- **Endpoint:** `GET /city/zones/{zone_id}/state`
- **Example URL:** `http://localhost:8000/api/v1/city/zones/zone-1/state`
- **Description:** Returns the current energy demand (MWh) and live carbon score for the zone.

---

## 📈 3. Energy Forecasts
Endpoints to retrieve AI-generated energy load comparisons and timeseries data.

### Get Zone Energy Forecast
- **Endpoint:** `GET /forecast/energy/{zone_id}`
- **Example URL:** `http://localhost:8000/api/v1/forecast/energy/zone-1`
- **Query Params (Optional):** `?hours=6`
- **Description:** Returns an array of actual historical MWh readings alongside the model's predicted MWh readings.

### Get Total City Forecast Summary
- **Endpoint:** `GET /forecast/all-zones`
- **Description:** Returns aggregated forecast data across the entire city grid.

---

## 🔄 4. RLAIF (Self-Improving AI)
Endpoints to map the progress of the locally hosted "AI Judge" diagnosing model errors and triggering retraining loops.

### Get Accuracy Logs
- **Endpoint:** `GET /rlaif/accuracy-log`
- **Description:** Returns a history of the model's error rates (MAPE) before and after synthetic retraining loops.

### Get AI Judge Critiques
- **Endpoint:** `GET /rlaif/critiques`
- **Description:** Returns the recent root cause analyses provided by the reasoning AI upon uncovering prediction inaccuracies.

---

## 💬 5. Chat & Reasoning (Ollama)
These endpoints converse directly with your locally hosted reasoning model (`deepseek-r1` or `qwen2.5`) to provide intelligent urban climate analysis.

### Send Chat Message
- **Endpoint:** `POST /chat/message`
- **Headers:** `Content-Type: application/json`
- **Body (Streaming Disabled):**
```json
{
  "message": "Hello, what is the carbon situation in Downtown?",
  "stream": false
}
```
- **Body (Streaming Enabled - SSE):**
```json
{
  "message": "Hello, what is the carbon situation in Downtown?",
  "stream": true
}
```

### Generate Morning Briefing
- **Endpoint:** `POST /chat/briefing`
- **Description:** A trigger to force the AI to read the entire city graph state and generate an executive summary for the city operator. 
- **Wait Time:** This runs synchronously. Expect `5-15 seconds` of wait time if relying on a local heavy model.
