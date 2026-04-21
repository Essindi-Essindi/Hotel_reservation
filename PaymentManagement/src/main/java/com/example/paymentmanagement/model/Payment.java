package com.example.paymentmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    private String paymentID;

    private Date paymentDate;
    private Integer amount;

    @Enumerated(EnumType.STRING)
    private Method paymentMethod;

    private Integer reservationID;
    private Integer userID;
}
