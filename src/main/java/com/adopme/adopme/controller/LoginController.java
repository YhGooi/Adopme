package com.adopme.adopme.controller;

import com.adopme.adopme.dto.user.LoginRequest;
import com.adopme.adopme.security.JwtUtil;
import com.adopme.adopme.service.LoginService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/Login")
public class LoginController {
    private final LoginService loginService;
    private final JwtUtil jwtUtil;

    public LoginController(LoginService loginService, JwtUtil jwtUtil) {
        this.loginService = loginService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated =
                loginService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (isAuthenticated) {
            String token = jwtUtil.generateToken(loginRequest.getEmail());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
