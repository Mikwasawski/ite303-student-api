# Student Information API

A RESTful API built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL (Supabase)** for managing student records. Developed for **ITE 303**.

---

## 📋 API Endpoints

| Method | Endpoint | Description | Request Body | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check & course information | None | `200 OK` |
| `GET` | `/students` | Retrieve all student records | None | `200 OK` |
| `GET` | `/students/:id` | Retrieve a specific student by ID | None | `200 OK` |
| `POST` | `/students` | Add a new student record | JSON | `201 Created` |
| `PUT` | `/students/:id` | Update an existing student record | JSON | `200 OK` |
| `DELETE` | `/students/:id` | Delete a student record by ID | None | `200 OK` |

---

## 📦 Request Body Payloads

### 1. Create Student (`POST /students`)
```json
{
  "student_number": "2024-0004",
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "course": "BSIT",
  "year_level": 3
}
```

### 2. Update Student (`PUT /students/:id`)
```json
{
  "student_number": "2024-0004",
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "course": "BSIT",
  "year_level": 4
}
```

---

## 🗄️ Database Schema

The API connects to a PostgreSQL database with the following table structure:

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  year_level INTEGER NOT NULL CHECK (year_level BETWEEN 1 AND 4)
);
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root based on the template below:

```env
PORT=4000
DATABASE_URL=your_supabase_postgres_connection_string
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build TypeScript Code
```bash
pnpm build
```

### 3. Run Server
```bash
pnpm start
```