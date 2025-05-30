package com.adopme.adopme.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "species")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Species {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
