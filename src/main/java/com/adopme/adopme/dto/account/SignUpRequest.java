package com.adopme.adopme.dto.account;

//dto data transfer object
public class SignUpRequest {
    private String password;
    private String type;
    private String name;
    private Integer age;
    private String address;
    private String postCode;
    private String email;
    private String phoneNo;
    private String updatedBy;

    public SignUpRequest(String password, String type, String name, Integer age, String address, String postCode,
            String email, String phoneNo, String updatedBy) {
        this.password = password;
        this.type = type;
        this.name = name;
        this.age = age;
        this.address = address;
        this.postCode = postCode;
        this.email = email;
        this.phoneNo = phoneNo;
        this.updatedBy = updatedBy;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPostCode() {
        return postCode;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
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
