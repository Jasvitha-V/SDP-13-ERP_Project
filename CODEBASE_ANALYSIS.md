# EduERP Codebase Analysis - POST/CREATE Endpoints & Forms

## 1. BACKEND POST/CREATE ENDPOINTS

### UserController
**POST Endpoint:** `POST /api/users`
- **Authorization:** `@PreAuthorize("hasRole('ADMIN')")`
- **Method:** `createUser(@RequestBody User user)`
- **Input:** Raw `User` entity (no DTO)
- **Features:**
  - Email uniqueness validation
  - Password encoding
  - Returns user with password cleared
- **Supported Fields:** name, email, password, role, department, status

### StudentController
**POST Endpoint:** `POST /api/students`
- **Authorization:** `@PreAuthorize("hasAnyRole('ADMIN', 'ADMINISTRATOR')")`
- **Method:** `createStudent(@Valid @RequestBody StudentDTO dto)`
- **Input:** `StudentDTO` with validation
- **Service Layer:** Delegates to `StudentService.createStudent()`

### GradeController
**POST Endpoints:**
1. **`POST /api/grades`** - Create or Update (Upsert pattern)
   - **Authorization:** `@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")`
   - **Method:** `createOrUpdateGrade(@Valid @RequestBody GradeDTO dto)`
   - **Service:** Delegates to `GradeService.createOrUpdateGrade()`

2. **`PUT /api/grades/{id}`** - Update specific grade
   - **Authorization:** `@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")`

### AttendanceController
**POST Endpoints:**
1. **`POST /api/attendance`** - Mark single attendance
   - **Authorization:** `@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")`
   - **Method:** `markAttendance(@RequestBody AttendanceDTO dto)`
   - **Service:** Delegates to `AttendanceService.markAttendance()`

2. **`POST /api/attendance/bulk`** - Bulk mark attendance
   - **Authorization:** `@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")`
   - **Method:** `bulkMark(@RequestBody List<AttendanceDTO> dtos)`
   - **Service:** Delegates to `AttendanceService.bulkMarkAttendance()`

---

## 2. DTO STRUCTURES

### StudentDTO
```java
@Data
public class StudentDTO {
    private Long id;                              // Read-only (generated)
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank @Email(message = "Valid email required")
    private String email;
    
    @NotBlank(message = "Grade/class is required")
    private String gradeClass;
    
    @Min(0) @Max(4)
    private Double gpa;
    
    @Min(0) @Max(100)
    private Integer attendance;
    
    private String status;                       // ACTIVE, WARNING, INACTIVE
}
```

### GradeDTO
```java
@Data
public class GradeDTO {
    private Long id;                             // Read-only (generated)
    
    @NotNull
    private Long studentId;
    
    @NotBlank
    private String subject;
    
    @Min(0) @Max(100)
    private Integer midtermScore;
    
    @Min(0) @Max(100)
    private Integer finalScore;
    
    @Min(0) @Max(100)
    private Integer assignmentScore;
    
    // Computed/Read-only fields
    private Integer totalScore;                  // Calculated: 35% midterm + 45% final + 20% assignment
    private String letterGrade;                  // A+, A, B+, B, C+, C, D, F (auto-calculated)
    private String studentName;                  // Populated by service layer
}
```

### AttendanceDTO
```java
@Data
public class AttendanceDTO {
    private Long id;                             // Read-only (generated)
    
    @NotNull
    private Long studentId;
    
    @NotBlank
    private String courseName;
    
    @NotNull
    private LocalDate date;
    
    @NotBlank
    private String status;                       // PRESENT, ABSENT, LATE
    
    // Read-only
    private String studentName;                  // Populated by service layer
}
```

### User Entity (No DTO - Uses Entity Directly)
```java
@Entity
@Table(name = "users")
@Data
public class User {
    private Long id;
    private String name;
    private String email;
    private String password;                     // Password-encoded on create/update
    private Role role;                           // ADMIN, TEACHER, STUDENT, ADMINISTRATOR
    private String department;
    private Status status;                       // ACTIVE, INACTIVE
    private LocalDateTime createdAt;
}
```

---

## 3. FRONTEND FORMS

### Users.jsx
**Current State:** Has **LOCAL STATE MANAGEMENT** (in-memory only - NOT connected to backend)
- **Form Modal:** Triggered by "Add User" button
- **Form Fields:**
  - Full Name (text input)
  - Email (text input)
  - Role (dropdown: Admin, Teacher, Student, Administrator)
  - Department (text input)
  - Status (dropdown: Active, Inactive)
- **Features:**
  - Add new user
  - Edit existing user
  - Delete user
  - Search by name/email
  - Filter by role
  - Role color coding
- **Backend Integration:** ❌ NO - currently using mock data

### Students.jsx
**Current State:** Has **LOCAL STATE MANAGEMENT** (in-memory only - NOT connected to backend)
- **Form Modal:** Triggered by "Add Student" button
- **Form Fields:**
  - Full Name (text input)
  - Email (text input)
  - Grade/Class (dropdown: 10-A, 10-B, 11-A, 11-B, 12-A, 12-B)
  - Status (dropdown: Active, Warning, Inactive)
  - GPA (number: 0-4 with 0.1 step)
  - Attendance % (number: 0-100)
- **Features:**
  - Add new student
  - Edit existing student
  - Delete student
  - Search by name/email/grade
  - Attendance progress bar visualization
  - GPA color coding (≥3.5: success, ≥3.0: gold, <3.0: danger)
- **Backend Integration:** ❌ NO - currently using mock data

