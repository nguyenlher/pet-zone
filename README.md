# Super Pet Mark 3D - E-commerce Platform

## Tổng Quan

Super Pet Mark 3D là một nền tảng thương mại điện tử hiện đại cho cửa hàng thú cưng, được xây dựng với kiến trúc microservices. Hệ thống bao gồm giao diện 3D tương tác cho khách hàng và bảng điều khiển quản trị toàn diện.

### Tính Năng Chính

- **Giao diện 3D tương tác** - Trải nghiệm mua sắm thú cưng với công nghệ Tripo API và Three.js
- **Quản lý người dùng** - Xác thực và phân quyền với Keycloak
- **Quản lý thú cưng** - CRUD đầy đủ cho sản phẩm thú cưng
- **Hệ thống đặt hàng** - Quản lý đơn hàng và giỏ hàng
- **Thanh toán** - Tích hợp xử lý thanh toán
- **Thông báo** - Gửi email và thông báo realtime
- **Thống kê** - Dashboard phân tích và báo cáo
- **Quản lý media** - Upload và quản lý hình ảnh và model với Cloudinary

## Kiến Trúc Hệ Thống

### Backend Services (Spring Boot + Java)

```
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

- **Frontend Client** - Giao diện khách hàng với Three.js 3D
- **Frontend Admin** - Bảng điều khiển quản trị với Recharts

### Infrastructure Services

- **Keycloak** (8088) - Identity & Access Management
- **Kafka UI** (8080) - Kafka monitoring
- **Zookeeper** (2181) - Kafka coordination

## Công Nghệ Sử Dụng

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

## Cấu Trúc Project

```
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

## Hướng Dẫn Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd pet-3d-store
```

### 2. Cấu Hình Environment Variables

File `.env` đã được cấu hình sẵn với các giá trị mặc định. Bạn có thể tùy chỉnh:

```env
# JWT Configuration
JWT_SECRET=bXlTdXBlclNlY3JldEtleUZvckpXVEF1dGhlbnRpY2F0aW9u
JWT_EXPIRATION=86400000

# API Key
API_KEY=HmYCvFBJKWzhJlVH498UjNAdCKC8vwhp

# Keycloak
KEYCLOAK_CLIENT_SECRET=FGMD5FRv6U68WA9yOYSAqaTTBquZHoGC

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

### 3. Khởi Tạo Database

Tạo thư mục `postgres-init` và thêm script khởi tạo database:

```bash
mkdir -p postgres-init
```

Tạo file `postgres-init/init.sql`:

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

## Chạy Project

### Option 1: Chạy Toàn Bộ Hệ Thống với Docker Compose (Khuyến Nghị)

#### Khởi động tất cả services:

```bash
docker-compose up -d
```


#### Dừng services:

```bash
docker-compose down
```

#### Dừng và xóa volumes (reset database):

```bash
docker-compose down -v
```

### Option 2: Chạy Backend Services Riêng Lẻ

#### Khởi động infrastructure services trước:

```bash
docker-compose up -d postgres redis kafka zookeeper keycloak
```

### Option 3: Chạy Frontend Local

#### Frontend Admin:

```bash
cd frontend-admin
npm install
npm run dev
```

Truy cập: http://localhost:5173

#### Frontend Client:

```bash
cd frontend-client
npm install
npm run dev
```

Truy cập: http://localhost:5174

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

Tất cả requests đi qua API Gateway tại `http://localhost:8090`

#### Public Endpoints (Không cần authentication)

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/pets
GET    /api/pets/{id}
```

#### Protected Endpoints (Cần JWT token)

```
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