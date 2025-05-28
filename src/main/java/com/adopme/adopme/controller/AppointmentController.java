package com.adopme.adopme.controller;

import com.adopme.adopme.dto.appointment.AppointmentResponse;
import com.adopme.adopme.model.AppointmentStatus;
import com.adopme.adopme.service.AppointmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByUserId(
            @RequestHeader("userId") Long userId) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<AppointmentResponse> appointments =
                appointmentService.getAllAppointments(status, startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/update")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @RequestParam Long appointmentId, @RequestParam AppointmentStatus status) {
        AppointmentResponse updatedAppointment =
                appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(updatedAppointment);
    }
}
