package com.reimbursement.service;

import com.reimbursement.dto.request.CreateUserRequest;
import com.reimbursement.dto.response.UserResponse;
import java.util.List;

public interface AdminService {
    UserResponse createUser(CreateUserRequest request);
    List<UserResponse> getCompanyUsers();
}