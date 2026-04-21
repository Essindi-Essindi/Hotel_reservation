package com.sji.group7.Onlineparkingreservation.service;

import com.sji.group7.Onlineparkingreservation.model.Pricing;
import com.sji.group7.Onlineparkingreservation.repository.PricingRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class PricingService {

    @Autowired
    private PricingRepo pricingRepo;

    @Cacheable("hourlyRate") // used to cache the price during the session and stores it at the end
    //used to avoid reloading the page from the database after each update
    public double getHourlyRate() {

        //Gets the pricing from the database and use its value to calculate the cost
        Pricing pricing = pricingRepo.findById("HOURLY_RATE")
                .orElseThrow(() -> new RuntimeException("Pricing rate not configured"));
        return pricing.getValue();
    }

    @CacheEvict(value = "hourlyRate")
    @Transactional
    public Pricing updateHourlyRate(double hourlyRate) {
        Pricing pricing = pricingRepo.findById("HOURLY_RATE")
                .orElseGet(() -> new Pricing("Hourly_rate", 0));

        pricing.setValue(hourlyRate);
        return pricingRepo.save(pricing);
    }
}
