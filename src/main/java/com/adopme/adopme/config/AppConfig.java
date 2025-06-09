package com.adopme.adopme.config;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${FABRICATE_ENABLED:false}")
    private boolean fabricateEnabled;

    @Value("${SKIP_LOGIN_ENCRYPTION:false}")
    private boolean skipLoginEncryption;

    @Value("${jwt.secret:defaultSecret}")
    private String jwtSecret;

    public boolean isFabricateEnabled() {
        return fabricateEnabled;
    }

    public boolean isSkipLoginEncryption() {
        return skipLoginEncryption;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    @Override
    public String toString() {
        return "AppConfig [fabricateEnabled="
                + fabricateEnabled
                + ", skipLoginEncryption="
                + skipLoginEncryption
                + ", jwtSecret="
                + jwtSecret
                + "]";
    }

    @PostConstruct
    public void printConfig() {
        System.out.println("AppConfig: " + this);
    }
}
