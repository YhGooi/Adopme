package com.adopme.adopme.dto.pet;

import com.adopme.adopme.model.Pet;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Mapper
public interface PetResponseMapper {
    PetResponseMapper INSTANCE = Mappers.getMapper(PetResponseMapper.class);

    @Mapping(target = "age", source = "dob", qualifiedByName = "calculateAge")
    PetResponse toPetResponse(Pet pet);

    @Named("calculateAge")
    default Double calculateAge(LocalDate dob) {
        if (dob == null) {
            return null;
        }
        return Math.round((ChronoUnit.DAYS.between(dob, LocalDate.now()) / 365.25) * 10.0) / 10.0;
    }
}
