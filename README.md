# Eyego Logger Service 🚀

A scalable, event-driven microservice for processing user activity logs using Node.js, Kafka, and MongoDB.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)

## 🏗 Architecture

This service follows **Domain-Driven Design (DDD)** principles and utilizes an **Event-Driven Architecture**.

1.  **Producer (API):** Accepts HTTP requests, validates data, and pushes events to a Kafka topic.
2.  **Broker (Kafka):** Buffers messages to ensure high throughput and system resilience.
3.  **Consumer (Worker):** Asynchronously processes messages and persists them to MongoDB.

_(Detailed architecture decisions will be added here as we build)._

## 🛠 Prerequisites

- **Node.js** (v18 or higher)
- **Docker** & **Docker Compose** (for local infrastructure)

## ⚙️ Installation

1.  **Clone the repository**

    ```bash
    git clone <repo-url>
    cd eyego-logger-service
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```ini
    PORT=3000
    NODE_ENV=development
    MONGO_URI=mongodb://localhost:27017/eyego-logs
    KAFKA_BROKERS=localhost:9092
    KAFKA_CLIENT_ID=eyego-logger-service
    KAFKA_GROUP_ID=log-processing-group
    ```

## 🚀 Running Locally

1.  **Start Infrastructure (Kafka, Zookeeper, MongoDB)**

    ```bash
    docker-compose up -d
    ```

2.  **Start the Application (Development Mode)**

    ```bash
    npm run dev
    ```

3.  **Verify Connectivity**
    Visit `http://localhost:3000/health`
