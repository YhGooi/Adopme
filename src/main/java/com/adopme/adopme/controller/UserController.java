package com.adopme.adopme.controller;

import com.adopme.adopme.dto.user.LoginRequest;
import com.adopme.adopme.dto.user.SignUpRequest;
import com.adopme.adopme.dto.user.UserResponse;
import com.adopme.adopme.security.JwtUtil;
import com.adopme.adopme.service.AuthService;
import com.adopme.adopme.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private final AuthService loginService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public UserController(AuthService loginService, JwtUtil jwtUtil, UserService userService) {
        this.loginService = loginService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated =
                loginService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        System.out.println("isAuthenticated: " + isAuthenticated);
        try {
            if (isAuthenticated) {
                String token = jwtUtil.generateToken(loginRequest.getEmail());
                Map<String, String> response = loginService.getUserDetails(loginRequest.getEmail());
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignUpRequest signUpRequest) {
        try {
            userService.registerUser(signUpRequest);
            Map<String, String> response = new HashMap<>();
            response.put("status", "SUCCESS");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Handle user-specific validation errors (e.g., email already exists)
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            // Handle any other unexpected errors
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestBody SignUpRequest signUpRequest,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.validateTokenAndRetrieveSubject(token);

            userService.updateUserProfile(email, signUpRequest);

            Map<String, String> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("message", "Profile updated successfully");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/contacts")
    public ResponseEntity<?> getContacts(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.validateTokenAndRetrieveSubject(token);

            List<String> contacts = userService.getAllUsersExceptCurrent(email);
            return ResponseEntity.ok(contacts);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", "Error fetching contacts");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserProfile(@RequestHeader(value = "userId") String userIdStr) {
        try {
            if (userIdStr == null || userIdStr.isEmpty()) {
                throw new IllegalArgumentException("User ID is required");
            }

            // Log the received userId for debugging
            System.out.println("Received userId header: " + userIdStr);

            Long userId;
            try {
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid user ID format: " + userIdStr);
            }

            UserResponse userResponse = userService.getUserById(userId);
            return ResponseEntity.ok(userResponse);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILURE");
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
