# Architecture Decisions 🏗️

## 1. Domain-Driven Design (DDD)

I chose a Layered DDD architecture to decouple business logic from infrastructure.

- **Domain Layer:** Contains the `LogEntity` and Repository Interfaces. It has zero dependencies on external libraries.
- **Infrastructure Layer:** Handles Mongoose, KafkaJS, and concrete Repository implementations.
- **Application Layer:** Orchestrates data flow.
  _Why?_ This allows switching databases or message brokers in the future without rewriting the core business logic.

## 2. Event-Driven Strategy (Kafka)

Instead of synchronous writes, I implemented an asynchronous pattern:

- **Producer:** Returns `202 Accepted` immediately for high throughput.
- **Kafka:** Acts as a buffer for traffic spikes.
- **Consumer:** Processes logs at a controlled rate, preventing database overload.

## 3. Deployment Strategy

- **Docker:** Multi-stage build reduces image size (216MB) and ensures security (non-root user).
- **Kubernetes:** Uses `Deployment` for self-healing pods and `ConfigMap` for environment management.
