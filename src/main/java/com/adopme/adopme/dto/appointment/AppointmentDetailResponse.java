package com.adopme.adopme.dto.appointment;

import com.adopme.adopme.model.AppointmentStatus;
import java.time.LocalDateTime;

public record AppointmentDetailResponse(
    Long id,
    LocalDateTime appointmentDateTime,
    LocalDateTime createdAt,
    String petName,
    AppointmentStatus status,
    String userName
) {}
