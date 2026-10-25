package com.nexora.api.repository;

import com.nexora.api.model.StudentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRecordRepository extends JpaRepository<StudentRecord,String> {
    Optional<StudentRecord> findByRegisterNumber(String registerNumber);
    Optional<StudentRecord> findByEmailIgnoreCase(String email);
}
