package com.adopme.adopme.service;

import com.adopme.adopme.model.User;
import com.adopme.adopme.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
        //System.out.println("passwordHashed: " + passwordHashed);
        return skip_encryption
                ? passwordHashed.equals(password)
                : passwordHashed.equals(hashSHA256(password));
    }

    public Map<String, String> getUserDetails(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            LocalDate date = user.getDateOfBirth();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String formattedDate = date.format(formatter);

            Map<String, String> response = new HashMap<>();
            response.put("id", String.valueOf(user.getId())); // Add user ID to the response
            response.put("name", user.getName());
            response.put("dateOfBirth", formattedDate);
            response.put("phoneNo", user.getPhoneNo());
            response.put("email", user.getEmail());
            response.put("address", user.getAddress());
            response.put("housingType", user.getHousingType().name());
            response.put("occupation", user.getOccupation());
            response.put("pettingExperience", user.getPettingExperience().name());
            response.put("currentPets", Integer.toString(user.getCurrentPets()));
            response.put("type", user.getType().name());

            return response;
        } else {
            System.out.println("User not found with email: " + email);
            return null;
        }
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
