package com.reimbursement.dto.request;

//package com.reimbursement.dto.request;

import com.reimbursement.enums.ReimbursementStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private ReimbursementStatus status;

    public UpdateStatusRequest() {}

    public ReimbursementStatus getStatus() { return status; }
    public void setStatus(ReimbursementStatus status) { this.status = status; }
}
