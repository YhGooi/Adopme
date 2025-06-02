package com.adopme.adopme.dto.adoption;

import com.adopme.adopme.dto.pet.PetResponse;
import com.adopme.adopme.model.AdoptionRequest;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Mapper
public interface AdoptionRequestResponseMapper {

    AdoptionRequestResponseMapper INSTANCE = Mappers.getMapper(AdoptionRequestResponseMapper.class);

    AdoptionRequestUserResponse toAdoptionRequestUserResponse(
            AdoptionRequest adoptionRequest, Pet pet);

    AdoptionRequestAdminResponse toAdoptionRequestAdminResponse(
            AdoptionRequest adoptionRequest, Pet pet, User user);

    AdoptionRequestBasicResponse toAdoptionRequestBasicResponse(AdoptionRequest adoptionRequest);

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
