package com.reimbursement.controller;

//package com.reimbursement.controller;

import com.reimbursement.dto.request.LoginRequest;
import com.reimbursement.dto.request.SignupRequest;
import com.reimbursement.dto.response.ApiResponse;
import com.reimbursement.entity.User;
import com.reimbursement.service.AuthService;
import com.reimbursement.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<User>> signup(@Valid @RequestBody SignupRequest request) {
        User user = authService.registerCompanyAndAdmin(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Company and Admin registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        Map<String, String> data = new HashMap<>();
        data.put("token", token);

        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", data));
    }
}
