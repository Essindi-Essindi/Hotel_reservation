package com.example.hotelmanagement.service;

import com.example.hotelmanagement.feign.ReservationManagementInterface;
import com.example.hotelmanagement.model.ReservationStatus;
import com.example.hotelmanagement.model.Room;
import com.example.hotelmanagement.model.RoomStatus;
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
    private RoomService roomService;

    @Autowired
    private ReservationManagementInterface reservationManagement;

    @Scheduled(fixedRate = 5000*1000)
    @Transactional
    public void releaseExpiredRoomReservations(){
        try{
            List<Reservation> expiredReservations = reservationManagement.getReservationsForSchedule(
                    ReservationStatus.Confirmed, LocalTime.now(), LocalDate.now()).getBody();

            assert expiredReservations != null;
            if (expiredReservations.isEmpty()){
                log.info("No Expired Reservations Found");
            }

            expiredReservations.forEach(reservation -> {
                Room room = roomService.getRoomById(reservation.getRoomId());
                if (room != null){
                    room.setStatus(RoomStatus.AVAILABLE);
                    reservation.setState(ReservationStatus.Completed);
                    roomService.saveAndFlush(room);
                    reservationManagement.saveReservation(reservation);

                    log.info("Released {} Rooms", expiredReservations.size());
                }
            });
        } catch (Exception e) {
            log.error("Error while releasing expired Room Reservations", e);
        }
    }

    @Scheduled(fixedRate = 5*1000)
    @Transactional
    public void releaseCancelledRoomReservations(){
        try{
            List<Reservation> cancelledReservations = reservationManagement.getReservationsForSchedule(
                    ReservationStatus.Cancelled, LocalTime.now(), LocalDate.now()).getBody();

            assert cancelledReservations != null;
            if (cancelledReservations.isEmpty()){
                log.info("No Cancelled Reservations Found");
            }

            cancelledReservations.forEach(reservation -> {
                Room room = roomService.getRoomById(reservation.getRoomId());
                if (room != null){
                    room.setStatus(RoomStatus.AVAILABLE);
                    roomService.saveAndFlush(room);

                    log.info("Released {} cancelled Rooms", cancelledReservations.size());
                }
            });
        } catch (Exception e) {
            log.error("Error while releasing cancelled Room Reservations", e);
        }
    }
}
