package com.adopme.adopme.service;

import com.adopme.adopme.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class AuthService {

    public final UserRepository userRepository;

    @Value("${SKIP_LOGIN_ENCRYPTION:true}")
    private Boolean skip_encryption;

    // Constructor
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Boolean authenticate(String email, String password) {
        String passwordHashed = userRepository.findPasswordHashByEmail(email);
        System.out.println("passwordHashed: " + passwordHashed);
        return skip_encryption
                ? passwordHashed.equals(password)
                : passwordHashed.equals(hashSHA256(password));
    }

    public String getUserType(String email){
        return userRepository.findTypeByEmail(email);
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
