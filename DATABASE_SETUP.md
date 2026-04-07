# EduERP Database Setup Guide

This file provides instructions and SQL scripts to manually set up and populate the MySQL database. You can share this with other developers who want to run the project.

## Setup Instructions

1. Ensure MySQL is running.
2. Connect to MySQL, and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS eduerp;
   USE eduerp;
   ```
3. Run the Spring Boot application once to automatically generate all the tables (via Hibernate/JPA auto-ddl).
4. Afterwards, you can use the SQL scripts below to pre-populate dummy data for Users, Students, Schedules, and Attendance.

---

## Dummy Data SQL Scripts

### 1. Users
Run this query to insert initial users:

```sql
INSERT INTO users (name, email, password, role, department, status) VALUES
('Dr. Sarah Mitchell', 'admin@edu.com', '$2a$10$7Z/lK9S0M5U4.Lq/lV9T8..m51G.8L6Z7Z/lK9S0M5U4.Lq/lV9T8', 'ADMIN', 'IT', 'ACTIVE'),
('Prof. James Carter', 'teacher@edu.com', '$2a$10$7Z/lK9S0M5U4.Lq/lV9T8..m51G.8L6Z7Z/lK9S0M5U4.Lq/lV9T8', 'TEACHER', 'Computer Science', 'ACTIVE'),
('Alex Johnson', 'student@edu.com', '$2a$10$7Z/lK9S0M5U4.Lq/lV9T8..m51G.8L6Z7Z/lK9S0M5U4.Lq/lV9T8', 'STUDENT', 'Grade 10-A', 'ACTIVE'),
('Linda Hayes', 'administrator@edu.com', '$2a$10$7Z/lK9S0M5U4.Lq/lV9T8..m51G.8L6Z7Z/lK9S0M5U4.Lq/lV9T8', 'ADMINISTRATOR', 'Operations', 'ACTIVE'),
('Dr. Robert Lee', 'r.lee@edu.com', '$2a$10$7Z/lK9S0M5U4.Lq/lV9T8..m51G.8L6Z7Z/lK9S0M5U4.Lq/lV9T8', 'TEACHER', 'Mathematics', 'ACTIVE');
```
*(Note: Replace passwords with dynamically encoded values or let the backend DataInitializer handle it)*

### 2. Students
Run this query to insert dummy students:

```sql
INSERT INTO students (name, email, grade_class, gpa, attendance, status) VALUES
('Alex Johnson', 'student@edu.com', 'Grade 10-A', 3.8, 95, 'ACTIVE'),
('John Smith', 'j.smith@edu.com', 'Grade 11-B', 3.5, 90, 'ACTIVE'),
('Emily Davis', 'e.davis@edu.com', 'Grade 12-A', 3.9, 98, 'ACTIVE'),
('Mark Wilson', 'm.wilson@edu.com', 'Grade 10-A', 2.5, 75, 'WARNING');
```

### 3. Schedules (Courses/Classes)
Run this query to populate the schedules table with courses:

```sql
INSERT INTO schedules (course_name, teacher_name, room_number, day_of_week, start_time, end_time, grade_class, semester) VALUES
('Computer Science 101', 'Prof. James Carter', 'Lab 1', 'Monday', '09:00', '10:30', 'Grade 10-A', 'Fall 2026'),
('Mathematics 201', 'Dr. Robert Lee', 'Room 205', 'Tuesday', '11:00', '12:30', 'Grade 11-B', 'Fall 2026'),
('Physics 301', 'Jane Doe', 'Lab 3', 'Wednesday', '13:00', '14:30', 'Grade 12-A', 'Fall 2026'),
('Computer Science 101', 'Prof. James Carter', 'Lab 1', 'Thursday', '09:00', '10:30', 'Grade 10-A', 'Fall 2026');
```

### 4. Attendance Records
Run this query to insert dummy attendance records:
*(Assumes Student IDs 1, 2, and User ID 2 & 5 exist based on previous queries)*

```sql
INSERT INTO attendance_records (student_id, course_name, date, status, marked_by) VALUES
(1, 'Computer Science 101', '2026-04-01', 'PRESENT', 2),
(1, 'Mathematics 201', '2026-04-02', 'ABSENT', 5),
(2, 'Mathematics 201', '2026-04-02', 'PRESENT', 5),
(3, 'Physics 301', '2026-04-03', 'PRESENT', 2),
(4, 'Computer Science 101', '2026-04-04', 'LATE', 2);
```

### 5. Grades
Run this query to insert dummy grades:

```sql
INSERT INTO grades (student_id, course_name, score, graded_by, details, date) VALUES
(1, 'Computer Science 101', 95.0, 2, 'Midterm Exam', '2026-03-15'),
(2, 'Mathematics 201', 88.5, 5, 'Midterm Exam', '2026-03-16'),
(3, 'Physics 301', 92.0, 2, 'Practical Assignment', '2026-03-20');
```
