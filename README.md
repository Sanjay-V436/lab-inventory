# 🔬 RHISC Lab — Inventory Management System

> A full-stack web application that digitalizes the lab component borrowing, approval, and return process for RHISC Lab, Amrita Vishwa Vidyapeetham, Chennai.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue?style=flat-square&logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI/CD-black?style=flat-square&logo=githubactions)

---

## 📌 Overview

Before this system, lab assistants manually tracked component borrowing using paper records — leading to errors, missing components, and no audit trail.

This system replaces that entirely with a digital workflow:

```
Student submits request → Lab assistant reviews → 
Components issued → Student returns → History recorded
```

---

## ✨ Features

### Student Portal
- Dynamic expandable component tree (parent → child categories)
- Cart-style component selection with quantity controls
- Mandatory letter proof file upload (PDF/Image)
- Form validation with Amrita email enforcement
- Instant reference ID on successful submission

### Lab Assistant Dashboard
- View all requests with search, filter, sort, and pagination
- Per-component approve or decline with custom quantity
- Automatic stock deduction on approval
- Process returns with returned / damaged condition per component
- Automatic stock restoration for returned components
- Damage remarks tracking per component
- Complete audit history of every request
- Component inventory CRUD with stock management
- Overdue badge for requests past return date

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Tailwind CSS, React Router DOM |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 16 |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx |
| CI/CD | GitHub Actions |
| Version Control | Git, GitHub |
| API Testing | Postman |

---

## 🗄️ Database Schema

```
components          → parent-child tree structure
requests            → student request details
request_items       → components inside each request
returns             → return records
return_items        → per-component condition and remarks
admin_users         → lab assistant accounts
```

---

## 📁 Project Structure

```
lab-inventory/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios instance
│   │   ├── components/         # Reusable components
│   │   │   ├── AmritaLogo.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── ComponentTree.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/
│   │   │   ├── StudentForm.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SubmitSuccess.jsx
│   │   │   └── dashboard/
│   │   │       ├── Requests.jsx
│   │   │       ├── RequestDetail.jsx
│   │   │       ├── Returns.jsx
│   │   │       ├── ReturnDetail.jsx
│   │   │       ├── History.jsx
│   │   │       ├── HistoryDetail.jsx
│   │   │       └── ComponentDB.jsx
│   │   └── utils/
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                     # Express backend
│   ├── config/                 # Database connection
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth + file upload
│   ├── routes/                 # API routes
│   ├── jobs/                   # Cron jobs
│   ├── db/                     # Schema + migrations
│   └── uploads/                # Uploaded files
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)
- [PostgreSQL 16](https://www.postgresql.org/download/)

---

### Option 1 — Run with Docker (Recommended)

**1. Clone the repository**
```bash
git clone https://github.com/your-username/lab-inventory.git
cd lab-inventory
```

**2. Create environment file**
```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in your own values.
Refer to `server/.env.example` for all required variables.

**3. Start everything**
```bash
docker-compose up --build
```

**4. Open in browser**
```
Student Form:   http://localhost
Dashboard:      http://localhost/login
```

**5. Create admin account**

Hit the register endpoint once to create your lab assistant account:
```
POST http://localhost:5000/api/auth/register
Body: { "username": "your_username", "password": "your_password" }
```
After creating the account, disable the register route in
`server/routes/auth.js` to prevent unauthorized account creation.

---

### Option 2 — Run Locally (Development)

**1. Clone the repository**
```bash
git clone https://github.com/your-username/lab-inventory.git
cd lab-inventory
```

**2. Set up the database**

- Open pgAdmin
- Create a database named `lab_inventory`
- Run `server/db/schema.sql` in the query tool

**3. Configure environment**
```bash
cp server/.env.example server/.env
```
Fill in your PostgreSQL credentials and other values.

**4. Start the backend**
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

**5. Start the frontend**
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🔐 Environment Variables

Create `server/.env` based on `server/.env.example`:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=
```

> ⚠️ Never commit your `.env` file. It is already added to `.gitignore`.

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/login
POST   /api/auth/register      (disable after first use)
```

### Components
```
GET    /api/components
POST   /api/components
PUT    /api/components/:id
DELETE /api/components/:id
```

### Requests
```
POST   /api/requests              (public — student form)
GET    /api/requests              (protected)
GET    /api/requests/:id          (protected)
PATCH  /api/requests/:id/accept   (protected)
PATCH  /api/requests/:id/decline  (protected)
```

### Returns
```
GET    /api/returns
GET    /api/returns/:requestId
POST   /api/returns/:requestId
```

### History
```
GET    /api/history
GET    /api/history/:id
```

---

## 🐳 Docker Services

| Service | Container | Port |
|---|---|---|
| React + Nginx | lab_client | 80 |
| Express API | lab_server | 5000 |
| PostgreSQL | lab_db | 5432 |

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# View logs
docker-compose logs server
docker-compose logs db
```

---

## 🔄 CI/CD Pipeline

GitHub Actions automatically runs on every push to `main`:

```
Push to main
     ↓
Run CI checks
     ↓
Build Docker images
     ↓
Deploy to server
```

Secrets are stored in GitHub Repository Secrets — never in code.
Go to `Settings → Secrets and variables → Actions` to configure.

Workflow file: `.github/workflows/ci.yml`

---

## 🌿 Git Branching Strategy

```
main     → production (protected, no direct pushes)
dev      → active development
feature/ → individual features (merge into dev)
```

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Push and create pull request
git push origin feature/your-feature-name
```

---

## 🗺️ Roadmap

- [x] Student request form
- [x] Lab assistant dashboard
- [x] Component approval workflow
- [x] Return processing with damage tracking
- [x] History and audit trail
- [x] Component inventory management
- [x] Docker containerization
- [x] GitHub Actions CI/CD
- [x] Email reminders for overdue returns
- [x] Purchase DB tracking


---
