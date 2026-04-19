package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.model.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PricingRepo extends JpaRepository<Pricing,String> {
}
