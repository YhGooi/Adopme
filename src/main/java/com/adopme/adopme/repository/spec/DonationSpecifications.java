package com.adopme.adopme.repository.spec;

import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.DonationStatus;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DonationSpecifications {

    public static Specification<Donation> withFilters(
            DonationStatus status, LocalDateTime startDate, LocalDateTime endDate) {
        return (Root<Donation> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            predicates.add(
                    isBetweenDateRange(startDate, endDate)
                            .toPredicate(root, query, criteriaBuilder));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Creates a specification for filtering donations by date range
     *
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @return a specification that filters donations between the given date range
     */
    public static Specification<Donation> isBetweenDateRange(
            LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get("donationDate"), startDate),
                    criteriaBuilder.lessThanOrEqualTo(root.get("donationDate"), endDate));
        };
    }
}
