package com.adopme.adopme.dto.appointment;

import com.adopme.adopme.model.Appointment;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AppointmentResponseMapper {

    AppointmentResponseMapper INSTANCE = Mappers.getMapper(AppointmentResponseMapper.class);

    AppointmentResponse toAppointmentResponse(Appointment appointment);
}
