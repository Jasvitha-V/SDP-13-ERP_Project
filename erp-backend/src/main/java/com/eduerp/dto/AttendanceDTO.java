package com.eduerp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceDTO {
    private Long id;

    @NotNull
    private Long studentId;

    @NotBlank
    private String courseName;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String status;  // PRESENT, ABSENT, LATE

    // Read-only
    private String studentName;
}
