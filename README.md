# Super Pet Mark 3D - E-commerce Platform

## Overview

Super Pet Mark 3D is a modern e-commerce platform for pet stores, built using a microservices architecture. The system includes an interactive 3D interface for customers and a comprehensive admin dashboard.

### Key Features

- **Interactive 3D Interface** - Pet shopping experience with Tripo API and Three.js technology
- **User Management** - Authentication and authorization with Keycloak
- **Pet Management** - Full CRUD for pet products
- **Order System** - Order and shopping cart management
- **Payment** - Integrated payment processing
- **Notifications** - Realtime notifications and email delivery
- **Statistics** - Analytics and reporting dashboard
- **Media Management** - Upload and manage images and 3D models with Cloudinary

## System Architecture

### Backend Services (Spring Boot + Java)

```text
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (8090)                      │
│                    Spring Cloud Gateway                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│  User Service  │   │  Pet Service   │   │ Order Service  │
│     (8081)     │   │     (8082)     │   │     (8084)     │
└────────────────┘   └────────────────┘   └────────────────┘
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│Payment Service │   │Notification Svc│   │Statistics Svc  │
│     (8085)     │   │     (8086)     │   │     (8087)     │
└────────────────┘   └────────────────┘   └────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│   PostgreSQL   │   │     Redis      │   │     Kafka      │
│     (5433)     │   │     (6379)     │   │     (9092)     │
└────────────────┘   └────────────────┘   └────────────────┘
```

### Frontend Applications (React + Vite)

- **Frontend Client** - Customer interface with Three.js 3D
- **Frontend Admin** - Admin dashboard with Recharts

### Infrastructure Services

- **Keycloak** (8088) - Identity & Access Management
- **Kafka UI** (8080) - Kafka monitoring
- **Zookeeper** (2181) - Kafka coordination

## Technologies Used

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Message Queue**: Apache Kafka
- **API Gateway**: Spring Cloud Gateway
- **Authentication**: Keycloak
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8
- **3D Graphics**: Three.js, React Three Fiber
- **UI Components**: Tailwind CSS, Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### DevOps
- **Containerization**: Docker & Docker Compose
- **Cloud Storage**: Cloudinary

## Project Structure

```text
pet-3d-store/
├── api-gateway/              # API Gateway service
├── user-service/             # User management service
├── pet-service/              # Pet product service
├── order-service/            # Order management service
├── payment-service/          # Payment processing service
├── notification-service/     # Email & notification service
├── statistics-service/       # Analytics & reporting service
├── frontend-admin/           # Admin dashboard (React)
├── frontend-client/          # Customer frontend (React + Three.js)
├── postgres-init/            # Database initialization scripts
├── docker-compose.yml        # Docker orchestration
└── .env                      # Environment variables
```

## Setup Guide

### 1. Clone Repository

```bash
git clone <repository-url>
cd pet-3d-store
```

### 2. Configure Environment Variables

The `.env` file requires some configuration. You can copy the template provided:

```bash
cp .env.example .env
```

Here is an example `.env`:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000

# API Key
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

Create a `postgres-init` directory and add the database initialization script:

```bash
mkdir -p postgres-init
```

Create the `postgres-init/init.sql` file:

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

#### Stop and remove volumes (reset database):

```bash
docker-compose down -v
```

### Option 2: Run Backend Services Individually

#### Start infrastructure services first:

```bash
docker-compose up -d postgres redis kafka zookeeper keycloak
```

### Option 3: Run Frontend Locally

#### Frontend Admin:

```bash
cd frontend-admin
npm install
npm run dev
```

Access: http://localhost:5173

#### Frontend Client:

```bash
cd frontend-client
npm install
npm run dev
```

Access: http://localhost:5174

## Endpoints & Ports

### Backend Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| API Gateway | 8090 | http://localhost:8090 | Main entry point |
| User Service | 8081 | http://localhost:8081 | User management |
| Pet Service | 8082 | http://localhost:8082 | Pet products |
| Order Service | 8084 | http://localhost:8084 | Orders |
| Payment Service | 8085 | http://localhost:8085 | Payments |
| Notification Service | 8086 | http://localhost:8086 | Notifications |
| Statistics Service | 8087 | http://localhost:8087 | Analytics |

### Infrastructure

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| Keycloak | 8088 | http://localhost:8088 | admin / admin |
| Kafka UI | 8080 | http://localhost:8080 | - |
| PostgreSQL | 5433 | localhost:5433 | postgres / postgres |
| Redis | 6379 | localhost:6379 | - |

### Frontend

| Application | Port | URL |
|-------------|------|-----|
| Admin Dashboard | 5173 | http://localhost:5173 |
| Client App | 5174 | http://localhost:5174 |

## API Documentation

### API Gateway Routes

All requests go through the API Gateway at `http://localhost:8090`

#### Public Endpoints (No authentication required)

```http
POST   /api/auth/login
POST   /api/auth/register
GET    /api/pets
GET    /api/pets/{id}
```

#### Protected Endpoints (JWT token required)

```http
# User Management
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/{id}

# Pet Management
POST   /api/pets
PUT    /api/pets/{id}
DELETE /api/pets/{id}

# Order Management
GET    /api/orders
POST   /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}/status

# Payment
POST   /api/payments
GET    /api/payments/{id}

# Statistics (Admin only)
GET    /api/statistics/dashboard
GET    /api/statistics/revenue
GET    /api/statistics/orders
```