package com.example.reservationmanagement.repository;

import com.example.reservationmanagement.model.Reservation;
import com.example.reservationmanagement.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepo extends JpaRepository<Reservation, Integer> {
    List<Reservation> findAllByDeletedIsFalse();
    List<Reservation> findReservationsByDeletedFalseAndUserId(Integer userId);
    List<Reservation> findReservationsByDeletedFalseAndRoomId(String roomId);
    List<Reservation> findReservationsByStateAndEndTimeBeforeAndReservationEndDateIsLessThanEqual(
            ReservationStatus state, LocalTime endTime, LocalDate reservationEndDate);
}
