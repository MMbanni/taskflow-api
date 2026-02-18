# TaskFlow API

A RESTful task management backend built with Node.js, Express, TypeScript, and MongoDB.

The project focuses on implementing a production-style authentication system
with refresh token rotation and clear architectural boundaries.

---

## Quick Start (Docker – Recommended)

```bash
git clone <repo-url>
cd taskflow
cp .env.example .env
docker compose up --build
```
The API container and MongoDB container will start automatically.

API runs at: http://localhost:3000

---

## Quick Start (Without Docker)
Requires MongoDB running locally on port 27017.

```bash
git clone <repo-url>
cd taskflow
cp .env.example .env
npm install
npm run dev
```

API runs at: http://localhost:3000


---


## Features

- User registration and login
- JWT authentication (access + refresh tokens)
- Secure refresh token rotation
- Password reset flow via email
- Role-based authorization
- Task CRUD operations
- Structured error handling
- Dockerized development environment
- MongoDB persistence with volumes

---

## Tech Stack

- Node.js
- Express
- TypeScript (strict mode)
- MongoDB (Mongoose)
- Docker

---

## Architecture

The project follows a layered modular structure:

- **Routes** – API endpoint definitions  
- **Controllers** – Request handling logic  
- **Services** – Business logic  
- **Repositories** – Database interaction  
- **Middleware** – Authentication, validation, DB checks  
- **Core Utilities** – Error handling, helpers  

This separation improves maintainability, testability, and scalability.

---

## Authentication Design

- Short-lived JWT access tokens
- Long-lived refresh tokens stored in database
- Refresh token rotation on every use
- HTTP-only secure cookies for refresh tokens
- Automatic session revocation on password reset
- TTL index for automatic expired token cleanup

---

## Environment Variables

Required variables:

```
MONGO_URI=
JWT_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_EXPIRY=
MAIL_USER=
MAIL_APP_PASS=
PORT=3000
```

The application validates required environment variables at startup and exits immediately if any are missing.

---

## Admin Bootstrap

The application does **not** create a default admin automatically.

An admin user must be created during initial setup.

Add the following variables to your `.env` file:

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password


### Local Development

1. Run:

```bash
npm run seed:dev
```


### Using Docker

1. Run the seed command inside the container:

```bash
docker compose exec taskflow-api npm run seed:prod
```

---

## API Overview

### Auth
- POST /auth/login – Authenticate user and issue access + refresh tokens
- POST /auth/refresh – Rotate refresh token and issue new access token
- POST /auth/reset – Send password reset code via email
- POST /auth/reset/validate – Validate password reset code
- POST /auth/reset/password-reset – Reset password

### Users
- POST /users/register – Register a new user
- GET /users – Get users (admin only)

### Tasks
All task routes require authentication.

- POST /tasks – Create a task
- GET /tasks – Get tasks (supports query filters)
- GET /tasks/:taskId – Get a specific task
- PATCH /tasks/:taskId – Update a task
- DELETE /tasks/:taskId – Delete a task

---

## Purpose

This project was built to demonstrate backend engineering fundamentals including:

- Secure authentication flows
- Token lifecycle management
- Environment-based configuration
- Containerized development
- Clean architectural separation
