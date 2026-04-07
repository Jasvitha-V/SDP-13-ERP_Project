package com.eduerp.repository;

import com.eduerp.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findBySubject(String subject);
    Optional<Grade> findByStudentIdAndSubject(Long studentId, String subject);
}
