package com.reimbursement.service.impl;

import com.reimbursement.exception.CurrencyConversionException;
import com.reimbursement.service.CurrencyService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class CurrencyServiceImpl implements CurrencyService {

    private final RestTemplate restTemplate;
    private static final String API_URL = "https://api.exchangerate-api.com/v4/latest/";
    private static final int MAX_RETRIES = 3;

    public CurrencyServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public BigDecimal convertCurrency(BigDecimal amount, String fromCurrency, String toCurrency) {
        // Optimization: If currencies match, no API call needed.
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount.setScale(2, RoundingMode.HALF_UP);
        }

        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                String url = API_URL + fromCurrency.toUpperCase();
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);

                if (response != null && response.containsKey("rates")) {
                    Map<String, Double> rates = (Map<String, Double>) response.get("rates");

                    if (rates.containsKey(toCurrency.toUpperCase())) {
                        Double exchangeRate = rates.get(toCurrency.toUpperCase());
                        BigDecimal rate = BigDecimal.valueOf(exchangeRate);

                        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
                    } else {
                        throw new CurrencyConversionException("Target currency not supported: " + toCurrency);
                    }
                }
                throw new CurrencyConversionException("Invalid response from exchange rate API");

            } catch (Exception e) {
                attempt++;
                if (attempt >= MAX_RETRIES) {
                    throw new CurrencyConversionException(
                            "Failed to convert currency after " + MAX_RETRIES + " attempts. " + e.getMessage(), e);
                }
                // Backoff before retrying (exponential backoff is ideal, keeping it simple here)
                try {
                    Thread.sleep(500L * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }

        throw new CurrencyConversionException("Unexpected error during currency conversion");
    }
}