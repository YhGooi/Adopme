package com.adopme.adopme.controller;
import com.adopme.adopme.dto.appointment.AppointmentRequest;
import com.adopme.adopme.dto.appointment.AppointmentResponse;
import com.adopme.adopme.model.AppointmentStatus;
import com.adopme.adopme.service.AppointmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ✅ 创建预约
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            AppointmentResponse response = appointmentService.createAppointment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ 获取指定用户的预约记录
    @GetMapping("/user")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByUserId(
            @RequestHeader(value = "userId") String userIdStr) {
        try {
            if (userIdStr == null || userIdStr.isEmpty()) {
                throw new IllegalArgumentException("User ID is required");
            }

            Long userId;
            try {
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid user ID format: " + userIdStr);
            }

            List<AppointmentResponse> appointments =
                    appointmentService.getAppointmentsByUserId(userId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ 获取所有预约（可筛选状态与时间范围）
    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<AppointmentResponse> appointments =
                appointmentService.getAllAppointments(status, startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    // ✅ 更新预约状态
    @PostMapping("/update")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @RequestParam Long appointmentId,
            @RequestParam AppointmentStatus status) {
        AppointmentResponse updatedAppointment =
                appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(updatedAppointment);
    }
}
