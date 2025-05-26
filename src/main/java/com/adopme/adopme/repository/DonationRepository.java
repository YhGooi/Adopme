package com.adopme.adopme.repository;

import com.adopme.adopme.model.Donation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository
        extends JpaRepository<Donation, Long>, JpaSpecificationExecutor<Donation> {

    // Find donations by userId, sorted by donationDate in descending order
    List<Donation> findByUserIdOrderByDonationDateDesc(Long userId);
}
