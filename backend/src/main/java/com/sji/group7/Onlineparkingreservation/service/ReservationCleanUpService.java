package com.sji.group7.Onlineparkingreservation.service;

import com.sji.group7.Onlineparkingreservation.model.ParkingSpot;
import com.sji.group7.Onlineparkingreservation.model.ParkingSpotStatus;
import com.sji.group7.Onlineparkingreservation.model.Reservation;
import com.sji.group7.Onlineparkingreservation.model.ReservationState;
import com.sji.group7.Onlineparkingreservation.repository.ParkingSpotRepo;
import com.sji.group7.Onlineparkingreservation.repository.ReservationRepo;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservationCleanUpService {

    private static final Logger log = LoggerFactory.getLogger(ReservationCleanUpService.class);
    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private ParkingSpotRepo parkingSpotRepo;

    @Scheduled(fixedRate = 5*1000)
    @Transactional
    public void releaseExpiredSpots(){

        try {
            log.info("Checking for expired reservations...");
            List<Reservation> expiredReservations = reservationRepo.
                    findReservationsByStateAndEndTimeBeforeAndReservationEndDateIsLessThanEqual(ReservationState.Confirmed,
                            LocalTime.now(), LocalDate.now());

            if (expiredReservations.isEmpty()) {
                log.info("No expired reservations found.");
            }

            expiredReservations.forEach(reservation -> {
                ParkingSpot spot = reservation.getParkingSpot();
                if (spot != null) {
                    spot.setStatus(ParkingSpotStatus.Available);
                    reservation.setState(ReservationState.Completed);
                    parkingSpotRepo.saveAndFlush(spot);
                    reservationRepo.saveAndFlush(reservation);

                    log.info("Released {} spots", expiredReservations.size());
                }
            });
        }catch (Exception e) {
            log.error("Task failed", e);  // ← Critical for debugging
        }

    }

    @Scheduled(fixedRate = 5*1000)
    @Transactional
    public void releaseCancelledSpots(){
        try {
            log.info("Checking for cancelled reservations...");
            List<Reservation> cancelledReservations = reservationRepo.
                    findReservationsByStateAndEndTimeBeforeAndReservationEndDateIsLessThanEqual(ReservationState.Cancelled,
                            LocalTime.now(), LocalDate.now());

            if (cancelledReservations.isEmpty()) {
                log.info("No cancelled reservations found.");
            }

            cancelledReservations.forEach(reservation -> {
                ParkingSpot spot = reservation.getParkingSpot();
                if (spot != null) {
                    spot.setStatus(ParkingSpotStatus.Available);
//                    reservation.setState(ReservationState.Completed);
                    parkingSpotRepo.saveAndFlush(spot);
//                    reservationRepo.saveAndFlush(reservation);

                    log.info("Released {} cancelled spots", cancelledReservations.size());
                }
            });

        }catch (Exception e) {
            log.error("Task failed", e);  // ← Critical for debugging
        }
    }

}
