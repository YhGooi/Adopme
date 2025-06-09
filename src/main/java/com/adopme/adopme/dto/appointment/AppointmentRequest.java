package com.adopme.adopme.dto.appointment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    private Long userId;
    private Long petId;
    private LocalDateTime appointmentDateTime;

    // Custom setter for appointmentDateTime that can handle ISO string format
    public void setAppointmentDateTime(String dateTimeStr) {
        if (dateTimeStr != null) {
            this.appointmentDateTime = LocalDateTime.parse(dateTimeStr);
        }
    }

    // Keep the original setter for LocalDateTime
    public void setAppointmentDateTime(LocalDateTime dateTime) {
        this.appointmentDateTime = dateTime;
    }
}
