package com.reimbursement.service;

import com.reimbursement.dto.request.CreateUserRequest;
import com.reimbursement.dto.response.UserResponse;
import com.reimbursement.entity.User;
import com.reimbursement.enums.Role;
import com.reimbursement.repository.UserRepository;
import com.reimbursement.service.AdminService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User getAuthenticatedAdmin() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        User admin = getAuthenticatedAdmin();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User newUser = new User(
                admin.getCompany(),
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );

        // Map Manager if provided
        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found"));

            // Security Check: Ensure manager belongs to the same company
            if (!manager.getCompany().getId().equals(admin.getCompany().getId())) {
                throw new RuntimeException("Cannot assign a manager from a different company");
            }
            if (manager.getRole() != Role.MANAGER && manager.getRole() != Role.ADMIN) {
                throw new RuntimeException("Assigned user is not a manager");
            }
            newUser.setManager(manager);
        }

        User savedUser = userRepository.save(newUser);
        return new UserResponse(savedUser);
    }

    @Override
    public List<UserResponse> getCompanyUsers() {
        User admin = getAuthenticatedAdmin();
        List<User> users = userRepository.findByCompanyIdOrderByNameAsc(admin.getCompany().getId());

        return users.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
}