package com.adopme.adopme.service;

import org.springframework.stereotype.Service;

import com.adopme.adopme.repository.AccountRepository;

@Service
public class LoginService {
    public final AccountRepository accountsRepository;
    
    public LoginService(AccountRepository accountsRepository) {
        this.accountsRepository = accountsRepository;
    }

    public String getPasswordHashed(String email){
        return accountsRepository.findPasswordHashByEmail(email);
    }
}
