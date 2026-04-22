package com.example.paymentmanagement.dto;

import com.example.paymentmanagement.model.Method;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private String paymentID;
    private Date paymentDate;
    private Integer amount;
    private Method paymentMethod;
    private Integer reservationID;
    private Integer userID;
}