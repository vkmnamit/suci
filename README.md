# SUCI: Strategic Urban Climate Intelligence

SUCI is a high-performance **Urban Digital Twin** and AI-driven climate governance platform designed for metropolitan intelligence and strategic planning.

---

## 🏗️ Technical Architecture

### 🛡️ Backend (The Intelligence Core)
The backend is built using **FastAPI**, a modern, high-performance Python framework designed for tactical API services and AI orchestration.

#### Core Services & Modules:
- **Tactical Reasoning Engine (`rlaif.py`)**: Integrates local LLMs (Ollama) to synthesize urban telemetry into strategic conclusions. It uses an asynchronous client for non-blocking urban simulation.
- **Predictive Forecasting (`forecast.py`)**: A multi-stage ML pipeline that predicts carbon and energy trends. It processes historical zone data to anticipate $12.4\%$ surges in metropolitan load.
- **Strategic Persistence (`scenarios.py`)**: Manages the lifecycle of tactical scenarios and formal climate audit reports. It interfaces with Supabase for persistent, searchable audit trails.
- **Urban Graph Service (`city_graph.py`)**: Maintains the spatial relationship of metropolitan nodes (e.g., Bangalore Hub) and computes carbon flux between zones.

#### Tech Stack (Backend):
- **FastAPI**: Core API framework.
- **Ollama (AsyncClient)**: Local AI strategist.
- **Supabase/PostgreSQL**: Primary data persistence.
- **Pythia/Custom ML**: Predictive modeling for urban trends.
- **Structlog**: Structured logging for mission-critical audit trails.

---

### 🎨 Frontend (The Operator Interface)
The frontend is a **React / Next.js** application designed for high-fidelity interactive visualization and mission-critical decision support.

#### Primary Modules:
- **3D Urban Pulse (`CityGraph3D.tsx`)**: A high-fidelity Three.js environment that visualizes the city as a dynamic, glowing network.
  - **Node Geometry**: Octahedral/Spherical nodes with emissive materials.
  - **Metropolitan Flux**: Particle systems visualizing data and energy flow between sectors.
- **Zero-Click AI Simulation**: Integrated into the zone selection lifecycle, triggering autonomous simulations upon selecting any urban node.
- **Predictive HUD (`Dashboard.tsx`)**: A centric dashboard that layers real-time telemetry and ML-forecasted "Future Info" as translucent overlays.
- **Dynamic Persistence Logic**: Leverages local storage and React hooks (`useInterventions`, `useReports`) to maintain operator continuity during multi-phase simulations.

#### Tech Stack (Frontend):
- **React 18 / Next.js**: Component-based UI architecture.
- **Three.js / React Three Fiber**: Powers the high-fidelity 3D Urban Digital Twin.
- **Motion (framer-motion)**: Fluid UI transitions and spatial animations.
- **Lucide-React**: High-fidelity iconography.
- **Recharts**: Predictive data visualization.

---

## 🚀 Key Features In-Depth

### 1. 🌐 Urban Digital Twin (3D Graph)
A spatial graph representation of cities like Bangalore.
- **Dynamic Pulse**: Nodes glow and scale based on real-time carbon intensity.
- **Particle Flow**: Directional particle systems visualize urban interdependencies and carbon flux between sectors.
- **Topological Toggle**: Seamlessly switch between 2D heatmaps and 3D structural graphs.

### 2. ⚡ Zero-Click Tactical AI
Automated simulation cycle that triggers upon metropolitan node selection.
- **Strategic Synthesis**: AI provides immediate, optimized "Best Outcome" scenarios.
- **Micro-Tactical Interventions**: Precise engineering recommendations (e.g., $10^{-4}$ adjustments) for carbon reduction.
- **Projected Impact**: Real-time calculation of potential CO2 reduction for the selected zone.

### 3. 📉 Predictive ML Forecasting
Anticipates future metropolitan loads and environmental risks.
- **Load Surge Detection**: Detects $12.4\%$ surging thermal loads over specific city sectors (e.g., Bangalore East).
- **Future Info Alpha**: Autonomous "continuous analysis" that provides strategic conclusions beyond human-scale observation.

### 4. 📝 Strategic Reporting Lifecycle
Bridging the gap between predictive modeling and formal documentation.
- **Scenario Persistence**: Save simulation paths with unique `SCEN-IDs`.
- **AI-Driven Audit synthesis**: Triggers the "Lead Strategist" persona to synthesize simulation data into formal, authoritative climate audit reports.
- **Persistent Audit Trails**: All reports are stored in the database for long-term historical and regulatory tracking.

---

## 🛠️ Getting Started

### Backend Setup:
1.  Navigate to the `/backend` directory.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Ensure Ollama is running locally with the `mistral` or `llama3` model.
4.  Run the server: `python main.py` or `uvicorn app.main:app`.

### Frontend Setup:
1.  Navigate to the `/frontend` directory.
2.  Install dependencies: `npm install`.
3.  Run the development server: `npm run dev`.

---

*SUCI: Engineering a Sustainable Metropolitan Future.*
