package com.adopme.adopme.dto.appointment;

import com.adopme.adopme.model.AppointmentStatus;

import java.time.LocalDateTime;

public record AppointmentAdminResponse(
        Long id,
        String userName,
        String petName,
        LocalDateTime appointmentDateTime,
        AppointmentStatus status) {}
