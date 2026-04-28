-- ============================================================
--  EduERP Database Schema
--  Database: MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS eduerp_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eduerp_db;

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120)  NOT NULL,
    email       VARCHAR(180)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('ADMIN','TEACHER','STUDENT','ADMINISTRATOR') NOT NULL,
    department  VARCHAR(100),
    status      ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- STUDENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(120) NOT NULL,
    email        VARCHAR(180) NOT NULL UNIQUE,
    grade_class  VARCHAR(20)  NOT NULL,
    gpa          DECIMAL(3,1),
    attendance   INT,
    status       ENUM('ACTIVE','WARNING','INACTIVE') NOT NULL DEFAULT 'ACTIVE'
);

-- ─────────────────────────────────────────────
-- GRADES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grades (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id       BIGINT NOT NULL,
    subject          VARCHAR(100) NOT NULL,
    midterm_score    INT,
    final_score      INT,
    assignment_score INT,
    total_score      INT,
    letter_grade     VARCHAR(3),
    graded_by        BIGINT,
    UNIQUE KEY uq_student_subject (student_id, subject),
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_grade_user    FOREIGN KEY (graded_by)  REFERENCES users(id)    ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- ATTENDANCE RECORDS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance_records (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id   BIGINT  NOT NULL,
    course_name  VARCHAR(100) NOT NULL,
    date         DATE    NOT NULL,
    status       ENUM('PRESENT','ABSENT','LATE') NOT NULL,
    marked_by    BIGINT,
    UNIQUE KEY uq_attendance (student_id, course_name, date),
    CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_att_user    FOREIGN KEY (marked_by)  REFERENCES users(id)    ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- SCHEDULES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schedules (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name  VARCHAR(100) NOT NULL,
    teacher_name VARCHAR(120),
    room_number  VARCHAR(30),
    day_of_week  VARCHAR(10)  NOT NULL,
    start_time   VARCHAR(10)  NOT NULL,
    end_time     VARCHAR(10)  NOT NULL,
    grade_class  VARCHAR(20),
    semester     VARCHAR(40)
);

-- ============================================================
--  SEED DATA
-- ============================================================

-- Admin password: admin123  (BCrypt)
-- Teacher password: teach123
-- Student password: stud123
-- Administrator password: adm123
INSERT INTO users (name, email, password, role, department, status) VALUES
('Dr. Sarah Mitchell',  'admin@edu.com',           '$2a$10$N.5Y5HfZ7v3Y.OWq1QrW6.1g5u4Gu7V8xZrB2YQmJ0Ey9pC1HsN2', 'ADMIN',         'IT',               'ACTIVE'),
('Prof. James Carter',  'teacher@edu.com',          '$2a$10$EXt6jL3bT1M9uW0OqYJxTeB5hHj2hB2.2kY9QYKGTbDKpGRalEwf2', 'TEACHER',       'Computer Science', 'ACTIVE'),
('Alex Johnson',        'student@edu.com',          '$2a$10$ZoT/4.j4P1lN8Bkm1H1S7uEPN4oKR5Iij.I0q1dHjN43IwSB2VhfS', 'STUDENT',       'Grade 10-A',       'ACTIVE'),
('Linda Hayes',         'administrator@edu.com',    '$2a$10$e.lHjW7LKZ2Nw8yZ6T4n3eW2b9nSmB1dEKRfT0FpqoRqZ6JW4VuMe', 'ADMINISTRATOR', 'Operations',       'ACTIVE'),
('Dr. Robert Lee',      'r.lee@edu.com',            '$2a$10$EXt6jL3bT1M9uW0OqYJxTeB5hHj2hB2.2kY9QYKGTbDKpGRalEwf2', 'TEACHER',       'Mathematics',      'ACTIVE'),
('Prof. Anita Singh',   'a.singh@edu.com',          '$2a$10$EXt6jL3bT1M9uW0OqYJxTeB5hHj2hB2.2kY9QYKGTbDKpGRalEwf2', 'TEACHER',       'Physics',          'INACTIVE'),
('Mark Thompson',       'm.thompson@edu.com',       '$2a$10$e.lHjW7LKZ2Nw8yZ6T4n3eW2b9nSmB1dEKRfT0FpqoRqZ6JW4VuMe', 'ADMINISTRATOR', 'Finance',          'ACTIVE');

INSERT INTO students (name, email, grade_class, gpa, attendance, status) VALUES
('Maria Garcia',  'm.garcia@student.edu',  '10-A', 3.8, 96, 'ACTIVE'),
('James Wilson',  'j.wilson@student.edu',  '10-B', 3.2, 89, 'ACTIVE'),
('Priya Sharma',  'p.sharma@student.edu',  '11-A', 3.9, 98, 'ACTIVE'),
('Carlos Mendez', 'c.mendez@student.edu',  '10-A', 2.9, 78, 'WARNING'),
('Aisha Rahman',  'a.rahman@student.edu',  '11-B', 3.6, 93, 'ACTIVE'),
('Tom Bradley',   't.bradley@student.edu', '12-A', 3.4, 91, 'ACTIVE'),
('Yuki Tanaka',   'y.tanaka@student.edu',  '12-B', 3.7, 95, 'ACTIVE'),
('Sophie Martin', 's.martin@student.edu',  '10-B', 2.5, 72, 'WARNING'),
('Liam Chen',     'l.chen@student.edu',    '11-A', 3.5, 90, 'ACTIVE'),
('Emma Davis',    'e.davis@student.edu',   '11-B', 3.9, 97, 'ACTIVE'),
('David Kim',     'd.kim@student.edu',     '10-A', 3.6, 92, 'ACTIVE'),
('Isabella Ross', 'i.ross@student.edu',    '12-A', 3.8, 99, 'ACTIVE'),
('Noah O\'Connor','n.oconnor@student.edu',  '10-B', 3.1, 85, 'ACTIVE'),
('Mia Wong',      'm.wong@student.edu',    '11-A', 4.0, 100, 'ACTIVE'),
('Elijah Patel',  'e.patel@student.edu',   '12-B', 2.8, 75, 'WARNING');

INSERT INTO grades (student_id, subject, midterm_score, final_score, assignment_score, total_score, letter_grade) VALUES
(1, 'Computer Science', 88, 91, 95, 91, 'A'),
(1, 'Mathematics',      80, 82, 85, 82, 'B'),
(2, 'Computer Science', 74, 78, 80, 77, 'B'),
(3, 'Computer Science', 95, 97, 98, 97, 'A+'),
(4, 'Computer Science', 60, 65, 70, 64, 'C'),
(5, 'Computer Science', 82, 86, 88, 85, 'B+'),
(6, 'Mathematics',      77, 80, 82, 79, 'B'),
(7, 'Mathematics',      90, 93, 92, 92, 'A'),
(8, 'Mathematics',      55, 60, 65, 59, 'D'),
(9, 'Physics',          84, 87, 90, 87, 'B+'),
(10,'Physics',          92, 95, 94, 94, 'A'),
(11,'Computer Science', 85, 88, 90, 87, 'B+'),
(12,'Physics',          95, 98, 96, 97, 'A+'),
(13,'Mathematics',      65, 70, 75, 69, 'C+'),
(14,'Computer Science', 98, 100, 99, 99, 'A+'),
(15,'Physics',          70, 65, 72, 68, 'C');

INSERT INTO schedules (course_name, teacher_name, room_number, day_of_week, start_time, end_time, grade_class, semester) VALUES
('Computer Science 101', 'Prof. James Carter', 'Lab A-201',  'Monday',    '08:00', '10:00', '10-A', 'Spring 2025'),
('Mathematics Advanced', 'Dr. Robert Lee',      'Room B-104', 'Monday',    '11:00', '12:00', '11-B', 'Spring 2025'),
('Physics II',           'Prof. Anita Singh',   'Room C-201', 'Monday',    '13:00', '15:00', '11-A', 'Spring 2025'),
('English Literature',   'Dr. Sarah Mitchell',  'Room D-301', 'Monday',    '15:00', '16:00', '10-B', 'Spring 2025'),
('Web Development',      'Prof. James Carter',  'Lab A-203',  'Tuesday',   '09:00', '11:00', '10-B', 'Spring 2025'),
('Database Systems',     'Dr. Robert Lee',      'Lab B-101',  'Tuesday',   '14:00', '16:00', '12-A', 'Spring 2025'),
('Chemistry 101',        'Dr. Robert Lee',      'Lab C-102',  'Tuesday',   '11:00', '13:00', '11-A', 'Spring 2025'),
('Mathematics Advanced', 'Dr. Robert Lee',      'Room B-104', 'Wednesday', '08:00', '10:00', '11-B', 'Spring 2025'),
('Algorithm Design',     'Prof. James Carter',  'Lab A-202',  'Wednesday', '15:00', '17:00', '12-B', 'Spring 2025'),
('Physics Lab',          'Prof. Anita Singh',   'Lab C-202',  'Wednesday', '12:00', '14:00', '11-B', 'Spring 2025'),
('English Literature',   'Dr. Sarah Mitchell',  'Room D-301', 'Thursday',  '11:00', '13:00', '10-A', 'Spring 2025'),
('Web Development',      'Prof. James Carter',  'Lab A-203',  'Thursday',  '09:00', '11:00', '12-A', 'Spring 2025'),
('Computer Science 101', 'Prof. James Carter',  'Lab A-201',  'Friday',    '08:00', '09:00', '10-A', 'Spring 2025'),
('Algorithm Design',     'Prof. James Carter',  'Lab A-202',  'Friday',    '10:00', '12:00', '12-B', 'Spring 2025'),
('Database Systems',     'Dr. Robert Lee',      'Lab B-101',  'Friday',    '13:00', '15:00', '11-A', 'Spring 2025');

INSERT INTO attendance_records (student_id, course_name, date, status) VALUES
(1, 'Computer Science 101', CURDATE() - INTERVAL 1 DAY, 'PRESENT'),
(2, 'Computer Science 101', CURDATE() - INTERVAL 1 DAY, 'ABSENT'),
(3, 'Computer Science 101', CURDATE() - INTERVAL 1 DAY, 'PRESENT'),
(4, 'Computer Science 101', CURDATE() - INTERVAL 1 DAY, 'LATE'),
(5, 'Computer Science 101', CURDATE() - INTERVAL 1 DAY, 'PRESENT'),
(11, 'Computer Science 101', CURDATE() - INTERVAL 1 DAY, 'PRESENT'),
(13, 'Computer Science 101', CURDATE() - INTERVAL 1 DAY, 'ABSENT'),
(1, 'Mathematics Advanced', CURDATE() - INTERVAL 2 DAY, 'PRESENT'),
(6, 'Mathematics Advanced', CURDATE() - INTERVAL 2 DAY, 'PRESENT'),
(7, 'Mathematics Advanced', CURDATE() - INTERVAL 2 DAY, 'PRESENT'),
(8, 'Mathematics Advanced', CURDATE() - INTERVAL 2 DAY, 'ABSENT'),
(12, 'Mathematics Advanced', CURDATE() - INTERVAL 2 DAY, 'PRESENT'),
(15, 'Mathematics Advanced', CURDATE() - INTERVAL 2 DAY, 'LATE'),
(14, 'Physics II', CURDATE() - INTERVAL 3 DAY, 'PRESENT'),
(9, 'Physics II', CURDATE() - INTERVAL 3 DAY, 'PRESENT'),
(10, 'Physics II', CURDATE() - INTERVAL 3 DAY, 'ABSENT');
