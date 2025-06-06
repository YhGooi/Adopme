package com.adopme.adopme.repository.spec;

import com.adopme.adopme.model.Appointment;
import com.adopme.adopme.model.AppointmentStatus;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AppointmentSpecifications {

    public static Specification<Appointment> withFilters(
            AppointmentStatus status, LocalDateTime startDate, LocalDateTime endDate) {
        return (Root<Appointment> root,
                CriteriaQuery<?> query,
                CriteriaBuilder criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            predicates.add(
                    isBetweenAppointmentDateTimeRange(startDate, endDate)
                            .toPredicate(root, query, criteriaBuilder));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Creates a specification for filtering appointments by appointment date time range
     *
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @return a specification that filters appointments between the given date range
     */
    public static Specification<Appointment> isBetweenAppointmentDateTimeRange(
            LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(
                            root.get("appointmentDateTime"), startDate),
                    criteriaBuilder.lessThanOrEqualTo(root.get("appointmentDateTime"), endDate));
        };
    }
}
