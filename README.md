# Smart Parking Reservation System

A backend API server for managing parking lot reservations built with NestJS, PostgreSQL, and Sequelize.

## 🚀 Features

- **List Parking Lots & Spots**: Browse available parking lots and spots with support for different spot types (compact, regular, EV)
- **Spot Availability Queries**: Check spot availability for specific time windows
- **Reservation Management**: Create, cancel, and view reservations with conflict prevention
- **User Management**: Create users and view their upcoming reservations
- **Double-booking Prevention**: Robust conflict detection using database transactions

## 🛠️ Tech Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Sequelize with Sequelize CLI
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   git clone <your-repo-url>
   cd parkinglot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Run database migrations and seeders** (Required for fresh setup):
   ```bash
   # Wait for containers to be ready, then run:
   docker-compose exec app npm run db:migrate
   docker-compose exec app npm run db:seed
   ```

This will start:
- PostgreSQL database on port 5432
- NestJS API server on port 3000
- Database with sample parking lots, spots, and test data

### Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create and migrate database**:
   ```bash
   npm run db:create
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development server**:
   ```bash
   npm run start:dev
   ```


### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │ ParkingLots │       │    Spots    │       │Reservations │
├─────────────┤       ├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (UUID)   │       │ id (UUID)   │       │ id (UUID)   │       │ id (UUID)   │
│ email       │       │ name        │       │ spotNumber  │       │ startTime   │
│ firstName   │       │ address     │       │ type        │       │ endTime     │
│ lastName    │       │ openTime    │       │ isActive    │       │ status      │
│ phone       │       │ closeTime   │       │ lotId (FK)  │       │ userId (FK) │
│ createdAt   │       │ createdAt   │       │ createdAt   │       │ spotId (FK) │
│ updatedAt   │       │ updatedAt   │       │ updatedAt   │       │ createdAt   │
└─────────────┘       └─────────────┘       └─────────────┘       └─────────────┘
```

### Table Relationships

- **Users** → **Reservations** (1:N)
- **ParkingLots** → **Spots** (1:N)
- **Spots** → **Reservations** (1:N)

### Key Constraints

- Users have unique email addresses
- Spots have unique (parkingLotId, spotNumber) combinations
- Reservations prevent double-booking through database-level conflict detection
- All primary keys use UUIDs for better scalability

## 🛣️ API Endpoints

### Parking Lots

- `GET /parking-lots` - List all parking lots with pagination
- `GET /parking-lots/:id` - Get specific parking lot details
- `GET /parking-lots/:id/spots` - Get spots in a parking lot

### Spots

- `GET /spots/availability` - Check spot availability for time window
  - Query params: `startTime`, `endTime`, `lotId` (optional)

### Reservations

- `POST /reservations` - Create a new reservation
- `DELETE /reservations/:id` - Cancel a reservation
- `GET /reservations/user/:userId/upcoming` - Get user's upcoming reservations

### Users

- `POST /users` - Create a new user
- `GET /users/:id` - Get user details
- `GET /users/:id/reservations` - Get user's upcoming reservations (with pagination)

## 📝 API Usage Examples

### Create a User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### Check Spot Availability
```bash
curl "http://localhost:3000/spots/availability?startTime=2025-08-07T10:00:00.000Z&endTime=2025-08-07T12:00:00.000Z&lotId=your-lot-id"
```

### Create a Reservation
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "spotId": "spot-uuid", 
    "startTime": "2025-08-07T10:00:00.000Z",
    "endTime": "2025-08-07T12:00:00.000Z"
  }'
```

### Get Upcoming Reservations
```bash
curl "http://localhost:3000/reservations/user/user-uuid/upcoming"
```

## 📁 Project Structure

```
src/
├── common/
│   ├── dto/              # Data Transfer Objects
│   └── enums/            # Enums (SpotType, ReservationStatus)
├── database/
│   ├── config/           # Sequelize configuration
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
├── modules/
│   ├── parking-lots/     # Parking lot management
│   ├── spots/            # Spot availability and management
│   ├── reservations/     # Reservation system with conflict prevention
│   └── users/            # User management
├── app.module.ts         # Main application module
└── main.ts              # Application entry point
```


## 🔄 Conflict Prevention

Reservations use database-level transaction locks to prevent race conditions:

1. **Transaction Isolation**: Each reservation creation runs in a transaction
2. **Row-level Locking**: `SELECT ... FOR UPDATE` prevents concurrent modifications
3. **Comprehensive Overlap Detection**: Checks all possible time conflicts`
4. **Atomic Operations**: Either the entire reservation succeeds or fails

## 📈 Performance Considerations

- **Database Indexing**: Strategic indexes on frequently queried columns
- **Pagination**: All list endpoints support pagination
- **Query Optimization**: Efficient joins and selective field loading

