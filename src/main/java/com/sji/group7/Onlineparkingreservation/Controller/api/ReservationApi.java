package com.sji.group7.Onlineparkingreservation.controller.api;

import com.sji.group7.Onlineparkingreservation.dtos.LocationDto;
import com.sji.group7.Onlineparkingreservation.dtos.ReservationDto;
import com.sji.group7.Onlineparkingreservation.model.*;
import com.sji.group7.Onlineparkingreservation.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class ReservationApi {

    @Autowired
    private ParkingLotService parkingLotService;

    @Autowired
    private ParkingSpotService parkingSpotService;

    @Autowired
    private LocationService locationService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @GetMapping("/get-all-parkingSpots")
    public ResponseEntity<List<LocationDto>> getAllParkingLots() {
        List<Location> locations = locationService.getAllLocations();
        List<LocationDto> locationDTOs = new ArrayList<>();

        for (Location location : locations) {
            locationDTOs.add(locationService.toDto(location));
        }
        return ResponseEntity.ok(locationDTOs);
    }

    //To be modified to fit what is gotten from the front end
    //i.e. the endpoint and the request body
    //and finally add the remaining fields for a reservation to be complete
    @PostMapping("/add-reservation/{userId}")
    public ResponseEntity<Reservation> reserveParkingLot(@RequestBody ReservationDto reservation, @PathVariable int userId) {
        Reservation reserve = new Reservation();
        ParkingSpot parkingSpot = parkingSpotService.getParkingSpotById(reservation.getParkingSpot().getParkingSpotId());
        Optional<ParkingLot> parkingLot = parkingLotService.getParkingLotById(parkingSpot.getParkingLot().getParkingLotID());

        reserve.setCurrentDate(LocalDateTime.now());
        reserve.setReservationStartDate(reservation.getReservationStartDate());
        reserve.setReservationEndDate(reservation.getReservationEndDate());
        reserve.setStartTime(reservation.getStartTime());
        reserve.setEndTime(reservation.getEndTime());
        reserve.setDuration(reservation.getDuration());
        reserve.setState(ReservationState.Confirmed);
        reserve.setCost(reservation.getCost());
        reserve.setUser(userService.getUserById(userId));
        reserve.setParkingSpot(parkingSpot);
        reserve.setParkingLot(parkingLot.get());

        Reservation reserved = reservationService.saveReservation(reserve);
        parkingSpot.setStatus(ParkingSpotStatus.Occupied);
        parkingSpotService.save(parkingSpot);
        return ResponseEntity.ok(reserved);
    }

    //used to cancel a reservation but needs to be checked when the front end will be available
    //It needs to updated so that it takes the userId and reservationId as path parameters before the operation is
    //performed correctly
    @PatchMapping("/cancel-reservation/{reservationId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Integer reservationId) {

       reservationService.cancelReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    //Delete is done by simply changing the delete attribute to true so that the user will not see any reservation
    //he has deleted but the reservations stay stored in the database
    //It still has to be fixed so that it takes the reservationId and userId as path parameters and delete from the
    //respective user's list of reservation
    @DeleteMapping("/delete-reservation")
    public ResponseEntity<Void> deleteReservation(@RequestBody Integer reservationId) {

        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    //this get mapping is for the users to view just the reservations
    // they have not deleted from their history
    //it still has to be fixed so that it fetches just for a particular user
    @GetMapping("/all-reservations/{userId}")
    public ResponseEntity<List<Reservation>> getAllReservations(@PathVariable int userId) {

        List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
        return ResponseEntity.ok(reservations);
    }
}
