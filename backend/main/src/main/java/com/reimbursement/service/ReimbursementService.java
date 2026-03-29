package com.reimbursement.service;

import com.reimbursement.dto.request.CreateReimbursementRequest;
import com.reimbursement.entity.Reimbursement;
import com.reimbursement.enums.ReimbursementStatus;
import java.util.List;
import java.util.UUID;

public interface ReimbursementService {
    Reimbursement createReimbursement(CreateReimbursementRequest request);
    List<Reimbursement> getMyReimbursements();

    // NEW METHODS
    List<Reimbursement> getTeamReimbursements();
    Reimbursement updateReimbursementStatus(UUID reimbursementId, ReimbursementStatus newStatus);
}