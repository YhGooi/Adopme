package com.adopme.adopme.dto.donation;

import com.adopme.adopme.model.DonationStatus;

public record DonationUpdateRequest(Long id, DonationStatus status) {}
