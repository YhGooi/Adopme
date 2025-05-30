package com.adopme.adopme.dto.pet;

import com.adopme.adopme.model.Pet;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PetResponseMapper {
    PetResponseMapper INSTANCE = Mappers.getMapper(PetResponseMapper.class);

    @Mapping(
            target = "age",
            expression =
                    "java(pet.getDob() != null ?"
                        + " Math.round((java.time.temporal.ChronoUnit.DAYS.between(pet.getDob(),"
                        + " java.time.LocalDate.now()) / 365.25) * 10.0) / 10.0 : null)")
    @Mapping(target = "species", source = "species.name")
    @Mapping(target = "breed", source = "breed.name")
    @Mapping(target = "status", source = "status.name")
    PetResponse toPetResponse(Pet pet);
}
