package com.adopme.adopme.controller;

import com.adopme.adopme.dto.token.TokenValidationResponse;
import com.adopme.adopme.dto.user.LoginRequest;
import com.adopme.adopme.service.TokenService;

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
    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<TokenValidationResponse> tokenValidation(
            @RequestBody LoginRequest loginRequest,
            @RequestHeader("Authorization") String authorization) {

        boolean isValid = tokenService.validateToken(loginRequest.getEmail(), authorization);

        TokenValidationResponse response =
                new TokenValidationResponse(
                        isValid, isValid ? "Token is valid" : "Token is invalid or expired");

        return ResponseEntity.status(isValid ? HttpStatus.OK : HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}
