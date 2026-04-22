package com.example.paymentmanagement.controller;

import com.example.paymentmanagement.dto.PaymentDto;
import com.example.paymentmanagement.model.Method;
import com.example.paymentmanagement.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // POST /api/payments → Create payment
    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@RequestBody PaymentDto dto) {
        return ResponseEntity.ok(paymentService.createPayment(dto));
    }

    // GET /api/payments → Get all payments
    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // GET /api/payments/{id} → Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable String id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    // GET /api/payments/user/{userID} → Get payments by user
    @GetMapping("/user/{userID}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByUser(@PathVariable Integer userID) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userID));
    }

    // GET /api/payments/reservation/{reservationID} → Get payments by reservation
    @GetMapping("/reservation/{reservationID}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByReservation(@PathVariable Integer reservationID) {
        return ResponseEntity.ok(paymentService.getPaymentsByReservation(reservationID));
    }

    // GET /api/payments/method/{method} → Get payments by method
    @GetMapping("/method/{method}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByMethod(@PathVariable Method method) {
        return ResponseEntity.ok(paymentService.getPaymentsByMethod(method));
    }

    // DELETE /api/payments/{id} → Delete payment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable String id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
