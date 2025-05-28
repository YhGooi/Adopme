package com.adopme.adopme.service;

import com.adopme.adopme.dto.user.SignUpRequest;
import com.adopme.adopme.model.User;
import com.adopme.adopme.model.UserType;
import com.adopme.adopme.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthService authService;

    public UserService(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public List<String> getAllUsersExceptCurrent(String currentUserEmail) {
        List<User> users = userRepository.findContactsByEmail(currentUserEmail);
        return users.stream()
                .map(User::getEmail)
                .collect(Collectors.toList());
    }

    public User registerUser(SignUpRequest signUpRequest) {
        // Validate if email already exists
        System.out.println(signUpRequest.getEmail());
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String hashedPassword = authService.hashSHA256(signUpRequest.getPassword());

        // Build user
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .passwordHash(hashedPassword)
                .type(UserType.USER) // Or UserType.USER if you want to force it
                .name(signUpRequest.getName())
                .dateOfBirth(signUpRequest.getDateOfBirth())
                .address(signUpRequest.getAddress())
                .housingType(signUpRequest.getHousingType())
                .occupation(signUpRequest.getOccupation())
                .pettingExperience(signUpRequest.getPettingExperience())
                .currentPets(signUpRequest.getCurrentPets())
                .phoneNo(signUpRequest.getPhoneNo())
                .build();

        User savedUser = userRepository.save(user);
        System.out.println("Saved user: " + savedUser);
        return savedUser;
    }

    public void updateUserProfile(String email, SignUpRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = optionalUser.get();

        user.setName(request.getName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPhoneNo(request.getPhoneNo());
        user.setAddress(request.getAddress());
        user.setHousingType(request.getHousingType());
        user.setOccupation(request.getOccupation());
        user.setPettingExperience(request.getPettingExperience());
        user.setCurrentPets(request.getCurrentPets());

        userRepository.save(user);
    }
}
