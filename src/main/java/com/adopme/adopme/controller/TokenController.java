package com.adopme.adopme.controller;

import com.adopme.adopme.dto.token.TokenValidationResponse;
import com.adopme.adopme.dto.user.LoginRequest;
import com.adopme.adopme.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Token")
public class TokenController {
    private final JwtUtil jwtUtil;

    public TokenController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<TokenValidationResponse> tokenValidation(
            @RequestBody LoginRequest loginRequest,
            @RequestHeader("Authorization") String authorization) {

        System.out.println("[TOKEN]: Validating - " + loginRequest.getEmail());
        boolean isValid = validateToken(loginRequest.getEmail(), authorization);

        TokenValidationResponse response =
                new TokenValidationResponse(
                        isValid, isValid ? "Token is valid" : "Token is invalid or expired");

        return ResponseEntity.status(isValid ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    // Helper method to validate login token
    private Boolean validateToken(String email, String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return null; // If there's no valid token, return null
        }
        String token = authorization.substring(7); // Extract and return the token
        try {
            String subject = jwtUtil.validateTokenAndRetrieveSubject(token);
            if (!email.equals(subject)) {
                return false;
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
        return true;
    }
}
