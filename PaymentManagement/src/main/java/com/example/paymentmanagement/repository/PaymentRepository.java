package com.example.paymentmanagement.repository;

import com.example.paymentmanagement.model.Payment;
import com.example.paymentmanagement.model.Method;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByUserID(Integer userID);
    List<Payment> findByReservationID(Integer reservationID);
    List<Payment> findByPaymentMethod(Method paymentMethod);
}
