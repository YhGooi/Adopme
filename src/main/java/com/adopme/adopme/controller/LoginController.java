package com.adopme.adopme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adopme.adopme.service.LoginService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/Login")
public class LoginController {
    private final LoginService loginService;

    public LoginController(LoginService loginService){
        this.loginService=loginService;
    }

    @GetMapping("/{email}")
    public ResponseEntity<String> getCampaignById(@PathVariable String email) {
        System.out.println("GET PASSWORD" + ResponseEntity.ok(loginService.getPasswordHashed(email)));
        return ResponseEntity.ok(loginService.getPasswordHashed(email));
    }


    //TEST API
    @GetMapping("/test/{email}")
    public ResponseEntity<String> testAPI(@PathVariable String email) {
        System.out.println("CALLED TEST API");
        return ResponseEntity.ok(email);
    }
}
