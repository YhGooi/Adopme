package com.adopme.adopme.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "breed")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Breed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id", nullable = false)
    private Species species;
}
