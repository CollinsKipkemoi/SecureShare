# 🔐 SecureShare – A Secure File Sharing API

SecureShare is a Node.js + Express-based backend application that lets users upload files and generate secure download links with support for expiration and limited downloads. Authenticated users get access to additional features like upload history and file management.

---

## 📌 Features

### ✅ Core Features
- [x] File upload with metadata (max downloads, expiry time)
- [x] Unique download links for each file
- [x] Download links auto-expire (based on time or count)
- [x] RESTful API built with Express
- [x] File streaming for secure downloads
- [x] Rate limiting on download endpoint
- [x] Basic validation and error handling

### 🔐 Authentication (JWT-based)
- [x] User registration & login
- [x] Protected routes using JWT tokens
- [x] User-specific file history
- [x] Delete uploaded files manually

### 📈 Bonus Features (Optional)
- [ ] Download stats (IP, timestamp)
- [ ] Email link to recipient (via Nodemailer)
- [ ] Redis for efficient expiry tracking
- [ ] Frontend (React or plain HTML) for testing the API
- [ ] CLI tool to upload and get download link

---

## 🔄 User Flow

### Unauthenticated Users
1. Upload file anonymously via `/upload`
2. Receive download link with expiry or download limit
3. Share link → one-time or limited access enforced by backend

### Authenticated Users
1. Register and log in to get JWT token
2. Upload file with custom options
3. View list of uploads, manage them, delete early
4. Track stats (downloads, expiry status)

---

## 📁 API Endpoints

### 🔐 Auth
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and get JWT token

### 📤 File Upload & Management
- `POST /upload` – Upload a file (optional JWT)
  - `multipart/form-data` with:
    - `file`
    - `expiry` (e.g. "1h", "24h")
    - `maxDownloads` (e.g. 1, 3)
- `GET /download/:id` – Download file if link is valid
- `GET /files` – (Auth) List uploaded files
- `DELETE /files/:id` – (Auth) Delete uploaded file

---

## 🧱 Tech Stack

| Layer           | Tech                         |
|----------------|------------------------------|
| Language        | JavaScript (ES6+)            |
| Runtime         | Node.js                      |
| Framework       | Express.js                   |
| File Upload     | Multer                       |
| Auth            | JWT, bcrypt                  |
| DB              | PostgreSQL or MongoDB        |
| Optional Cache  | Redis (for link expiry)      |
| Email           | Nodemailer (optional)        |
| Logging         | Morgan                       |
| Env mgmt        | dotenv                       |
| Security        | Helmet, express-rate-limit   |

---

## 🗃️ Database Schema (Sample - PostgreSQL)

### users
| Field     | Type      |
|-----------|-----------|
| id        | UUID      |
| email     | TEXT      |
| password  | TEXT (hashed) |
| createdAt | TIMESTAMP |

### files
| Field           | Type      |
|------------------|-----------|
| id              | UUID      |
| userId (nullable)| UUID      |
| filename        | TEXT      |
| filepath        | TEXT      |
| expiryAt        | TIMESTAMP |
| maxDownloads    | INTEGER   |
| currentDownloads| INTEGER   |
| createdAt       | TIMESTAMP |

---

## ⚙️ Installation

```bash
git clone https://github.com/yourname/secureshare-api.git
cd secureshare-api
npm install
cp .env.example .env
# Set your DB connection string, JWT secret, etc. in .env
npm run dev
