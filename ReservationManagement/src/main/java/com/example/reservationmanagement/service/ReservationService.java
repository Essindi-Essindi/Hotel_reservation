package com.example.reservationmanagement.service;

import com.example.reservationmanagement.dto.NewReservationDto;
import com.example.reservationmanagement.model.Reservation;
import com.example.reservationmanagement.model.ReservationStatus;
import com.example.reservationmanagement.repository.ReservationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepo reservationRepo;

    public Reservation saveAndFlush (Reservation reservation) {
        return reservationRepo.saveAndFlush(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepo.findAllByDeletedIsFalse();
    }

    public List<Reservation> getReservationsByUserId(Integer userId){
        return reservationRepo.findReservationsByDeletedFalseAndUserId(userId);
    }

    public List<Reservation> getReservationsByRoomId(String roomId){
        return reservationRepo.findReservationsByDeletedFalseAndRoomId(roomId);
    }

    public List<Reservation> getReservations(ReservationStatus state, LocalTime endTime, LocalDate reservationEndDate){
        return reservationRepo.findReservationsByStateAndEndTimeBeforeAndReservationEndDateIsLessThanEqual(state, endTime, reservationEndDate);
    }

    public Reservation createReservation(NewReservationDto newReservationDto) {
        Reservation reservation = Reservation.builder()
                .DateIssued(LocalDateTime.now())
                .reservationStartDate(newReservationDto.getReservationStartDate())
                .reservationEndDate(newReservationDto.getReservationEndDate())
                .startTime(newReservationDto.getStartTime())
                .endTime(newReservationDto.getEndTime())
                .duration(newReservationDto.getDuration())
                .state(ReservationStatus.Confirmed)
                .deleted(Boolean.FALSE)
                .cost(newReservationDto.getCost())
                .userId(newReservationDto.getUserId())
                .hotelId(newReservationDto.getHotelId())
                .roomId(newReservationDto.getRoomId())
                .build();

        return reservationRepo.save(reservation);
    }

    public Reservation cancelReservation(Integer reservationId) {
        Reservation reservation = reservationRepo.findById(reservationId).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setState(ReservationStatus.Cancelled);
        reservation.setCancelledAt(LocalDateTime.now());
        return reservationRepo.save(reservation);
    }

    public Reservation deleteReservation(Integer reservationId) {
        Reservation reservation = reservationRepo.findById(reservationId).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setDeleted(Boolean.TRUE);
        reservation.setDeletedAt(LocalDateTime.now());
        return reservationRepo.save(reservation);
    }

}
