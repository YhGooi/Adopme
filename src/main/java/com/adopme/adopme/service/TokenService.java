package com.adopme.adopme.service;

import org.springframework.stereotype.Service;

import com.adopme.adopme.security.JwtUtil;

@Service
public class TokenService {

    private final JwtUtil jwtUtil;

    public TokenService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    // Helper method to validate login token
    public Boolean validateToken(String email, String authorization) {
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
