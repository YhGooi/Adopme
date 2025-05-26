package com.adopme.adopme.dto.user;

import com.adopme.adopme.model.HousingType;
import com.adopme.adopme.model.PettingExperience;
import com.adopme.adopme.model.UserType;

import java.time.LocalDate;

public class SignUpRequest {
    private String password;
    private UserType type;
    private String name;
    private LocalDate dateOfBirth;
    private String address;
    private HousingType housingType;
    private String occupation;
    private PettingExperience pettingExperience;
    private int currentPets;
    private String email;
    private String phoneNo;
    private String updatedBy;

    public SignUpRequest() {}

    public SignUpRequest(
            String password,
            UserType type,
            String name,
            LocalDate dateOfBirth,
            String address,
            String postCode,
            HousingType housingType,
            String occupation,
            PettingExperience pettingExperience,
            int currentPets,
            String email,
            String phoneNo,
            String updatedBy) {
        this.password = password;
        this.type = type;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.housingType = housingType;
        this.occupation = occupation;
        this.pettingExperience = pettingExperience;
        this.currentPets = currentPets;
        this.email = email;
        this.phoneNo = phoneNo;
        this.updatedBy = updatedBy;
    }

    // Getters and Setters

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserType getType() {
        return type;
    }

    public void setType(UserType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public HousingType getHousingType() {
        return housingType;
    }

    public void setHousingType(HousingType housingType) {
        this.housingType = housingType;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public PettingExperience getPettingExperience() {
        return pettingExperience;
    }

    public void setPettingExperience(PettingExperience pettingExperience) {
        this.pettingExperience = pettingExperience;
    }

    public int getCurrentPets() {
        return currentPets;
    }

    public void setCurrentPets(int currentPets) {
        this.currentPets = currentPets;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}