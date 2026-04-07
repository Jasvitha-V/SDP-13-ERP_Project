package com.eduerp.controller;

import com.eduerp.dto.JwtResponse;
import com.eduerp.dto.LoginRequest;
import com.eduerp.dto.SignupRequest;
import com.eduerp.dto.SignupResponse;
import com.eduerp.entity.User;
import com.eduerp.security.JwtUtils;
import com.eduerp.security.UserDetailsImpl;
import com.eduerp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getName(),
                    userDetails.getUsername(),
                    userDetails.getRole()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            // Check if email already exists
            if (userService.emailExists(signupRequest.getEmail())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new SignupResponse(null, null, signupRequest.getEmail(), null) {
                            {
                                this.setMessage("Email already registered");
                            }
                        });
            }

            // Create new user
            User newUser = userService.createUser(
                    signupRequest.getName(),
                    signupRequest.getEmail(),
                    signupRequest.getPassword(),
                    signupRequest.getRole(),
                    signupRequest.getDepartment()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new SignupResponse(
                            newUser.getId(),
                            newUser.getName(),
                            newUser.getEmail(),
                            newUser.getRole().toString()
                    ));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new SignupResponse(null, null, null, null) {
                        {
                            this.setMessage(e.getMessage());
                        }
                    });
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed. Please try again.");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(new JwtResponse(
                null,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getRole()
        ));
    }
}
