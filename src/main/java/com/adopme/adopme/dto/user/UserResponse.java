package com.adopme.adopme.dto.user;

import com.adopme.adopme.model.HousingType;
import com.adopme.adopme.model.PettingExperience;
import com.adopme.adopme.model.UserType;

import java.time.LocalDate;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserType type,
        LocalDate dateOfBirth,
        String address,
        HousingType housingType,
        String occupation,
        PettingExperience pettingExperience,
        int currentPets,
        String phoneNo) {}
