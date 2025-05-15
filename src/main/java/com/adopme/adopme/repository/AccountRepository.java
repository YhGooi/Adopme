package com.adopme.adopme.repository;

import com.adopme.adopme.model.Account;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, Long> {
  // List<Account> findById(long id);

  @Query("SELECT a.passwordHash FROM Account a WHERE a.email = :email")
  String findPasswordHashByEmail(@Param("email") String email);

  Optional<Account> findByEmail(String email);

  List<Account> findByType(String type);

  Optional<Account> findByPhoneNo(String phoneNo);

  boolean existsByEmail(String email); // Useful for validation
}
