package com.eduerp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eduerp.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByGradeClass(String gradeClass);
    List<Student> findByStatus(Student.Status status);
    List<Student> findByNameContainingIgnoreCase(String name);
    boolean existsByEmail(String email);
    java.util.Optional<Student> findByEmail(String email);
}
