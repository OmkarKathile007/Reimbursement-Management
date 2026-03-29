package com.reimbursement.dto.response;

import com.reimbursement.entity.Expense;
import com.reimbursement.enums.ExpenseCategory;
import com.reimbursement.enums.ExpenseStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class ExpenseResponse {
    private UUID id;
    private BigDecimal originalAmount;
    private String originalCurrency;
    private BigDecimal convertedAmount;
    private ExpenseCategory category;
    private String description;
    private LocalDate expenseDate;
    private ExpenseStatus status;
    private LocalDateTime createdAt;
    // Add these fields to your existing ExpenseResponse.java
    private String employeeName;
    private String employeeEmail;

    public ExpenseResponse(Expense expense) {
        this.id = expense.getId();
        this.originalAmount = expense.getAmount();
        this.originalCurrency = expense.getCurrency();
        this.convertedAmount = expense.getConvertedAmount();
        this.category = expense.getCategory();
        this.description = expense.getDescription();
        this.expenseDate = expense.getExpenseDate();
        this.status = expense.getStatus();
        this.createdAt = expense.getCreatedAt();
        this.employeeName = expense.getUser().getName();
        this.employeeEmail = expense.getUser().getEmail();
    }

    // Getters
    public UUID getId() { return id; }
    public BigDecimal getOriginalAmount() { return originalAmount; }
    public String getOriginalCurrency() { return originalCurrency; }
    public BigDecimal getConvertedAmount() { return convertedAmount; }
    public ExpenseCategory getCategory() { return category; }
    public String getDescription() { return description; }
    public LocalDate getExpenseDate() { return expenseDate; }
    public ExpenseStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getEmployeeName() { return employeeName; }
    public String getEmployeeEmail() { return employeeEmail; }
}