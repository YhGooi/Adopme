package com.adopme.adopme.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pet")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @JsonProperty("dateOfBirth")
    private LocalDate dob;

    @Column(nullable = false)
    private String gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Species species;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
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
    private PetStatus status;

    @CreationTimestamp private LocalDateTime createdAt;

    @UpdateTimestamp private LocalDateTime updatedAt;

    public Pet(
            String name,
            LocalDate dob,
            String gender,
            Species species,
            Breed breed,
            Double weight,
            Boolean vaccinated,
            String description,
            String petImageUrl,
            PetStatus status) {
        this.name = name;
        this.dob = dob;
        this.gender = gender;
        this.species = species;
        this.breed = breed;
        this.weight = weight;
        this.vaccinated = vaccinated;
        this.description = description;
        this.petImageUrl = petImageUrl;
        this.status = status;
    }
}
