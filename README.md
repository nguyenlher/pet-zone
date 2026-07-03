# Pet Zone - 3D E-commerce Platform

## Overview

**Pet Zone** is a modern, high-performance e-commerce platform for pet stores, built using a microservices architecture. The system delivers an immersive shopping experience through an interactive 3D interface for customers, paired with a comprehensive administrative management dashboard.

### Key Features

- **Interactive 3D Experience** - Realistic 3D pet viewing and product exploration powered by Three.js and Tripo 3D models
- **Identity & Access Management** - Robust authentication, OAuth2/OIDC, and role-based access control with Keycloak
- **Pet & Product Management** - Full catalog management with atomic stock control and category filtering
- **Order Processing System** - Resilient distributed order processing, reservation compensation, and inventory safety
- **Integrated Payment** - Multi-provider payment gateway integration (VNPay)
- **Event-Driven Notifications** - Asynchronous email and transactional notifications via Apache Kafka
- **Analytics & Reporting** - Real-time sales statistics, revenue metrics, and order tracking
- **Cloud Media Storage** - High-speed media and 3D asset management with Cloudinary

---

## System Architecture

### Backend Microservices (Spring Boot + Java)

```text
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (8090)                      │
│                    Spring Cloud Gateway                      │
└─────────────────────────────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌────────▼────────┐   ┌────────▼────────┐   ┌────────▼────────┐
│  User Service   │   │   Pet Service   │   │  Order Service  │
│     (8081)      │   │     (8082)      │   │     (8084)      │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                     │                     │
┌────────▼────────┐   ┌────────▼────────┐   ┌────────▼────────┐
│ Payment Service │   │Notification Svc │   │ Statistics Svc  │
│     (8085)      │   │     (8086)      │   │     (8087)      │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌────────▼────────┐   ┌────────▼────────┐   ┌────────▼────────┐
│   PostgreSQL    │   │      Redis      │   │      Kafka      │
│     (5433)      │   │     (6379)      │   │     (9092)      │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Frontend Applications

- **Frontend Client (Next.js)** - Customer-facing web application built with Next.js 15 App Router, React 19, Tailwind CSS, and Three.js 3D viewer.
- **Frontend Admin** - Administrative management dashboard built with React, Vite, and Recharts.

### Infrastructure Services

- **Keycloak** (8088) - Identity & Access Management
- **Kafka UI** (8080) - Kafka cluster monitoring
- **Zookeeper** (2181) - Kafka coordination

---

## Technologies Used

### Backend
- **Framework**: Spring Boot 3.x / 4.x
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Distributed Cache & Locking**: Redis 7, Redisson
- **Message Broker**: Apache Kafka
- **API Gateway**: Spring Cloud Gateway
- **Security & IAM**: Keycloak, Spring Security, JWT
- **Build Tool**: Maven

### Frontend
- **Client App**: Next.js 15, React 19, TypeScript, Tailwind CSS, Three.js, Lucide React
- **Admin App**: React 19, Vite, Tailwind CSS, Recharts, Axios, React Router DOM

### DevOps & Cloud
- **Containerization**: Docker & Docker Compose
- **Media CDN**: Cloudinary
- **Continuous Integration**: GitHub Actions CI/CD

---

## Project Structure

```text
pet-zone/
├── api-gateway/              # Spring Cloud API Gateway (Port 8090)
├── user-service/             # User & profile management service (Port 8081)
├── pet-service/              # Pet catalog & stock management service (Port 8082)
├── order-service/            # Order creation & lifecycle service (Port 8084)
├── payment-service/          # VNPay & transaction payment service (Port 8085)
├── notification-service/     # Event-driven email notification service (Port 8086)
├── statistics-service/       # Business analytics & revenue metrics service (Port 8087)
├── frontend-client-nextjs/   # Modern Customer Frontend (Next.js 15 App Router)
├── frontend-admin/           # Administrative Dashboard (React + Vite)
├── postgres-init/            # PostgreSQL database initialization scripts
├── docker-compose.yml        # Docker orchestration compose file
└── .env                      # Environment variables configuration
```

---

## Setup Guide

### 1. Clone Repository

```bash
git clone <repository-url>
cd pet-zone
```

### 2. Configure Environment Variables

Create and configure the `.env` file from the example template:

```bash
cp .env.example .env
```

Example `.env` configuration:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000

# API Key for internal microservice calls
API_KEY=your_internal_api_key

# Keycloak
KEYCLOAK_CLIENT_SECRET=your_keycloak_client_secret

# Cloudinary (Optional - for media upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional - for notifications)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### 3. Initialize Database

Ensure `postgres-init/init.sql` exists to provision databases for each microservice:

```sql
-- Create databases for each service
CREATE DATABASE user_db;
CREATE DATABASE pet_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE notification_db;
CREATE DATABASE keycloak_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE user_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE pet_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE order_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO postgres;
```

---

## Running the Project

### Option 1: Run Entire System with Docker Compose (Recommended)

#### Start all services:
```bash
docker-compose up -d
```

#### Stop services:
```bash
docker-compose down
```

#### Reset databases (remove persistent volumes):
```bash
docker-compose down -v
```

### Option 2: Run Infrastructure First, Services Locally

Start infrastructure containers (Postgres, Redis, Kafka, Keycloak):
```bash
docker-compose up -d postgres redis kafka zookeeper keycloak
```

Run any backend microservice individually:
```bash
cd pet-service
mvn spring-boot:run
```

### Option 3: Run Frontend Applications Locally

#### Customer Frontend (Next.js):
```bash
cd frontend-client-nextjs
npm install
npm run dev
```
> Access application at: **http://localhost:3000**

#### Administrative Dashboard:
```bash
cd frontend-admin
npm install
npm run dev
```
> Access dashboard at: **http://localhost:5173**

---

## Endpoints & Ports

### Backend Services

| Service | Port | Local URL | Description |
|---------|------|-----------|-------------|
| **API Gateway** | 8090 | http://localhost:8090 | Central entry point & routing |
| **User Service** | 8081 | http://localhost:8081 | User profile and authentication |
| **Pet Service** | 8082 | http://localhost:8082 | Pet catalog & inventory management |
| **Order Service** | 8084 | http://localhost:8084 | Order processing & reservation |
| **Payment Service** | 8085 | http://localhost:8085 | VNPay integration & payment lifecycle |
| **Notification Service** | 8086 | http://localhost:8086 | Event-driven email notifications |
| **Statistics Service** | 8087 | http://localhost:8087 | Revenue & analytics dashboard data |

### Infrastructure

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| **Keycloak** | 8088 | http://localhost:8088 | `admin` / `admin` |
| **Kafka UI** | 8080 | http://localhost:8080 | - |
| **PostgreSQL** | 5433 | localhost:5433 | `postgres` / `postgres` |
| **Redis** | 6379 | localhost:6379 | - |

### Frontend Applications

| Application | Port | Local URL | Technology |
|-------------|------|-----------|------------|
| **Client App** | 3000 | http://localhost:3000 | Next.js 15, Three.js 3D |
| **Admin Dashboard** | 5173 | http://localhost:5173 | React, Vite, Recharts |

---

## API Gateway Routes Summary

All client requests route through the API Gateway at `http://localhost:8090`:

### Public Endpoints
```http
POST   /api/auth/login
POST   /api/auth/register
GET    /api/pets
GET    /api/pets/{id}
GET    /api/products
GET    /api/products/{id}
```

### Protected Endpoints (Requires Bearer JWT)
```http
# User Management
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/{id}

# Pet & Product Management
POST   /api/pets
PUT    /api/pets/{id}
DELETE /api/pets/{id}

# Order Management
GET    /api/orders
POST   /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}/cancel

# Payment
POST   /api/payments/create
GET    /api/payments/callback/vnpay

# Statistics (Admin Role Only)
GET    /api/statistics/dashboard
GET    /api/statistics/revenue
GET    /api/statistics/orders
```