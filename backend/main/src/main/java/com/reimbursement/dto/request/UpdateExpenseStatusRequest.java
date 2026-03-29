package com.reimbursement.dto.request;

import com.reimbursement.enums.ExpenseStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateExpenseStatusRequest {

    @NotNull(message = "Status is required")
    private ExpenseStatus status;

    public UpdateExpenseStatusRequest() {}

    public ExpenseStatus getStatus() { return status; }
    public void setStatus(ExpenseStatus status) { this.status = status; }
}