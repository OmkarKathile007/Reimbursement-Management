package com.reimbursement.repository;

//package com.reimbursement.repository;

import com.reimbursement.entity.Reimbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, UUID> {
    List<Reimbursement> findByUserIdOrderByCreatedAtDesc(UUID userId);
    @Query("SELECT r FROM Reimbursement r WHERE r.user.manager.id = :managerId ORDER BY r.createdAt DESC")
    List<Reimbursement> findByManagerIdOrderByCreatedAtDesc(@Param("managerId") UUID managerId);
}
