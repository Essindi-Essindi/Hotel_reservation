package com.sji.group7.Onlineparkingreservation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
//A class to make the cost of parking per hour global
// and fixed until changed by the admin
public class Pricing {

    @Id
    private String rate;
    private double value; //The amount to be charged per
    // hour. For now, it is 100
}
