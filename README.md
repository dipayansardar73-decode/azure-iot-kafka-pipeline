# Real-Time IoT Telemetry Pipeline

## Overview
A high-performance, cloud-native IoT telemetry pipeline handling 50,000+ simulated devices with real-time analytics and a Fluent UI 2 dashboard.

## Architecture
- **Simulator**: C++17 Multi-threaded application using `librdkafka`
- **Broker**: Apache Kafka
- **Processor**: Python service with Pandas for aggregation
- **Storage**: InfluxDB (Metrics), PostgreSQL (Metadata), Redis (Real-time)
- **Backend**: FastAPI with WebSockets
- **Frontend**: React + Fluent UI 2

## Prerequisites
- Docker & Docker Compose
- C++ Compiler (CMake, GCC/Clang)
- Python 3.11+
- Node.js 18+

## Quick Start (Local)

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Build & Run Simulator (C++)
Run the dependency setup script first (Mac/Linux):
```bash
./setup_dependencies.sh
```
Then compile and run:
```bash
cd simulator
mkdir build && cd build
cmake .. && make
./DeviceSimulator
```

### 3. Run Processor (Python)
```bash
cd processor
pip install -r requirements.txt
python src/main.py
```

### 4. Run Backend (Python)
```bash
cd backend
pip install -r requirements.txt
python src/main.py
```

### 5. Run Dashboard (React)
```bash
cd dashboard
npm install
npm run dev
```

Visit `http://localhost:5173` to view the dashboard.

## Deployment
Dockerfiles are provided in each service directory.
Kubernetes manifests are located in `infrastructure/kubernetes`.
