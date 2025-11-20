# Eyego Logger Service 🚀

A scalable, event-driven microservice for processing user activity logs using **Node.js**, **Kafka**, **MongoDB**, and **Kubernetes**.

This project demonstrates **Domain-Driven Design (DDD)** principles and a resilient **Producer-Consumer** architecture.

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Locally (Docker Compose)](#-running-locally-docker-compose)
- [Running on Kubernetes](#-running-on-kubernetes)
- [API Documentation](#-api-documentation)

## 🏗 Architecture

This service utilizes an **Event-Driven Architecture** to handle high-throughput traffic without blocking the main thread.

### Data Flow

1.  **Producer (API):** Accepts HTTP requests, validates input, and immediately returns `202 Accepted`. It pushes the event to a **Kafka Topic**.
2.  **Broker (Kafka):** Buffers messages, acting as a shock absorber for traffic spikes.
3.  **Consumer (Worker):** A background service listens to the topic, processes the data (adds timestamps), and persists it to **MongoDB**.
4.  **Retrieval (Query):** A separate Repository pattern reads processed logs from MongoDB with pagination and filtering.

### Design Decisions

- **Domain-Driven Design (DDD):** Logic is separated into `Domain` (Entities/Interfaces), `Application` (Use Cases), and `Infrastructure` (Tools). This makes the code testable and database-agnostic.
- **Asynchronous Processing:** Using Kafka prevents the database from becoming a bottleneck during write-heavy operations.
- **Multi-Stage Docker Build:** The final image is optimized (~200MB) by stripping out development dependencies and TypeScript sources.

🛠 Prerequisites
Node.js (v18 or higher)

Docker & Docker Compose

Kubernetes (Optional): Minikube or Docker Desktop K8s

⚙️ Installation <br>
Clone the repository:
- git clone https://github.com/e1k11any/logger-service
- cd eyego-logger-service

Install Dependencies: <br>
npm install

Environment Setup Create a .env file in the root directory: <br>
- PORT=3000
- NODE_ENV=development
- MONGO_URI=mongodb://localhost:27017/eyego-logs
- KAFKA_BROKERS=localhost:9092
- KAFKA_CLIENT_ID=eyego-logger-service
- KAFKA_GROUP_ID=log-processing-group

🚀 Running Locally (Docker Compose) <br>
This method runs the infrastructure (Kafka/Mongo) in Docker, but the Node.js app runs on your host machine for easy debugging.

Start Infrastructure: <br>
- docker-compose up -d

Start Application: <br>
- npm run dev

Verify Connectivity Visit http://localhost:3000/health. You should see {"status": "UP"}.

☸️ Running on Kubernetes <br>
This simulates a production cloud deployment.

Build the Docker Image: <br>
- docker build -t eyego-logger:v1 .

Deploy to Cluster: <br>
- kubectl apply -f k8s/

Check Status Wait for the pod to be Running:<br>
- kubectl get pods

Access the Service The service is exposed via NodePort at port 30001:<br>
- URL: http://localhost:30001/health

📡 API Documentation<br>

1. Health Check<br>
   - Endpoint: GET /health
   - Description: Checks if the API is running.<br>

2. Ingest Log (Producer)<br>
   - Endpoint: POST /api/v1/logs
   - Description: Validates log data and pushes it to the Kafka queue.<br>
Body:<br>
JSON<br>
{<br>
"userId": "user_123",<br>
"action": "CLICK_BUTTON",<br>
"meta": { "page": "home" }<br>
}<br>

Response: 202 Accepted

3. Fetch Logs (Retrieval)
   - Endpoint: GET /api/v1/logs
   - Description: Retrieve processed logs from MongoDB.
      - Query Parameters:<br>
         - page: Page number (default: 1)<br>
         - limit: Items per page (default: 10)<br>
         - userId: Filter by User ID<br>
         - startDate: ISO Date string<br>
         - endDate: ISO Date string<br>
         - Example: GET /api/v1/logs?userId=user_123&page=1&limit=5
