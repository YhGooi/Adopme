package com.adopme.adopme.dto.appointment;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    private Long userId;
    private Long petId;
    private LocalDateTime appointmentDateTime;
}
