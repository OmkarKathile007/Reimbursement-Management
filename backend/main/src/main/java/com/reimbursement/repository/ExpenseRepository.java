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
    Page<Expense> findByUserId(UUID userId, Pageable pageable);
}