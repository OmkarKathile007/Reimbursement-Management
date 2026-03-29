package com.reimbursement.controller;

import com.reimbursement.dto.request.CreateExpenseRequest;
import com.reimbursement.dto.response.ApiResponse;
import com.reimbursement.dto.response.ExpenseResponse;
import com.reimbursement.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/expenses")
@PreAuthorize("hasRole('EMPLOYEE')") // Strict Role-Based Access Control
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody CreateExpenseRequest request) {

        ExpenseResponse created = expenseService.createExpense(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Expense created successfully", created));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<ExpenseResponse>>> getMyExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ExpenseResponse> expenses = expenseService.getMyExpenses(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Expenses fetched successfully", expenses));
    }

    @GetMapping("/team")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<ExpenseResponse>>> getTeamExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ExpenseResponse> expenses = expenseService.getTeamExpenses(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Team expenses fetched successfully", expenses));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateStatus(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody com.reimbursement.dto.request.UpdateExpenseStatusRequest request) {

        ExpenseResponse updated = expenseService.updateExpenseStatus(id, request.getStatus());
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated to " + request.getStatus(), updated));
    }
}