package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.model.Pricing;
import com.example.hotelmanagement.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pricing")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    @GetMapping("/all")
    public ResponseEntity<List<Pricing>> getPricing (){
        try{
            return new ResponseEntity<>(pricingService.getPrices(), HttpStatus.OK);
        }catch(Exception ex){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Pricing> createPricing (@RequestBody Pricing pricing){
        try{
            if(pricing.getRate() == null || pricing.getValue() <= 0){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(pricingService.createPricing(pricing), HttpStatus.CREATED);
        }catch(Exception ex){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Pricing> updatePricing (@RequestBody Pricing pricing){
        try{
            if(pricing.getRate() == null || pricing.getValue() <= 0){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(pricingService.updatePricing(pricing), HttpStatus.OK);
        }catch(Exception ex){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @DeleteMapping("/delete/{rate}")
    public ResponseEntity<?> deletePricing(@PathVariable String rate){
        try{
            if(rate == null ){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            pricingService.deletePricing(rate);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(Exception ex){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
