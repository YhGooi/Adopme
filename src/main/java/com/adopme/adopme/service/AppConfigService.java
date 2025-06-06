package com.adopme.adopme.service;

import com.adopme.adopme.config.AppConfig;

import org.springframework.stereotype.Service;

@Service
public class AppConfigService {

    private final AppConfig appConfig;

    public AppConfigService(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    public AppConfig getAppConfig() {
        return this.appConfig;
    }
}
