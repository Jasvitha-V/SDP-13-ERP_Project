package com.eduerp.config;

import com.eduerp.entity.User;
import com.eduerp.entity.Schedule;
import com.eduerp.entity.Student;
import com.eduerp.entity.AttendanceRecord;
import com.eduerp.entity.Grade;
import com.eduerp.repository.UserRepository;
import com.eduerp.repository.ScheduleRepository;
import com.eduerp.repository.StudentRepository;
import com.eduerp.repository.AttendanceRepository;
import com.eduerp.repository.GradeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("Dr. Sarah Mitchell",  "admin@edu.com",        "admin123",  User.Role.ADMIN,         "IT");
        seedUser("Prof. James Carter",  "teacher@edu.com",      "teach123",  User.Role.TEACHER,       "Computer Science");
        seedUser("Alex Johnson",        "student@edu.com",      "stud123",   User.Role.STUDENT,       "Grade 10-A");
        seedUser("Linda Hayes",         "administrator@edu.com","adm123",    User.Role.ADMINISTRATOR, "Operations");
        seedUser("Dr. Robert Lee",      "r.lee@edu.com",        "teach123",  User.Role.TEACHER,       "Mathematics");
        
        // Added new users
        seedUser("Jane Doe",            "j.doe@edu.com",        "teach123",  User.Role.TEACHER,       "Physics");
        seedUser("John Smith",          "j.smith@edu.com",      "stud123",   User.Role.STUDENT,       "Grade 11-B");
        seedUser("Emily Davis",         "e.davis@edu.com",      "stud123",   User.Role.STUDENT,       "Grade 12-A");
        seedUser("Michael Brown",       "m.brown@edu.com",      "adm123",    User.Role.ADMINISTRATOR, "Finance");
        seedUser("Sarah Connor",        "s.connor@edu.com",     "admin123",  User.Role.ADMIN,         "IT");
        
        seedStudent("Alex Johnson", "student@edu.com", "Grade 10-A", 3.8, 95);
        seedStudent("John Smith", "j.smith@edu.com", "Grade 11-B", 3.5, 90);
        seedStudent("Emily Davis", "e.davis@edu.com", "Grade 12-A", 3.9, 98);
        seedStudent("Mark Wilson", "m.wilson@edu.com", "Grade 10-A", 2.5, 75);

        seedSchedule("Computer Science 101", "Prof. James Carter", "Lab 1", "Monday", "09:00", "10:30", "Grade 10-A", "Fall 2026");
        seedSchedule("Mathematics 201", "Dr. Robert Lee", "Room 205", "Tuesday", "11:00", "12:30", "Grade 11-B", "Fall 2026");
        seedSchedule("Physics 301", "Jane Doe", "Lab 3", "Wednesday", "13:00", "14:30", "Grade 12-A", "Fall 2026");
        seedSchedule("Computer Science 101", "Prof. James Carter", "Lab 1", "Thursday", "09:00", "10:30", "Grade 10-A", "Fall 2026");

        seedAttendanceAndGrades();

        log.info("✅ EduERP seed users ready");
    }

    private void seedAttendanceAndGrades() {
        User teacherJames = userRepository.findByEmail("teacher@edu.com").orElse(null);
        User teacherRobert = userRepository.findByEmail("r.lee@edu.com").orElse(null);

        Student alex = studentRepository.findByEmail("student@edu.com").orElse(null);
        Student john = studentRepository.findByEmail("j.smith@edu.com").orElse(null);
        Student emily = studentRepository.findByEmail("e.davis@edu.com").orElse(null);

        if (teacherJames != null && teacherRobert != null && alex != null && john != null && emily != null) {
            seedAttendance(alex, "Computer Science 101", LocalDate.now().minusDays(2), AttendanceRecord.AttendanceStatus.PRESENT, teacherJames);
            seedAttendance(alex, "Mathematics 201", LocalDate.now().minusDays(1), AttendanceRecord.AttendanceStatus.ABSENT, teacherRobert);
            seedAttendance(john, "Mathematics 201", LocalDate.now().minusDays(1), AttendanceRecord.AttendanceStatus.PRESENT, teacherRobert);
            seedAttendance(emily, "Physics 301", LocalDate.now(), AttendanceRecord.AttendanceStatus.PRESENT, teacherJames);

            seedGrade(alex, "Computer Science 101", 90, 85, 95, teacherJames);
            seedGrade(john, "Mathematics 201", 80, 75, 85, teacherRobert);
            seedGrade(emily, "Physics 301", 95, 98, 100, teacherJames);
        }
    }

    private void seedUser(String name, String email, String rawPwd, User.Role role, String dept) {
        if (!userRepository.existsByEmail(email)) {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode(rawPwd));
            u.setRole(role);
            u.setDepartment(dept);
            u.setStatus(User.Status.ACTIVE);
            userRepository.save(u);
            log.info("Created user: {} ({})", email, role);
        }
    }

    private void seedStudent(String name, String email, String gradeClass, Double gpa, Integer attendance) {
        if (studentRepository.count() < 4) { // Basic check to avoid duplicates if re-run
            Student s = new Student();
            s.setName(name);
            s.setEmail(email);
            s.setGradeClass(gradeClass);
            s.setGpa(gpa);
            s.setAttendance(attendance);
            s.setStatus(Student.Status.ACTIVE);
            studentRepository.save(s);
            log.info("Created student: {}", email);
        }
    }

    private void seedSchedule(String courseName, String teacherName, String roomNumber, String day, String start, String end, String gradeClass, String semester) {
        if (scheduleRepository.count() < 4) {
            Schedule s = new Schedule();
            s.setCourseName(courseName);
            s.setTeacherName(teacherName);
            s.setRoomNumber(roomNumber);
            s.setDayOfWeek(day);
            s.setStartTime(start);
            s.setEndTime(end);
            s.setGradeClass(gradeClass);
            s.setSemester(semester);
            scheduleRepository.save(s);
            log.info("Created schedule for course: {}", courseName);
        }
    }

    private void seedAttendance(Student student, String courseName, LocalDate date, AttendanceRecord.AttendanceStatus status, User teacher) {
        if (attendanceRepository.count() < 4) {
            AttendanceRecord a = new AttendanceRecord();
            a.setStudent(student);
            a.setCourseName(courseName);
            a.setDate(date);
            a.setStatus(status);
            a.setMarkedBy(teacher);
            attendanceRepository.save(a);
            log.info("Created attendance for student: {} in course: {}", student.getName(), courseName);
        }
    }

    private void seedGrade(Student student, String subject, Integer midterm, Integer finalScore, Integer assignment, User teacher) {
        if (gradeRepository.count() < 3) {
            Grade g = new Grade();
            g.setStudent(student);
            g.setSubject(subject);
            g.setMidtermScore(midterm);
            g.setFinalScore(finalScore);
            g.setAssignmentScore(assignment);
            g.setGradedBy(teacher);
            g.calculateTotal();
            gradeRepository.save(g);
            log.info("Created grade for student: {} in subject: {}", student.getName(), subject);
        }
    }
}
