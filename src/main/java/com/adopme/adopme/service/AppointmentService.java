package com.adopme.adopme.service;

import com.adopme.adopme.dto.appointment.AppointmentResponse;
import com.adopme.adopme.dto.appointment.AppointmentResponseMapper;
import com.adopme.adopme.model.Appointment;
import com.adopme.adopme.model.AppointmentStatus;
import com.adopme.adopme.repository.AppointmentRepository;
import com.adopme.adopme.repository.spec.AppointmentSpecifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<AppointmentResponse> getAppointmentsByUserId(Long userId) {
        List<Appointment> appointments =
                appointmentRepository.findByUserIdOrderByAppointmentDateTimeDesc(userId);
        return appointments.stream()
                .map(AppointmentResponseMapper.INSTANCE::toAppointmentResponse)
                .toList();
    }

    public List<AppointmentResponse> getAllAppointments(
            AppointmentStatus status, String startDate, String endDate) {

        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);

        Specification<Appointment> spec = AppointmentSpecifications.withFilters(status, start, end);

        Sort sort = Sort.by(Sort.Direction.DESC, "appointmentDateTime");
        List<Appointment> appointments = appointmentRepository.findAll(spec, sort);

        return appointments.stream()
                .map(AppointmentResponseMapper.INSTANCE::toAppointmentResponse)
                .toList();
    }

    public AppointmentResponse updateAppointmentStatus(
            Long appointmentId, AppointmentStatus status) {
        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Appointment not found with id: " + appointmentId));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return AppointmentResponseMapper.INSTANCE.toAppointmentResponse(updatedAppointment);
    }
}
