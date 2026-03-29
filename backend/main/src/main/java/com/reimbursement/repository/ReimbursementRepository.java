package com.reimbursement.repository;

//package com.reimbursement.repository;

import com.reimbursement.entity.Reimbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, UUID> {
    List<Reimbursement> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
