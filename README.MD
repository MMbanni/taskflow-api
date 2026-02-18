# TaskFlow API

A RESTful task management backend built with Node.js, Express, TypeScript, and MongoDB.

The project focuses on implementing a production-style authentication system
with refresh token rotation and clear architectural boundaries.

---

## Project Evolution

This project was originally implemented in JavaScript and later refactored into strict TypeScript to improve type safety, architectural clarity, and long-term maintainability.

The refactor introduced explicit domain models, stronger separation of concerns (controller → service → repository), and improved validation and error handling boundaries.

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

## Security Considerations

- Refresh tokens stored server-side
- Token rotation prevents replay attacks
- Password reset uses expiration window and atomic validation
- Role-based access enforced at controller layer
- Environment variables validated at startup

---

## Running Without Docker

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`

3. Start the server:

```bash
npm run dev
```

---

## Running With Docker

```bash
docker-compose up --build
```

The API will be available at:

```
http://localhost:3000
```

Docker runs:
- A Node.js API container
- A MongoDB container
- A persistent MongoDB volume

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

The application will fail fast if required environment variables are missing.

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
