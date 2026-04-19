package com.example.reservationmanagement.repository;

import com.example.reservationmanagement.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepo extends JpaRepository<Reservation, Integer> {
}
