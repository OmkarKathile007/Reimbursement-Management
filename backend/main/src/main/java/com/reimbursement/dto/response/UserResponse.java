package com.reimbursement.dto.response;

import com.reimbursement.entity.User;
import com.reimbursement.enums.Role;
import java.util.UUID;

public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private String managerName;

    public UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.managerName = user.getManager() != null ? user.getManager().getName() : "None";
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public String getManagerName() { return managerName; }
}