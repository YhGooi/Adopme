package com.adopme.adopme.dto.donation;

import com.adopme.adopme.model.DonationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DonationAdminResponse(
        Long id,
        Long userId,
        String userName,
        BigDecimal amount,
        LocalDateTime donationDate,
        DonationStatus status,
        boolean hasReceipt) {}
