package com.eduerp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String message;

    public SignupResponse(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.message = "User registered successfully";
    }
}
