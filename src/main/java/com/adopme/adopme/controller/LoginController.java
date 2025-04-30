package com.adopme.adopme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adopme.adopme.service.LoginService;

@RestController
@RequestMapping("/Login")
public class LoginController {
    private final LoginService loginService;

    public LoginController(LoginService loginService){
        this.loginService=loginService;
    }

    @GetMapping("/{email}")
    public ResponseEntity<String> getCampaignById(@PathVariable String email) {
        return ResponseEntity.ok(loginService.getPasswordHashed(email));
    }
}
