package com.adopme.adopme.dto.adoption;

import com.adopme.adopme.model.AdoptionRequestStatus;

import java.time.LocalDateTime;

public record AdoptionRequestResponse(
        Long id,
        Long petId,
        Long userId,
        AdoptionRequestStatus status,
        String message,
        String remarks,
        LocalDateTime submissionDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
