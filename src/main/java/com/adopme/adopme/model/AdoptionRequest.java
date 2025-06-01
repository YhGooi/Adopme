package com.adopme.adopme.model;

import jakarta.persistence.*;

import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "adoption_request")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdoptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Column(nullable = false)
    @Getter
    private Long petId;

    @Column(nullable = false)
    @Getter
    private Long userId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Getter
    private AdoptionRequestStatus status;

    @Column(columnDefinition = "TEXT")
    @Getter
    private String message;

    @Column(columnDefinition = "TEXT")
    @Getter
    private String remarks;

    @Column(nullable = false)
    @Getter
    private LocalDateTime submissionDate;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public AdoptionRequest(
            Long petId,
            Long userId,
            AdoptionRequestStatus status,
            String message,
            String remarks,
            LocalDateTime submissionDate) {
        this.petId = petId;
        this.userId = userId;
        this.status = status;
        this.message = message;
        this.remarks = remarks;
        this.submissionDate = submissionDate;
    }
}
