package com.adopme.adopme.model;

import jakarta.persistence.*;

import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointment")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Column(nullable = false)
    @Getter
    private Long userId;

    @Column(nullable = false)
    @Getter
    private LocalDateTime appointmentDateTime;

    @Column(nullable = false)
    @Getter
    private Long petId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Getter
    @Setter
    private AppointmentStatus status;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Appointment(
            Long userId, LocalDateTime appointmentDateTime, Long petId, AppointmentStatus status) {
        this.userId = userId;
        this.appointmentDateTime = appointmentDateTime;
        this.petId = petId;
        this.status = status;
    }
}
