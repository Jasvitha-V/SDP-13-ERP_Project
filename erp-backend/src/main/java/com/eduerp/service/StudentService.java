package com.eduerp.service;

import com.eduerp.dto.StudentDTO;
import com.eduerp.entity.Student;
import com.eduerp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student s = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        return toDTO(s);
    }

    public List<StudentDTO> searchStudents(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already in use: " + dto.getEmail());
        }
        Student student = toEntity(dto);
        return toDTO(studentRepository.save(student));
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setGradeClass(dto.getGradeClass());
        student.setGpa(dto.getGpa());
        student.setAttendance(dto.getAttendance());
        if (dto.getStatus() != null) {
            student.setStatus(Student.Status.valueOf(dto.getStatus().toUpperCase()));
        }
        return toDTO(studentRepository.save(student));
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found: " + id);
        }
        studentRepository.deleteById(id);
    }

    private StudentDTO toDTO(Student s) {
        StudentDTO dto = new StudentDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setEmail(s.getEmail());
        dto.setGradeClass(s.getGradeClass());
        dto.setGpa(s.getGpa());
        dto.setAttendance(s.getAttendance());
        dto.setStatus(s.getStatus().name());
        return dto;
    }

    private Student toEntity(StudentDTO dto) {
        Student s = new Student();
        s.setName(dto.getName());
        s.setEmail(dto.getEmail());
        s.setGradeClass(dto.getGradeClass());
        s.setGpa(dto.getGpa());
        s.setAttendance(dto.getAttendance() != null ? dto.getAttendance() : 100);
        s.setStatus(dto.getStatus() != null
                ? Student.Status.valueOf(dto.getStatus().toUpperCase())
                : Student.Status.ACTIVE);
        return s;
    }
}
