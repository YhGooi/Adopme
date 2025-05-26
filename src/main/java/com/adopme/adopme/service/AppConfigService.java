package com.adopme.adopme.service;

import org.springframework.stereotype.Service;

import com.adopme.adopme.config.AppConfig;

@Service
public class AppConfigService {

    private final AppConfig appConfig;

    public AppConfigService(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    public AppConfig getAppConfig(){
        return this.appConfig;
    }
}
