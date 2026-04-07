# EduERP — Educational Enterprise Resource Planning System

A full-stack ERP system built for educational institutions with **React + Vite** frontend and **Spring Boot + MySQL** backend.

---

## 🏗️ Project Structure

```
eduerp/
├── erp-frontend/          ← React + Vite (JavaScript)
└── erp-backend/           ← Spring Boot 3 + MySQL
```

---

## 👤 Roles & Access

| Role            | Capabilities                                                    |
|-----------------|-----------------------------------------------------------------|
| **Admin**       | Full access: all modules, user management, system config        |
| **Teacher**     | Students, attendance marking, grades entry, schedule view       |
| **Student**     | Own grades, own attendance, timetable view                      |
| **Administrator** | Students, users, reports, schedule management               |

### Demo Login Credentials

| Role            | Email                     | Password   |
|-----------------|---------------------------|------------|
| Admin           | admin@edu.com             | admin123   |
| Teacher         | teacher@edu.com           | teach123   |
| Student         | student@edu.com           | stud123    |
| Administrator   | administrator@edu.com     | adm123     |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Java** 17+
- **Maven** 3.9+
- **MySQL** 8.x

---

### 1. Database Setup

```bash
# Log into MySQL
mysql -u root -p

# Run the schema + seed SQL
mysql -u root -p < erp-backend/src/main/resources/schema.sql
```

---

### 2. Backend (Spring Boot)

```bash
cd erp-backend

# Edit DB credentials
nano src/main/resources/application.properties
# Set: spring.datasource.password=YOUR_MYSQL_PASSWORD

# Run
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

---

### 3. Frontend (React + Vite)

```bash
cd erp-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 📡 REST API Endpoints

### Auth
| Method | Endpoint           | Description        | Access  |
|--------|--------------------|--------------------|---------|
| POST   | `/api/auth/login`  | Login, get JWT     | Public  |
| GET    | `/api/auth/me`     | Current user info  | Auth    |

### Students
| Method | Endpoint              | Description          | Access           |
|--------|-----------------------|----------------------|------------------|
| GET    | `/api/students`       | List all students    | Auth             |
| GET    | `/api/students/{id}`  | Get student          | Auth             |
| POST   | `/api/students`       | Create student       | Admin/Admin-inst |
| PUT    | `/api/students/{id}`  | Update student       | Admin/Admin-inst |
| DELETE | `/api/students/{id}`  | Delete student       | Admin only       |

### Grades
| Method | Endpoint                      | Description         | Access         |
|--------|-------------------------------|---------------------|----------------|
| GET    | `/api/grades`                 | All grades          | Auth           |
| GET    | `/api/grades/student/{id}`    | By student          | Auth           |
| POST   | `/api/grades`                 | Create/update grade | Admin/Teacher  |
| PUT    | `/api/grades/{id}`            | Update grade        | Admin/Teacher  |
| DELETE | `/api/grades/{id}`            | Delete grade        | Admin only     |

### Attendance
| Method | Endpoint                            | Description        | Access        |
|--------|-------------------------------------|--------------------|---------------|
| GET    | `/api/attendance/student/{id}`      | Student records    | Auth          |
| GET    | `/api/attendance?course=&date=`     | By course & date   | Auth          |
| GET    | `/api/attendance/student/{id}/summary` | Summary counts  | Auth          |
| POST   | `/api/attendance`                   | Mark attendance    | Admin/Teacher |
| POST   | `/api/attendance/bulk`              | Bulk mark          | Admin/Teacher |

### Schedules
| Method | Endpoint              | Description     | Access           |
|--------|-----------------------|-----------------|------------------|
| GET    | `/api/schedules`      | All schedules   | Auth             |
| POST   | `/api/schedules`      | Create          | Admin/Admin-inst |
| PUT    | `/api/schedules/{id}` | Update          | Admin/Admin-inst |
| DELETE | `/api/schedules/{id}` | Delete          | Admin only       |

### Users
| Method | Endpoint          | Description   | Access           |
|--------|-------------------|---------------|------------------|
| GET    | `/api/users`      | All users     | Admin/Admin-inst |
| POST   | `/api/users`      | Create user   | Admin only       |
| PUT    | `/api/users/{id}` | Update user   | Admin/Admin-inst |
| DELETE | `/api/users/{id}` | Delete user   | Admin only       |

---

## 🗄️ Database Schema

```
users               → id, name, email, password, role, department, status
students            → id, name, email, grade_class, gpa, attendance, status
grades              → id, student_id, subject, midterm, final, assignment, total, letter_grade
attendance_records  → id, student_id, course_name, date, status, marked_by
schedules           → id, course_name, teacher_name, room_number, day_of_week, start_time, end_time
```

---

## 📦 Frontend Modules

| Module          | Path           | Description                              |
|-----------------|----------------|------------------------------------------|
| Login           | `/`            | Role-based login with demo shortcuts     |
| Dashboard       | `/dashboard`   | Role-specific KPIs and stats             |
| Students        | `/students`    | CRUD student records                     |
| Attendance      | `/attendance`  | Mark/view daily attendance per class     |
| Grades          | `/grades`      | View/edit scores with auto letter grade  |
| Schedule        | `/schedule`    | Week view + list view timetable          |
| Users           | `/users`       | User management (Admin/Administrator)    |
| Reports         | `/reports`     | Generate institutional reports           |

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Plain CSS (no UI library — fully custom)
- Google Fonts: Playfair Display + DM Sans

### Backend
- Spring Boot 3.3
- Spring Security + JWT (jjwt 0.11)
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok
- Maven

---

## 🔧 Production Build

```bash
# Frontend build
cd erp-frontend
npm run build
# Output: erp-frontend/dist/

# Backend JAR
cd erp-backend
mvn clean package -DskipTests
java -jar target/edu-erp-backend-1.0.0.jar
```

---

## 📝 Notes

- JWT tokens expire after **24 hours** (configurable in `application.properties`)
- Passwords are hashed with **BCrypt**
- CORS is pre-configured for `http://localhost:5173`
- For production, update `app.cors.allowed-origins` and `app.jwt.secret`
