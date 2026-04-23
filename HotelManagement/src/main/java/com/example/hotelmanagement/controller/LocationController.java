package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.model.Location;
import com.example.hotelmanagement.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/all")
    public ResponseEntity<List<Location>> getAllLocations(){
        try{
            return new ResponseEntity<>(locationService.getAllLocations(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Location> createLocation(@RequestParam String locationName){
        try{
            if(locationName == null || locationName.isEmpty()){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(locationService.createLocation(locationName), HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Location> updateLocation(@RequestBody Location location){
        try{
            if(location.getLocationId() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(locationService.updateLocation(location), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @DeleteMapping("/delete/{locationID}")
    public ResponseEntity<?> deleteLocation(@PathVariable Integer locationID){
        try{
            if(locationID == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            locationService.deleteLocation(locationID);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
