package com.reimbursement.service;

import com.reimbursement.dto.request.CreateExpenseRequest;
import com.reimbursement.dto.response.ExpenseResponse;
import com.reimbursement.entity.Expense;
import com.reimbursement.entity.User;
import com.reimbursement.repository.ExpenseRepository;
import com.reimbursement.repository.UserRepository;
import com.reimbursement.service.CurrencyService;
import com.reimbursement.service.ExpenseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CurrencyService currencyService;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository,
                              UserRepository userRepository,
                              CurrencyService currencyService) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.currencyService = currencyService;
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    @Override
    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        User currentUser = getCurrentUser();

        // 1. Get the company's mandated base currency
        String companyCurrency = currentUser.getCompany().getDefaultCurrency();

        // 2. Convert the employee's submitted currency to the company currency
        BigDecimal convertedAmount = currencyService.convertCurrency(
                request.getAmount(),
                request.getCurrency(),
                companyCurrency
        );

        // 3. Build and save the Expense entity
        Expense expense = new Expense(
                currentUser,
                request.getAmount(),
                request.getCurrency().toUpperCase(),
                convertedAmount,
                request.getCategory(),
                request.getDescription(),
                request.getExpenseDate()
        );

        Expense savedExpense = expenseRepository.save(expense);

        return new ExpenseResponse(savedExpense);
    }

    @Override
    public Page<ExpenseResponse> getMyExpenses(int page, int size) {
        User currentUser = getCurrentUser();

        // Pagination: Sort by created date descending (newest first)
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Expense> expensePage = expenseRepository.findByUserId(currentUser.getId(), pageable);

        // Map the Entity Page to a DTO Page securely
        return expensePage.map(ExpenseResponse::new);
    }

    @Override
    public Page<ExpenseResponse> getTeamExpenses(int page, int size) {
        User currentManager = getCurrentUser();

        // Security: Ensure user has managerial rights
        if (currentManager.getRole() == com.reimbursement.enums.Role.EMPLOYEE) {
            throw new RuntimeException("Access denied: You do not have managerial privileges.");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Expense> teamExpenses = expenseRepository.findTeamExpenses(currentManager.getId(), pageable);

        return teamExpenses.map(ExpenseResponse::new);
    }

    @Override
    @Transactional
    public ExpenseResponse updateExpenseStatus(java.util.UUID expenseId, com.reimbursement.enums.ExpenseStatus newStatus) {
        User currentManager = getCurrentUser();

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // Security Check: Does this expense belong to an employee managed by the current user?
        User expenseOwner = expense.getUser();
        if (expenseOwner.getManager() == null || !expenseOwner.getManager().getId().equals(currentManager.getId())) {
            throw new RuntimeException("Access denied: You can only approve expenses for your direct reports.");
        }

        // Prevent updating already processed requests
        if (expense.getStatus() != com.reimbursement.enums.ExpenseStatus.PENDING) {
            throw new RuntimeException("Cannot update an expense that is already " + expense.getStatus());
        }

        expense.setStatus(newStatus);
        Expense updatedExpense = expenseRepository.save(expense);

        return new ExpenseResponse(updatedExpense);
    }
}