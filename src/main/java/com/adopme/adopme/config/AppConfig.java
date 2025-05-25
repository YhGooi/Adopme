package com.adopme.adopme.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class AppConfig {

    @Value("${FABRICATE_ACCOUNT:false}")
    private boolean fabricateAccount;

    @Value("${SKIP_LOGIN_ENCRYPTION:false}")
    private boolean skipLoginEncryption;

    @Value("${jwt.secret:defaultSecret}")
    private String jwtSecret;

    public boolean isFabricateAccount() {
        return fabricateAccount;
    }

    public boolean isSkipLoginEncryption() {
        return skipLoginEncryption;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    @Override
    public String toString() {
        return "AppConfig [fabricateAccount=" + fabricateAccount + ", skipLoginEncryption=" + skipLoginEncryption
                + ", jwtSecret=" + jwtSecret + "]";
    }

    @PostConstruct
    public void printConfig() {
        System.out.println("AppConfig: " + this);
    }
    
}