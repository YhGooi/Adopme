package com.adopme.adopme.repository;

import com.adopme.adopme.model.User;
import com.adopme.adopme.model.UserType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.passwordHash FROM User u WHERE u.email = :email")
    String findPasswordHashByEmail(@Param("email") String email);

    Optional<User> findByEmail(String email);

    List<User> findByType(UserType userType);

    Optional<User> findByPhoneNo(String phoneNo);

    boolean existsByEmail(String email); // Useful for validation
}
