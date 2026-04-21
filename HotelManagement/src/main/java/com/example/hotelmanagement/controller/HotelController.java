package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.dto.NewHotelDto;
import com.example.hotelmanagement.dto.UpdateHotelDto;
import com.example.hotelmanagement.model.Hotel;
import com.example.hotelmanagement.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotel")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping("/all")
    public ResponseEntity<List<Hotel>> getAllHotels(){
        try{
            return new ResponseEntity<>(hotelService.getAllHotels(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Hotel> createHotel(@RequestBody NewHotelDto newHotel){
        try{
            if(newHotel.getTotalRooms() == null || newHotel.getLocationName() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(hotelService.createHotel(newHotel), HttpStatus.CREATED);
        }catch(Exception e){
            System.out.println("Error while creating hotel: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Hotel> updateHotel(@RequestBody UpdateHotelDto hotel){
        try{
            if(hotel.getHotelName() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(hotelService.updateHotel(hotel), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Hotel> deleteHotel(@RequestParam String hotelName){
        try {
            if(hotelName == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            hotelService.deleteHotel(hotelName);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
