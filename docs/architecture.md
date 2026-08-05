# Architecture

## Overview

This project implements an event-driven architecture using **Change Data Capture (CDC)** to synchronize data between the Product Service and the Search Service.

The Product Service is responsible for managing products and categories, while the Search Service maintains a search-optimized representation of the data in Elasticsearch.

Instead of communicating directly, both services are loosely coupled through Apache Kafka, allowing them to evolve independently.

---

## Architecture Principles

The system is designed based on the following principles:

- **Single Source of Truth**  
  PostgreSQL is the only source of truth for product and category data.

- **Event-Driven Architecture**  
  Database changes are propagated as events instead of direct service-to-service communication.

- **Loose Coupling**  
  The Product Service has no knowledge of the Search Service or Elasticsearch.

- **Eventually Consistent**  
  Elasticsearch is synchronized asynchronously through Kafka events.

---

## Components

### Product Service

Responsible for managing business data.

Responsibilities:

- Product CRUD
- Category CRUD
- Request validation
- Persist data into PostgreSQL

The Product Service only writes data into PostgreSQL and does not communicate directly with Elasticsearch.

---

### PostgreSQL

Acts as the system's source of truth.

Every INSERT, UPDATE, and DELETE operation is recorded in PostgreSQL's **Write-Ahead Log (WAL)**.

These database changes are later captured by Debezium.

---

### Debezium

Debezium monitors PostgreSQL WAL and converts database changes into Kafka events using Change Data Capture (CDC).

This allows downstream services to react to data changes without modifying the Product Service.

---

### Apache Kafka

Kafka acts as the event streaming platform between services.

Example topics:

- `product.public.products`
- `product.public.categories`

Kafka decouples producers and consumers, enabling asynchronous communication.

---

### Search Service

Consumes CDC events from Kafka and keeps Elasticsearch synchronized.

Responsibilities:

- Consume Kafka events
- Transform events into search documents
- Create product documents
- Update product documents
- Delete product documents
- Expose search APIs

The Search Service owns all Elasticsearch-related logic.

---

### Elasticsearch

Stores denormalized product documents optimized for searching.

Current search capabilities include:

- Full-text search
- Fuzzy search
- Filtering
- Sorting
- Highlighting
- Faceted search

---

## Event Processing

### Product Created

1. Product Service inserts data into PostgreSQL.
2. PostgreSQL records the change in WAL.
3. Debezium captures the INSERT event.
4. Kafka publishes the event.
5. Search Service consumes the event.
6. Elasticsearch indexes the new document.

### Product Updated

1. Product Service updates the product.
2. Debezium captures the UPDATE event.
3. Kafka publishes the event.
4. Search Service updates the Elasticsearch document.

### Product Deleted

1. Product Service deletes the product.
2. Debezium captures the DELETE event.
3. Kafka publishes the event.
4. Search Service removes the document from Elasticsearch.

---

## Why Change Data Capture?

Without CDC, the Product Service would need to update both PostgreSQL and Elasticsearch directly.

This introduces several challenges:

- Tight coupling between services
- More complex business logic
- Higher risk of inconsistent writes
- Harder to scale and maintain

With CDC, the Product Service only writes to PostgreSQL.

Debezium automatically captures database changes and publishes them to Kafka, allowing the Search Service to synchronize Elasticsearch asynchronously.

This architecture provides:

- Loose coupling
- Better scalability
- Better maintainability
- Reliable event-driven synchronization