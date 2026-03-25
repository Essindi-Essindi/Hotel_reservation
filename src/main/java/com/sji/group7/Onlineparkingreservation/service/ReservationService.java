package com.sji.group7.Onlineparkingreservation.service;

import com.sji.group7.Onlineparkingreservation.model.Reservation;
import com.sji.group7.Onlineparkingreservation.model.ReservationState;
import com.sji.group7.Onlineparkingreservation.repository.ReservationRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepo reservationRepo;

    public Reservation saveReservation(Reservation reservation) {
        return reservationRepo.save(reservation);
    }

    public Optional<Reservation> getReservationById(Integer reservationID) {
        return reservationRepo.findById(reservationID);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepo.findAll();
    }

    public List<Reservation> getActiveReservations() {
        return reservationRepo.findByDeletedFalse();
    }

    public List<Reservation> getReservationsByUserId(int userId) {
        return reservationRepo.findReservationsByDeletedFalseAndUser_Id(userId);
    }

    @Transactional
    public void cancelReservation(Integer reservationId) {
        Reservation reservation = reservationRepo.findById(reservationId).get();
        reservation.setState(ReservationState.Cancelled);
        reservation.setCancelledAt(LocalDateTime.now());

        reservationRepo.save(reservation);
    }

    @Transactional
    public void deleteReservation(Integer reservationId) {
        Reservation reservation = reservationRepo.findById(reservationId).get();
        reservation.setDeleted(true);
        reservation.setDeletedAt(LocalDateTime.now());

        reservationRepo.save(reservation);
    }
}
