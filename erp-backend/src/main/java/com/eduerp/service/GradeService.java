package com.eduerp.service;

import com.eduerp.dto.GradeDTO;
import com.eduerp.entity.Grade;
import com.eduerp.entity.Student;
import com.eduerp.repository.GradeRepository;
import com.eduerp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<GradeDTO> getAllGrades() {
        return gradeRepository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<GradeDTO> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<GradeDTO> getGradesBySubject(String subject) {
        return gradeRepository.findBySubject(subject).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public GradeDTO createOrUpdateGrade(GradeDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));

        Grade grade = gradeRepository
                .findByStudentIdAndSubject(dto.getStudentId(), dto.getSubject())
                .orElse(new Grade());

        grade.setStudent(student);
        grade.setSubject(dto.getSubject());
        grade.setMidtermScore(dto.getMidtermScore());
        grade.setFinalScore(dto.getFinalScore());
        grade.setAssignmentScore(dto.getAssignmentScore());

        return toDTO(gradeRepository.save(grade));
    }

    @Transactional
    public GradeDTO updateGrade(Long id, GradeDTO dto) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade record not found: " + id));
        grade.setMidtermScore(dto.getMidtermScore());
        grade.setFinalScore(dto.getFinalScore());
        grade.setAssignmentScore(dto.getAssignmentScore());
        return toDTO(gradeRepository.save(grade));
    }

    @Transactional
    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }

    private GradeDTO toDTO(Grade g) {
        GradeDTO dto = new GradeDTO();
        dto.setId(g.getId());
        dto.setStudentId(g.getStudent().getId());
        dto.setStudentName(g.getStudent().getName());
        dto.setSubject(g.getSubject());
        dto.setMidtermScore(g.getMidtermScore());
        dto.setFinalScore(g.getFinalScore());
        dto.setAssignmentScore(g.getAssignmentScore());
        dto.setTotalScore(g.getTotalScore());
        dto.setLetterGrade(g.getLetterGrade());
        return dto;
    }
}
