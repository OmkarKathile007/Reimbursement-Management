package com.reimbursement.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String country;
    private String defaultCurrency;

    // Default Constructor (Required by JPA)
    public Company() {}

    // Constructor for creation
    public Company(String name, String country, String defaultCurrency) {
        this.name = name;
        this.country = country;
        this.defaultCurrency = defaultCurrency;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getDefaultCurrency() { return defaultCurrency; }
    public void setDefaultCurrency(String defaultCurrency) { this.defaultCurrency = defaultCurrency; }
}