package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.Pricing;
import com.example.hotelmanagement.repository.PricingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PricingService {

    @Autowired
    private PricingRepo pricingRepo;

    public List<Pricing> getPrices(){
        return pricingRepo.findAll();
    }

    public Pricing createPricing (Pricing pricing){
        return pricingRepo.save(pricing);
    }

    public Pricing updatePricing (Pricing pricing){
        Pricing existingPricing = pricingRepo.findById(pricing.getRate()).orElseThrow(() -> new RuntimeException("Pricing not found"));
        existingPricing.setValue(pricing.getValue());
        return pricingRepo.save(existingPricing);
    }

    public void deletePricing (String rate){
        Pricing existingPricing = pricingRepo.findById(rate).orElseThrow(() -> new RuntimeException("Pricing not found"));
        pricingRepo.delete(existingPricing);
    }
}
