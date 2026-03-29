package com.reimbursement.service;

//package com.reimbursement.service.impl;

import com.reimbursement.dto.request.CreateReimbursementRequest;
import com.reimbursement.entity.Reimbursement;
import com.reimbursement.entity.User;
import com.reimbursement.enums.ReimbursementStatus;
import com.reimbursement.repository.ReimbursementRepository;
import com.reimbursement.repository.UserRepository;
import com.reimbursement.service.ReimbursementService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReimbursementServiceImpl implements ReimbursementService {

    private final ReimbursementRepository reimbursementRepository;
    private final UserRepository userRepository;

    public ReimbursementServiceImpl(ReimbursementRepository reimbursementRepository, UserRepository userRepository) {
        this.reimbursementRepository = reimbursementRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    @Transactional
    public Reimbursement createReimbursement(CreateReimbursementRequest request) {
        User currentUser = getCurrentUser();

        // Securely pull currency from the company, not the frontend
        String companyCurrency = currentUser.getCompany().getDefaultCurrency();

        Reimbursement reimbursement = new Reimbursement(
                currentUser,
                request.getAmount(),
                companyCurrency,
                request.getDescription()
        );

        return reimbursementRepository.save(reimbursement);
    }

    @Override
    public List<Reimbursement> getMyReimbursements() {
        User currentUser = getCurrentUser();
        return reimbursementRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    @Override
    public List<Reimbursement> getTeamReimbursements() {
        User currentManager = getCurrentUser();

        // Ensure user is actually a manager or admin
        if (currentManager.getRole() == com.reimbursement.enums.Role.EMPLOYEE) {
            throw new RuntimeException("Access denied: You do not have managerial privileges.");
        }

        return reimbursementRepository.findByManagerIdOrderByCreatedAtDesc(currentManager.getId());
    }

    @Override
    @Transactional
    public Reimbursement updateReimbursementStatus(UUID reimbursementId, ReimbursementStatus newStatus) {
        User currentManager = getCurrentUser();

        Reimbursement reimbursement = reimbursementRepository.findById(reimbursementId)
                .orElseThrow(() -> new RuntimeException("Reimbursement not found"));

        // Security Check: Does this reimbursement belong to an employee managed by the current user?
        User expenseOwner = reimbursement.getUser();
        if (expenseOwner.getManager() == null || !expenseOwner.getManager().getId().equals(currentManager.getId())) {
            throw new RuntimeException("Access denied: You can only approve expenses for your direct reports.");
        }

        // Prevent updating already processed requests
        if (reimbursement.getStatus() != ReimbursementStatus.PENDING) {
            throw new RuntimeException("Cannot update an expense that is already " + reimbursement.getStatus());
        }

        reimbursement.setStatus(newStatus);
        return reimbursementRepository.save(reimbursement);
    }
}