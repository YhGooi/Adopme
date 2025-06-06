package com.adopme.adopme.repository.spec;

import com.adopme.adopme.model.AdoptionRequest;
import com.adopme.adopme.model.AdoptionRequestStatus;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AdoptionRequestSpecifications {

    public static Specification<AdoptionRequest> withFilters(
            AdoptionRequestStatus status, LocalDateTime startDate, LocalDateTime endDate) {
        return (Root<AdoptionRequest> root,
                CriteriaQuery<?> query,
                CriteriaBuilder criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            predicates.add(
                    isBetweenSubmissionDateRange(startDate, endDate)
                            .toPredicate(root, query, criteriaBuilder));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Creates a specification for filtering adoption requests by submission date range
     *
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @return a specification that filters adoption requests between the given date range
     */
    public static Specification<AdoptionRequest> isBetweenSubmissionDateRange(
            LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get("submissionDate"), startDate),
                    criteriaBuilder.lessThanOrEqualTo(root.get("submissionDate"), endDate));
        };
    }
}
