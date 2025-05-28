package com.adopme.adopme.dto.appointment;

import com.adopme.adopme.model.AppointmentStatus;

import java.time.LocalDateTime;

public record AppointmentResponse(
        Long id,
        Long userId,
        Long petId,
        LocalDateTime appointmentDateTime,
        AppointmentStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
