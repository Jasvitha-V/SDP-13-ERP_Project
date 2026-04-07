package com.eduerp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "grades",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "subject"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String subject;

    @Column(name = "midterm_score")
    private Integer midtermScore;

    @Column(name = "final_score")
    private Integer finalScore;

    @Column(name = "assignment_score")
    private Integer assignmentScore;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "letter_grade", length = 3)
    private String letterGrade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private User gradedBy;

    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        if (midtermScore != null && finalScore != null && assignmentScore != null) {
            this.totalScore = (int) Math.round(midtermScore * 0.35 + finalScore * 0.45 + assignmentScore * 0.20);
            this.letterGrade = calculateLetterGrade(this.totalScore);
        }
    }

    private String calculateLetterGrade(int score) {
        if (score >= 95) return "A+";
        if (score >= 90) return "A";
        if (score >= 85) return "B+";
        if (score >= 80) return "B";
        if (score >= 75) return "C+";
        if (score >= 70) return "C";
        if (score >= 65) return "D";
        return "F";
    }
}
