package com.reimbursement.repository;

import com.reimbursement.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    // Supports Pagination and sorts by the provided Pageable parameter
    // NEW: Fetch paginated expenses for employees reporting to a specific manager
    @org.springframework.data.jpa.repository.Query(
            "SELECT e FROM Expense e WHERE e.user.manager.id = :managerId ORDER BY e.createdAt DESC"
    )
    Page<Expense> findTeamExpenses(@org.springframework.data.repository.query.Param("managerId") UUID managerId, Pageable pageable);
    Page<Expense> findByUserId(UUID userId, Pageable pageable);
}