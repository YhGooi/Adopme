package com.adopme.adopme.dto.adoption;

import com.adopme.adopme.model.AdoptionRequestStatus;

import java.time.LocalDateTime;

public record AdoptionRequestBasicResponse(
        Long id,
        AdoptionRequestStatus status,
        String message,
        String remarks,
        LocalDateTime submissionDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
