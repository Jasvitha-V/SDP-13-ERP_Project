package com.eduerp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GradeDTO {
    private Long id;

    @NotNull
    private Long studentId;

    @NotBlank
    private String subject;

    @Min(0) @Max(100)
    private Integer midtermScore;

    @Min(0) @Max(100)
    private Integer finalScore;

    @Min(0) @Max(100)
    private Integer assignmentScore;

    // Computed fields (read-only)
    private Integer totalScore;
    private String letterGrade;
    private String studentName;
}
