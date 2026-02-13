# TaskFlow API

A RESTful task management backend built with Node.js, Express, TypeScript, and MongoDB.

The project demonstrates authentication, refresh token rotation, role-based authorization, and a modular layered architecture designed for maintainability and scalability.

---

##  Features

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

##  Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Docker

---

## 📁 Architecture

The project follows a layered modular structure:

- **Routes** – API endpoint definitions  
- **Controllers** – Request handling logic  
- **Services** – Business logic  
- **Repositories** – Database interaction  
- **Middleware** – Authentication, validation, DB checks  
- **Core Utilities** – Error handling, helpers  

This separation improves maintainability, testability, and scalability.

---

## 🚀 Running Without Docker

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

## 🐳 Running With Docker

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

## 🔐 Environment Variables

Required variables:

```
MONGO_URI=
JWT_SECRET=
MAIL_USER=
MAIL_APP_PASS=
PORT=3000
```

The application will fail fast if required environment variables are missing.

---

## 🎯 Purpose

This project was built to demonstrate backend engineering fundamentals including:

- Secure authentication flows
- Token lifecycle management
- Environment-based configuration
- Containerized development
- Clean architectural separation
