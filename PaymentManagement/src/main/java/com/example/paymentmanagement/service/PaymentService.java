package com.example.paymentmanagement.service;

import com.example.paymentmanagement.dto.PaymentDto;
import com.example.paymentmanagement.model.Method;
import com.example.paymentmanagement.model.Payment;
import com.example.paymentmanagement.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Create payment
    public PaymentDto createPayment(PaymentDto dto) {
    Payment payment = Payment.builder()
            
            .paymentDate(new Date())
            .amount(dto.getAmount())
            .paymentMethod(dto.getPaymentMethod())
            .reservationID(dto.getReservationID())
            .userID(dto.getUserID())
            .build();

    return toDto(paymentRepository.save(payment));
}

    // Get payment by ID
    public PaymentDto getPaymentById(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return toDto(payment);
    }

    // Get all payments
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream().map(this::toDto)
                .collect(Collectors.toList());
    }

    // Get payments by user
    public List<PaymentDto> getPaymentsByUser(Integer userID) {
        return paymentRepository.findByUserID(userID)
                .stream().map(this::toDto)
                .collect(Collectors.toList());
    }

    // Get payments by reservation
    public List<PaymentDto> getPaymentsByReservation(Integer reservationID) {
        return paymentRepository.findByReservationID(reservationID)
                .stream().map(this::toDto)
                .collect(Collectors.toList());
    }

    // Get payments by method
    public List<PaymentDto> getPaymentsByMethod(Method method) {
        return paymentRepository.findByPaymentMethod(method)
                .stream().map(this::toDto)
                .collect(Collectors.toList());
    }

    // Delete payment
    public void deletePayment(String id) {
        if (!paymentRepository.existsById(id)) {
            throw new RuntimeException("Payment not found with id: " + id);
        }
        paymentRepository.deleteById(id);
    }

    // Convert to DTO
    private PaymentDto toDto(Payment payment) {
        return PaymentDto.builder()
                .paymentID(payment.getPaymentID())
                .paymentDate(payment.getPaymentDate())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .reservationID(payment.getReservationID())
                .userID(payment.getUserID())
                .build();
    }
}
