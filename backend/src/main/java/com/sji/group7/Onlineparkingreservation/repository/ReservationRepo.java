package com.sji.group7.Onlineparkingreservation.repository;

import com.sji.group7.Onlineparkingreservation.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepo extends JpaRepository<Reservation,Integer> {
    List<Reservation> findReservationsByUser_Id(Integer userId);

    List<Reservation> findByDeletedFalse();

    List<Reservation> findReservationsByDeletedFalseAndUser_Id(int userId);

    List<Reservation> findByStateAndDeletedFalse(ReservationState state);

    List<Reservation> findReservationsByParkingLot(ParkingLot parkingLot);

    List<Reservation> findReservationsByParkingLot_ParkingLotID(String parkingSpotID);

    List<Reservation> findReservationsByStateAndEndTimeBefore(ReservationState state, LocalTime endTime);

    List<Reservation> findReservationsByState(ReservationState state);

    List<Reservation> findReservationsByStateAndEndTimeBeforeAndReservationEndDateIsLessThanEqual(ReservationState state,
                                                                                                  LocalTime endTime, LocalDate date);
}

