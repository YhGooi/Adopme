package com.adopme.adopme.dto.appointment;

import com.adopme.adopme.model.Appointment;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AppointmentResponseMapper {

    AppointmentResponseMapper INSTANCE = Mappers.getMapper(AppointmentResponseMapper.class);

    AppointmentResponse toAppointmentResponse(Appointment appointment);

    @Mapping(target = "id", source = "appointment.id")
    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "petName", source = "pet.name")
    @Mapping(target = "status", source = "appointment.status")
    AppointmentAdminResponse toAppointmentAdminResponse(
            Appointment appointment, User user, Pet pet);
}
