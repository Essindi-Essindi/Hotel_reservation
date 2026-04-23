package com.example.reservationmanagement.controller;

import com.example.reservationmanagement.dto.NewReservationDto;
import com.example.reservationmanagement.model.Reservation;
import com.example.reservationmanagement.model.ReservationStatus;
import com.example.reservationmanagement.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    //check this again
    @GetMapping("/schedule")
    public ResponseEntity<List<Reservation>> getReservationsForSchedule(@RequestParam ReservationStatus state,
                                                                        @RequestParam LocalTime endTime,
                                                                        @RequestParam LocalDate reservationEndDate){
        try {
            if(state == null || endTime == null || reservationEndDate == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reservationService.getReservations(state, endTime, reservationEndDate), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Reservation> saveReservation(@RequestBody Reservation reservation){
        try{
            if(reservation == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reservationService.saveAndFlush(reservation), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        try {
            return new ResponseEntity<>(reservationService.getAllReservations(), HttpStatus.OK);
        }catch (Exception e){
            System.out.println("Error while fetching all reservations: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @GetMapping("/all/user/{userId}")
    public ResponseEntity<List<Reservation>> getAllReservationsByUserId(@PathVariable Integer userId) {
        try {
            if(userId == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reservationService.getReservationsByUserId(userId), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @GetMapping("/all/room")
    public ResponseEntity<List<Reservation>> getAllReservationsByRoomId(@RequestParam String roomId) {
        try {
            if(roomId == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reservationService.getReservationsByRoomId(roomId), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Reservation> createReservation(@RequestBody NewReservationDto reservation) {
        try {
//            System.out.println("Received reservation request: " + reservation);
            if( reservation.getUserId() == null || reservation.getHotelId() == null || reservation.getRoomId() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reservationService.createReservation(reservation), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PutMapping("/cancel/{reservationId}")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Integer reservationId) {
        try {
            if(reservationId == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reservationService.cancelReservation(reservationId), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @DeleteMapping("/delete/{reservationId}")
    public ResponseEntity<Reservation> deleteReservation(@PathVariable Integer reservationId) {
        try {
            if(reservationId == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(reservationService.deleteReservation(reservationId), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
