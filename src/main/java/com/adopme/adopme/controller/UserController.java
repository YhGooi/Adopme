package com.adopme.adopme.controller;

import com.adopme.adopme.dto.user.LoginRequest;
import com.adopme.adopme.security.JwtUtil;
import com.adopme.adopme.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private final AuthService loginService;
    private final JwtUtil jwtUtil;

    public UserController(AuthService loginService, JwtUtil jwtUtil) {
        this.loginService = loginService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated = loginService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        System.out.println("isAuthenticated: " + isAuthenticated);
        if (isAuthenticated) {
            String type = loginService.getUserType(loginRequest.getEmail()); 
            String token = jwtUtil.generateToken(loginRequest.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("type", type);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
