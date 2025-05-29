package com.adopme.adopme.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pet_listing")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false)
    private String gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id", nullable = false)
    private Species species;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breed_id", nullable = false)
    private Breed breed;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Boolean vaccinated;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 512)
    private String petImageUrl; // Store image as URL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PetListingStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
