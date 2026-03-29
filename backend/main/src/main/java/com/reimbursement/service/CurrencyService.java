package com.reimbursement.service;

import java.math.BigDecimal;

public interface CurrencyService {
    BigDecimal convertCurrency(BigDecimal amount, String fromCurrency, String toCurrency);
}