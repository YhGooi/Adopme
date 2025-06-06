package com.adopme.adopme.dto.donation;

import com.adopme.adopme.model.DonationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DonationResponse(
        Long id,
        Long userId,
        BigDecimal amount,
        LocalDateTime donationDate,
        DonationStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
