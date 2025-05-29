package com.adopme.adopme.dto.pet;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PetListingResponse(
    Long id,
    String name,
    Double age,
    LocalDate dob,
    String gender,
    String species,
    String breed,
    Double weight,
    Boolean vaccinated,
    String description,
    String petImageUrl,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
