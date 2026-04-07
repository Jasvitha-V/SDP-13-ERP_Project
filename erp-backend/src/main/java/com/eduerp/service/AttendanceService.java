package com.eduerp.service;

import com.eduerp.dto.AttendanceDTO;
import com.eduerp.entity.AttendanceRecord;
import com.eduerp.entity.Student;
import com.eduerp.repository.AttendanceRepository;
import com.eduerp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<AttendanceDTO> getAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByCourseAndDate(String courseName, LocalDate date) {
        return attendanceRepository.findByCourseNameAndDate(courseName, date).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public AttendanceDTO markAttendance(AttendanceDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));

        // Check if already marked, update if so
        List<AttendanceRecord> existing = attendanceRepository
                .findByStudentIdAndDate(dto.getStudentId(), dto.getDate());

        AttendanceRecord record = existing.stream()
                .filter(r -> r.getCourseName().equals(dto.getCourseName()))
                .findFirst()
                .orElse(new AttendanceRecord());

        record.setStudent(student);
        record.setCourseName(dto.getCourseName());
        record.setDate(dto.getDate());
        record.setStatus(AttendanceRecord.AttendanceStatus.valueOf(dto.getStatus().toUpperCase()));

        return toDTO(attendanceRepository.save(record));
    }

    @Transactional
    public List<AttendanceDTO> bulkMarkAttendance(List<AttendanceDTO> dtos) {
        return dtos.stream().map(this::markAttendance).collect(Collectors.toList());
    }

    public Map<String, Long> getAttendanceSummaryForStudent(Long studentId) {
        List<AttendanceRecord> records = attendanceRepository.findByStudentId(studentId);
        return records.stream().collect(
                Collectors.groupingBy(r -> r.getStatus().name(), Collectors.counting())
        );
    }

    private AttendanceDTO toDTO(AttendanceRecord r) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(r.getId());
        dto.setStudentId(r.getStudent().getId());
        dto.setStudentName(r.getStudent().getName());
        dto.setCourseName(r.getCourseName());
        dto.setDate(r.getDate());
        dto.setStatus(r.getStatus().name());
        return dto;
    }
}
