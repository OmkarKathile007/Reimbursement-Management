package com.reimbursement.service;

import com.reimbursement.dto.request.CreateExpenseRequest;
import com.reimbursement.dto.response.ExpenseResponse;
import org.springframework.data.domain.Page;

public interface ExpenseService {
    ExpenseResponse createExpense(CreateExpenseRequest request);
    Page<ExpenseResponse> getMyExpenses(int page, int size);
    Page<ExpenseResponse> getTeamExpenses(int page, int size);
    ExpenseResponse updateExpenseStatus(java.util.UUID expenseId, com.reimbursement.enums.ExpenseStatus newStatus);
}