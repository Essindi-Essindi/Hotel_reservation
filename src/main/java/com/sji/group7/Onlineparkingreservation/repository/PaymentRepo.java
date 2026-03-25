package com.sji.group7.Onlineparkingreservation.repository;

import com.sji.group7.Onlineparkingreservation.model.Payment;
import com.sji.group7.Onlineparkingreservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepo extends JpaRepository<Payment,String> {

    List<Payment> findAllByUser_Id(int userId);

    Payment findByPaymentID(String paymentID);

    List<Payment> findPaymentsByUser_Id(int userId);

    Payment findPaymentByReservation(Reservation reservation);

    Payment findPaymentByReservation_ReservationID(Integer reservation_reservationID);

}
