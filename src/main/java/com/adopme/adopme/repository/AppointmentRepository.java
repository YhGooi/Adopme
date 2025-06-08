package com.adopme.adopme.repository;

import com.adopme.adopme.dto.appointment.AppointmentDetailResponse;
import com.adopme.adopme.model.Appointment;
import com.adopme.adopme.model.AppointmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {

    List<Appointment> findByUserIdOrderByAppointmentDateTimeDesc(Long userId);    
    
    @Query("SELECT new com.adopme.adopme.dto.appointment.AppointmentDetailResponse(" +
           "a.id, a.appointmentDateTime, a.createdAt, p.name, a.status, u.name) " +
           "FROM Appointment a " +
           "LEFT JOIN User u ON a.userId = u.id " +
           "LEFT JOIN Pet p ON a.petId = p.id " +
           "WHERE (:status IS NULL OR a.status = :status) " +
           "AND a.appointmentDateTime BETWEEN :startDate AND :endDate " +
           "ORDER BY a.createdAt ASC")
    List<AppointmentDetailResponse> findAppointmentsWithDetails(
        @Param("status") AppointmentStatus status, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
}
