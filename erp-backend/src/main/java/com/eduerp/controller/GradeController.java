package com.eduerp.controller;

import com.eduerp.dto.GradeDTO;
import com.eduerp.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @GetMapping
    public ResponseEntity<List<GradeDTO>> getAllGrades(
            @RequestParam(required = false) String subject) {
        if (subject != null) return ResponseEntity.ok(gradeService.getGradesBySubject(subject));
        return ResponseEntity.ok(gradeService.getAllGrades());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GradeDTO>> getGradesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getGradesByStudent(studentId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeDTO> createOrUpdateGrade(@Valid @RequestBody GradeDTO dto) {
        return ResponseEntity.ok(gradeService.createOrUpdateGrade(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeDTO> updateGrade(
            @PathVariable Long id, @Valid @RequestBody GradeDTO dto) {
        return ResponseEntity.ok(gradeService.updateGrade(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.ok("Grade deleted");
    }
}
