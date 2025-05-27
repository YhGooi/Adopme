package com.adopme.adopme.model;

import jakarta.persistence.*;

import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "donation")
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates an all-args constructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Column(nullable = false)
    @Getter
    private Long userId;

    @Column(nullable = false, precision = 10, scale = 2)
    @Getter
    private BigDecimal amount;

    @Column(nullable = false)
    @Getter
    private LocalDateTime donationDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Getter
    @Setter
    private DonationStatus status;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    @Getter
    private byte[] receipt;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Donation(
            Long userId,
            BigDecimal amount,
            LocalDateTime donationDate,
            DonationStatus status,
            byte[] receipt) {
        this.userId = userId;
        this.amount = amount;
        this.donationDate = donationDate;
        this.status = status;
        this.receipt = receipt;
    }
}
