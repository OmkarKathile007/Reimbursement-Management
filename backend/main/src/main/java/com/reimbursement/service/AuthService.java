package com.reimbursement.service;

//import com.reimbursement.dto.request.SignupRequest;
import com.reimbursement.dto.request.SignupRequest;
import com.reimbursement.entity.Company;
import com.reimbursement.entity.User;
import com.reimbursement.enums.Role;
import com.reimbursement.repository.CompanyRepository;
import com.reimbursement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AuthService  {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    // Explicit Constructor Injection (No Lombok)
    public AuthService(UserRepository userRepository,
                       CompanyRepository companyRepository,
                       PasswordEncoder passwordEncoder,
                       RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.restTemplate = restTemplate;
    }


    @Transactional
    public User registerCompanyAndAdmin(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // 1. Fetch Currency via RestCountries API
        String currency = fetchCurrencyForCountry(request.getCountry());

        // 2. Create Company
        Company company = new Company(
                request.getCompanyName(),
                request.getCountry(),
                currency
        );
        companyRepository.save(company);

        // 3. Create Admin User
        User adminUser = new User(
                company,
                request.getAdminName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.ADMIN
        );

        return userRepository.save(adminUser);
    }

    private String fetchCurrencyForCountry(String countryName) {
        try {
            String url = "https://restcountries.com/v3.1/name/" + countryName + "?fields=currencies";
            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);
            if (response != null && !response.isEmpty()) {
                Map<String, Object> currencies = (Map<String, Object>) response.get(0).get("currencies");
                return currencies.keySet().iterator().next();
            }
        } catch (Exception e) {
            return "USD"; // Fallback currency
        }
        return "USD";
    }
}