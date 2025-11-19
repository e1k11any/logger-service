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

⚙️ Installation
Clone the repository:
git clone https://github.com/e1k11any/logger-service
cd eyego-logger-service

Install Dependencies:
npm install

Environment Setup Create a .env file in the root directory:
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eyego-logs
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=eyego-logger-service
KAFKA_GROUP_ID=log-processing-group

🚀 Running Locally (Docker Compose)
This method runs the infrastructure (Kafka/Mongo) in Docker, but the Node.js app runs on your host machine for easy debugging.

Start Infrastructure:
docker-compose up -d

Start Application:
npm run dev

Verify Connectivity Visit http://localhost:3000/health. You should see {"status": "UP"}.

☸️ Running on Kubernetes
This simulates a production cloud deployment.

Build the Docker Image:
docker build -t eyego-logger:v1 .

Deploy to Cluster:
kubectl apply -f k8s/

Check Status Wait for the pod to be Running:
kubectl get pods

Access the Service The service is exposed via NodePort at port 30001:
URL: http://localhost:30001/health

📡 API Documentation

1. Health Check
   Endpoint: GET /health

Description: Checks if the API is running.

2. Ingest Log (Producer)
   Endpoint: POST /api/v1/logs

Description: Validates log data and pushes it to the Kafka queue.
Body:
JSON
{
"userId": "user_123",
"action": "CLICK_BUTTON",
"meta": { "page": "home" }
}

Response: 202 Accepted

3. Fetch Logs (Retrieval)
   Endpoint: GET /api/v1/logs

Description: Retrieve processed logs from MongoDB.

Query Parameters:

page: Page number (default: 1)

limit: Items per page (default: 10)

userId: Filter by User ID

startDate: ISO Date string

endDate: ISO Date string

Example: GET /api/v1/logs?userId=user_123&page=1&limit=5