### Grades.jsx
**Current State:** Has **LOCAL STATE MANAGEMENT** (in-memory only - NOT connected to backend)
- **Form Modal:** Triggered by "Edit" button (no "Add" - grades created via scores)
- **Form Fields:**
  - Student (displayed, not editable)
  - Subject (displayed, not editable)
  - Midterm Score (number: 0-100)
  - Final Score (number: 0-100)
  - Assignment Score (number: 0-100)
  - **Auto-calculated:** Total (35% midterm + 45% final + 20% assignment)
  - **Auto-calculated:** Letter Grade
- **Features:**
  - Edit grade scores
  - Automatic total & grade calculation
  - Grade distribution visualization (A+/A, B+/B, C+/C, D, F counts)
  - Search by student name
  - Filter by subject
  - Class average calculation
  - Color-coded grade display
- **Backend Integration:** ❌ NO - currently using mock data

### Attendance.jsx
**Current State:** Has **LOCAL STATE MANAGEMENT** (in-memory only - NOT connected to backend)
- **No Modal Form** - Uses inline status buttons
- **UI Elements:**
  - Class selector (dropdown: CS101, Math Advanced, Physics II, English Lit)
  - Date picker (default: today)
  - **Quick Status Buttons** for each student: P (Present), A (Absent), L (Late)
  - Save Attendance button
- **Features:**
  - Mark attendance inline for all 12 students
  - Quick toggle between Present/Absent/Late
  - Real-time count update (Present, Absent, Late)
  - Attendance rate percentage with color coding (≥90%: success, ≥75%: gold, <75%: danger)
  - Per-student status visualization
- **Backend Integration:** ❌ NO - currently using mock data

---

## 4. FRONTEND API SERVICE (api.js)

### Defined POST Methods:

#### authApi
```javascript
login: (email, password) => request("POST", "/auth/login", { email, password })
```

#### studentsApi
```javascript
create: (data) => request("POST", "/students", data)
```
- ✅ Connected to backend `POST /api/students`
- Takes StudentDTO payload

#### gradesApi
```javascript
createOrUpdate: (data) => request("POST", "/grades", data)
```
- ✅ Connected to backend `POST /api/grades`
- Takes GradeDTO payload

#### attendanceApi
```javascript
mark: (data) => request("POST", "/attendance", data)
bulkMark: (data) => request("POST", "/attendance/bulk", data)
```
- ✅ Connected to backend `POST /api/attendance` and `POST /api/attendance/bulk`
- Takes AttendanceDTO or List<AttendanceDTO> payload

#### usersApi
```javascript
create: (data) => request("POST", "/users", data)
```
- ✅ Connected to backend `POST /api/users`
- Takes User entity payload directly

#### schedulesApi
```javascript
create: (data) => request("POST", "/schedules", data)
```
- ✅ Connected to backend (endpoint exists)
- Takes schedule data
- **Note:** No Schedule form exists in frontend UI

---

## 5. SUMMARY TABLE: What Exists vs. What's Needed

| Entity | Backend Endpoint | DTO | Frontend Form | Connected | Status |
|--------|---|---|---|---|---|
| **User** | ✅ POST /api/users | ❌ Uses Entity | ✅ Users.jsx | ❌ NO | Needs integration |
| **Student** | ✅ POST /api/students | ✅ StudentDTO | ✅ Students.jsx | ❌ NO | Needs integration |
| **Grade** | ✅ POST /api/grades | ✅ GradeDTO | ✅ Grades.jsx (edit only) | ❌ NO | Needs integration |
| **Attendance** | ✅ POST /api/attendance<br>✅ POST /api/attendance/bulk | ✅ AttendanceDTO | ✅ Attendance.jsx | ❌ NO | Needs integration |
| **Schedule** | ✅ POST /api/schedules | ❓ Unknown | ❌ Missing | ❓ Partial | Needs UI + integration |

---

## 6. KEY FINDINGS & RECOMMENDATIONS

### ✅ EXISTING INFRASTRUCTURE
1. **Backend:** All POST endpoints are fully implemented with proper:
   - JWT authorization checks
   - Role-based access control (RBAC)
   - DTO validation with Jakarta annotations
   - Service layer delegation
   - Entity field encryption (passwords for users)

2. **API Service:** All POST methods are properly defined in `api.js` with:
   - Bearer token attachment
   - Error handling
   - JSON serialization

3. **Frontend Forms:** All UI components have complete form structures with:
   - Input validation (visual)
   - Status/role dropdowns
   - Search and filter capabilities
   - Mock data for visualization

### ❌ GAPS TO ADDRESS
1. **Frontend-Backend Disconnection:** 
   - All forms use local state only (mock data)
   - No actual POST/UPDATE calls made to backend
   - No error handling for API failures
   - No loading states

2. **Missing Integrations:**
   - Users form not calling `usersApi.create()`
   - Students form not calling `studentsApi.create()`
   - Grades form not calling `gradesApi.createOrUpdate()`
   - Attendance form not calling `attendanceApi.mark()` or `attendanceApi.bulkMark()`

3. **Schedule Management:**
   - Backend endpoint exists but frontend form is missing
   - Needs UI component in modules directory

### 🔧 REQUIRED CHANGES TO CONNECT FRONTEND-BACKEND
1. Convert all local state to API calls
2. Add loading spinners & error messages
3. Add success notifications after create/update
4. Implement form validation error display
5. Add Schedule management component
6. Handle unauthorized/token expiry scenarios
7. Add retry logic for failed requests

### 📋 AUTHORIZATION NOTES
- **User Create:** Requires ADMIN only
- **Student Create:** Requires ADMIN or ADMINISTRATOR
- **Grade Create/Update:** Requires ADMIN or TEACHER
- **Attendance Mark:** Requires ADMIN or TEACHER
- All read operations (GET) are either public or require generic roles

