package com.eduerp.controller;

import com.eduerp.entity.Schedule;
import com.eduerp.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @GetMapping
    public ResponseEntity<List<Schedule>> getAll(
            @RequestParam(required = false) String day,
            @RequestParam(required = false) String teacher,
            @RequestParam(required = false) String gradeClass) {
        if (day != null) return ResponseEntity.ok(scheduleRepository.findByDayOfWeek(day));
        if (teacher != null) return ResponseEntity.ok(scheduleRepository.findByTeacherName(teacher));
        if (gradeClass != null) return ResponseEntity.ok(scheduleRepository.findByGradeClass(gradeClass));
        return ResponseEntity.ok(scheduleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getById(@PathVariable Long id) {
        return scheduleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMINISTRATOR', 'TEACHER')")
    public ResponseEntity<Schedule> create(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMINISTRATOR', 'TEACHER')")
    public ResponseEntity<Schedule> update(@PathVariable Long id, @RequestBody Schedule updated) {
        return scheduleRepository.findById(id).map(s -> {
            s.setCourseName(updated.getCourseName());
            s.setTeacherName(updated.getTeacherName());
            s.setRoomNumber(updated.getRoomNumber());
            s.setDayOfWeek(updated.getDayOfWeek());
            s.setStartTime(updated.getStartTime());
            s.setEndTime(updated.getEndTime());
            s.setGradeClass(updated.getGradeClass());
            s.setSemester(updated.getSemester());
            return ResponseEntity.ok(scheduleRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMINISTRATOR', 'TEACHER')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        scheduleRepository.deleteById(id);
        return ResponseEntity.ok("Schedule deleted");
    }
}
