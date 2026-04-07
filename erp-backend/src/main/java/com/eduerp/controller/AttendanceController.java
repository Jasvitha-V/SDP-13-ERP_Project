package com.eduerp.controller;

import com.eduerp.dto.AttendanceDTO;
import com.eduerp.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceDTO>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudentId(studentId));
    }

    @GetMapping
    public ResponseEntity<List<AttendanceDTO>> getByCourseAndDate(
            @RequestParam String course,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByCourseAndDate(course, date));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<Map<String, Long>> getSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceSummaryForStudent(studentId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<AttendanceDTO> markAttendance(@RequestBody AttendanceDTO dto) {
        return ResponseEntity.ok(attendanceService.markAttendance(dto));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<AttendanceDTO>> bulkMark(@RequestBody List<AttendanceDTO> dtos) {
        return ResponseEntity.ok(attendanceService.bulkMarkAttendance(dtos));
    }
}
