# Architecture

## Overview

This project implements an event-driven architecture using Change Data Capture (CDC).

The Product Service is responsible for managing product data, while the Search Service is responsible for indexing and searching products.

The two services are loosely coupled through Apache Kafka.

---

## Components

### Product Service

Responsibilities:

- Product CRUD
- Category CRUD
- Persist data into PostgreSQL

Technologies:

- NestJS
- PostgreSQL
- Prisma

---

### PostgreSQL

Acts as the source of truth.

Every INSERT, UPDATE, and DELETE operation is recorded in the Write Ahead Log (WAL).

---

### Debezium

Debezium monitors PostgreSQL WAL and converts database changes into Kafka events.

The Product Service is completely unaware that Debezium exists.

---

### Kafka

Kafka transports events between services.

Example topic:

product.public.products

---

### Search Service

Consumes Kafka events.

Responsible for:

- Mapping events
- Indexing documents
- Deleting documents
- Updating documents

---

### Elasticsearch

Stores searchable product documents.

Optimized for:

- Full-text search
- Filtering
- Sorting
- Pagination

---

## Data Flow

User

↓

Next.js

↓

Product Service

↓

PostgreSQL

↓

Debezium

↓

Kafka

↓

Search Service

↓

Elasticsearch

↓

Search API

↓

Next.js

---

## Why CDC?

Without CDC:

Product Service

↓

PostgreSQL

↓

Directly update Elasticsearch

Problems:

- Tight coupling
- Harder to scale
- Risk of inconsistent writes

With CDC:

Product Service only writes to PostgreSQL.

Database changes are propagated asynchronously.

This results in better separation of concerns.