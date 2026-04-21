package com.example.hotelmanagement.feign;

import com.example.hotelmanagement.model.ReservationStatus;
import com.example.hotelmanagement.service.Reservation;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@FeignClient(value="ReservationManagement")
public interface ReservationManagementInterface {

    @GetMapping("/reservation/schedule")
    public ResponseEntity<List<Reservation>> getReservationsForSchedule(@RequestParam ReservationStatus state,
                                                                        @RequestParam LocalTime endTime, @RequestParam LocalDate reservationEndDate);

    @PostMapping("/reservation/save")
    public ResponseEntity<Reservation> saveReservation(@RequestBody Reservation reservation);

    @GetMapping("/reservation/all/room/{roomId}")
    public ResponseEntity<List<Reservation>> getAllReservationsByRoomId(@PathVariable String roomId);

    }
