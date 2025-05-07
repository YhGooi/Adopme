package com.adopme.adopme.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.adopme.adopme.repository.AccountRepository;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class LoginService {

    public final AccountRepository accountsRepository;

    @Value("${SKIP_LOGIN_ENCRYPTION:false}")
    private Boolean skip_encryption;

    //Constructor
    public LoginService(AccountRepository accountsRepository) {
        this.accountsRepository = accountsRepository;
    }

    public Boolean authenticate(String email, String password){
        String passwordHashed = accountsRepository.findPasswordHashByEmail(email);
        return skip_encryption? passwordHashed.equals(password) : passwordHashed.equals(hashSHA256(password));
    }

    public static String hashSHA256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b)); // Convert byte to hex
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found!", e);
        }
    }
}
