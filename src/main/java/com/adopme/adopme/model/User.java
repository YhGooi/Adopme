package com.adopme.adopme.model;

import jakarta.persistence.*;

import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user")
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates an all-args constructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Column(nullable = false, length = 100)
    @Getter
    private String passwordHash;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Getter
    private UserType type;

    @Column(nullable = false, length = 100)
    @Getter
    private String name;

    @Column(nullable = false)
    @Getter
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    @Getter
    private String address;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Getter
    private HousingType housingType;

    @Column(nullable = false)
    @Getter
    private String occupation;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Getter
    private PettingExperience pettingExperience;

    @Column(nullable = false)
    @Getter
    private int currentPets;

    @Column(nullable = false, unique = true, length = 100)
    @Getter
    private String email;

    @Column(nullable = false, length = 20)
    @Getter
    private String phoneNo;

    @Getter @Setter private Instant lastLoginAt;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public User(
            String passwordHash,
            UserType type,
            String name,
            LocalDate dateOfBirth,
            String address,
            HousingType housingType,
            String occupation,
            PettingExperience pettingExperience,
            int currentPets,
            String email,
            String phoneNo) {
        this.passwordHash = passwordHash;
        this.type = type;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.housingType = housingType;
        this.occupation = occupation;
        this.pettingExperience = pettingExperience;
        this.currentPets = currentPets;
        this.email = email;
        this.phoneNo = phoneNo;
    }

    public void updateLoginTime() {
        this.lastLoginAt = Instant.now();
    }
}
