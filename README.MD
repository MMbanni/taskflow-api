# TaskFlow API

RESTful API for task management with authentication, authorization, refresh tokens, and password reset.

This project was built to demonstrate: JWT auth, refresh token rotation, secure cookies, role-based access, and clean controller/model separation.

---

## Features

* User registration & login
* JWT access tokens
* Refresh tokens (stored in DB, rotated on use)
* Secure HTTP-only cookies
* Password reset via email (with expiry)
* Role-based access control (admin routes)
* Task CRUD (Create, Read, Update, Delete)
* Per-user task ownership
* Priority incrementing
* Centralized async error handling

---

## Tech Stack

* **Node.js**
* **Express**
* **MongoDB** 
* **JWT** 
* **bcrypt** 
* **crypto** 

---

## Project Structure

```
src/
│
├── controllers/        # HTTP request handlers
├── models/             # Database logic
├── routes/             # Express routes
├── middleware/         # Auth & role checks
├── validators/         # Validate requests
├── services/           # Email services
├── utils/              # Centralized error handling
├── app.js              # Express app setup
└── server.js           # App entry point
```

---

## Authentication Flow

1. User logs in
2. Server issues:

   * Short-lived **access token** (JWT)
   * Long-lived **refresh token** (stored in DB + cookie)
3. Access token expires → client calls refresh endpoint
4. Refresh token is:

   * Validated
   * Deleted
   * Replaced with a new one (rotation)

This prevents token replay attacks.

---


## ▶️ Running the Project

```bash
npm install
npm run dev
```

The API will be available at:

```
http://localhost:3000
```

---

## API Overview

### Users

* `POST /users/register`
* `POST /users/login`

### Password Reset

* `POST /users/auth/reset`
* `POST /users/auth/reset/validate`
* `POST /users/auth/reset/password-reset`

### Refresh token
* `POST /users/auth/refresh`


### Tasks (Authenticated)

* `POST /tasks`
* `GET /tasks`
* `GET /tasks/:taskId`
* `PATCH /tasks/:taskId`
* `DELETE /tasks/:taskId`
* `PATCH /tasks/:taskId/priority/increment`
* `PATCH /tasks/:taskId/priority/decrement`

### Admin

* `GET /users`

---

## Security

* Passwords hashed with `bcrypt`
* JWT secrets stored in `env vars`
* Refresh tokens stored server-side
* `HTTP-only` cookies
* Role-based access checks
* Input validation

---

## Author

**Mohamed Banni**

Student of computing science at Griffith College Dublin

---

## 📄 License

MIT
