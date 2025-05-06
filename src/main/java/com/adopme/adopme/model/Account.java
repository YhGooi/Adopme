package com.adopme.adopme.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "\"account\"")
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates an all-args constructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String type; // consider making this an ENUM if values are fixed

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 20)
    private String postCode;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String phoneNo;

    @Column(nullable = false)
    private LocalDateTime lastLoginDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createDate;

    @Column(nullable = false, length = 100)
    private String updatedBy;

    @Column(nullable = false)
    private LocalDateTime updateDate;

    // Getters, Setters, Constructors, etc.
    
    /**
     * @return Long return the id
     */
    public Long getId() {
        return id;
    }

    public Account(String passwordHash, String type, String name, Integer age, String address, String postCode,
            String email, String phoneNo, LocalDateTime lastLoginDate, LocalDateTime createDate, String updatedBy,
            LocalDateTime updateDate) {
        this.passwordHash = passwordHash;
        this.type = type;
        this.name = name;
        this.age = age;
        this.address = address;
        this.postCode = postCode;
        this.email = email;
        this.phoneNo = phoneNo;
        this.lastLoginDate = lastLoginDate;
        this.createDate = createDate;
        this.updatedBy = updatedBy;
        this.updateDate = updateDate;
    }

}
