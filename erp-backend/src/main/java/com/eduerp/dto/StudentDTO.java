package com.eduerp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank @Email(message = "Valid email required")
    private String email;

    @NotBlank(message = "Grade/class is required")
    private String gradeClass;

    @Min(0) @Max(4)
    private Double gpa;

    @Min(0) @Max(100)
    private Integer attendance;

    private String status;
}
