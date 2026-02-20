# azure-iot-kafka-pipeline
Real-Time IoT Telemetry Pipeline: Cloud-native system simulating 50K+ smart devices, streaming via Kafka, auto-scaling Kubernetes consumers, Fluent UI dashboard. Tech: C++, Azure, Python, React. Handles 200K+ msgs/sec with auto-scaling. Demonstrates expertise in C++, Kafka, Azure, Kubernetes, React, DevOps – aligning with Microsoft's top skills.


# IoT Telemetry Pipeline

![License](https://img.shields.io/badge/license-MIT-blue)
![Azure](https://img.shields.io/badge/Microsoft%20Azure-0078D4?logo=microsoft-azure)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?logo=apache-kafka)
![C++](https://img.shields.io/badge/C++-00599C?logo=c%2B%2B)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![Fluent UI](https://img.shields.io/badge/Fluent%20UI-0078D4?logo=microsoft)

A production-grade, cloud-native IoT telemetry system that simulates 50,000+ smart home devices, streams data through Apache Kafka, processes it with auto-scaling consumers on Kubernetes, and visualizes everything in a real-time dashboard built with Microsoft's Fluent Design System 2.

Built with C++, Python, Azure Kubernetes Service (AKS), and React. Designed to demonstrate high-performance engineering, cloud scalability, and modern UI/UX standards.

---

## Features

- Massive Device Simulation – 50,000+ concurrent smart appliances (fans, ACs, lights) generating realistic telemetry every second.
- High-Throughput Streaming – Apache Kafka pipeline handling 200,000+ messages/sec with exactly‑once semantics.
- Real-Time Processing – Python consumers aggregate, filter, and store data in InfluxDB, PostgreSQL, and Redis.
- Auto-Scaling Infrastructure – Kubernetes Horizontal Pod Autoscaler dynamically scales consumers based on CPU, memory, and Kafka lag.
- Fluent Design Dashboard – Fully responsive React dashboard with dark/light themes, real-time WebSocket updates, and Microsoft's official Fluent UI components.
- Production-Ready DevOps – Complete CI/CD pipelines in Azure DevOps, infrastructure as code (Bicep), and comprehensive monitoring (Azure Monitor, Grafana).

---

## Architecture Overview

![Architecture Diagram](docs/architecture.png)

1. C++ Device Simulator – Generates telemetry for thousands of virtual appliances.
2. Apache Kafka – Acts as the central message bus, buffering and distributing data.
3. Stream Processor – Python service that consumes, aggregates, and enriches data.
4. Storage Layer – InfluxDB (time-series), PostgreSQL (metadata), Redis (cache).
5. Backend API – FastAPI with WebSocket for real-time dashboard updates.
6. React Dashboard – Fluent UI frontend displaying live metrics and controls.
7. Azure Kubernetes Service – Hosts all scalable components with auto-scaling.
8. Azure DevOps – Automates build, test, and deployment.

---

## Technologies Used

| Layer              | Technologies                                                                 |
|--------------------|------------------------------------------------------------------------------|
| Simulation         | C++17, librdkafka, OpenMP (multi-threading)                                  |
| Streaming          | Apache Kafka, Confluent Schema Registry (Avro)                               |
| Processing         | Python 3.11, confluent-kafka, pandas, numpy                                  |
| Storage            | InfluxDB 2.x, PostgreSQL 15, Redis 7                                         |
| Backend            | FastAPI, WebSockets, SQLAlchemy, asyncpg                                     |
| Frontend           | React 18, TypeScript, Fluent UI React 8, Recharts, React Query               |
| Infrastructure     | Azure Kubernetes Service (AKS), Bicep, Docker, Azure Container Registry      |
| CI/CD              | Azure DevOps (Pipelines, Repos, Artifacts)                                   |
| Monitoring         | Azure Monitor, Application Insights, Prometheus, Grafana                     |

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- CMake (>= 3.20)
- C++17 compiler (gcc/clang/msvc)
- Python 3.11+
- Node.js 18+ and npm
- Azure CLI (optional, for cloud deployment)

### Quick Start (Local)

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/iot-telemetry-pipeline.git
   cd iot-telemetry-pipeline
