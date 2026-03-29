package com.reimbursement.service.impl;

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
}