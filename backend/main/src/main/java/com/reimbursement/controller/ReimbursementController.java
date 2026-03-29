package com.reimbursement.controller;

import com.reimbursement.dto.request.CreateReimbursementRequest;
import com.reimbursement.dto.response.ApiResponse;
import com.reimbursement.entity.Reimbursement;
import com.reimbursement.service.ReimbursementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reimbursements")
public class ReimbursementController {

    private final ReimbursementService reimbursementService;

    public ReimbursementController(ReimbursementService reimbursementService) {
        this.reimbursementService = reimbursementService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Reimbursement>> create(@Valid @RequestBody CreateReimbursementRequest request) {
        Reimbursement created = reimbursementService.createReimbursement(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reimbursement submitted successfully", created));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<Reimbursement>>> getMyReimbursements() {
        List<Reimbursement> list = reimbursementService.getMyReimbursements();
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched successfully", list));
    }
}