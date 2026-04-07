package com.eduerp.repository;

import com.eduerp.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByStudentId(Long studentId);
    List<AttendanceRecord> findByCourseNameAndDate(String courseName, LocalDate date);
    List<AttendanceRecord> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<AttendanceRecord> findByCourseNameAndDateBetween(String courseName, LocalDate from, LocalDate to);
}
