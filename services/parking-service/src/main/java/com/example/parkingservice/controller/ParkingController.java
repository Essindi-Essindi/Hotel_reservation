package com.sji.group7.Onlineparkingreservation.controller.api;

import com.sji.group7.Onlineparkingreservation.dtos.LocationDto;
import com.sji.group7.Onlineparkingreservation.dtos.ParkingLotDto;
import com.sji.group7.Onlineparkingreservation.dtos.ParkingSpotDto;
import com.sji.group7.Onlineparkingreservation.model.*;
import com.sji.group7.Onlineparkingreservation.service.LocationService;
import com.sji.group7.Onlineparkingreservation.service.ParkingLotService;
import com.sji.group7.Onlineparkingreservation.service.ParkingSpotService;
import com.sji.group7.Onlineparkingreservation.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ParkingController {

    @Autowired
    private LocationService locationService;

    @Autowired
    private ParkingLotService parkingLotService;

    @Autowired
    private ParkingSpotService parkingSpotService;

    @Autowired
    private PricingService pricingService;

    //method to create a new location with its respective lot and various spots
    @PostMapping("/new-location")
    public ResponseEntity<LocationDto> saveNewParkingLot(@RequestBody LocationDto locationDTO) {
        LocationDto savedLocationDto = new LocationDto();
        List<ParkingLotDto> savedParkingLots = new ArrayList<>();
        Location foundLocation = locationService.getLocationByLocationName(locationDTO.getLocationName());

        //Create a new location
        Location location = new Location();

        if (foundLocation != null) {
            location = foundLocation;
        }else {
            location.setLocationName(locationDTO.getLocationName());
            Location savedLocation = locationService.saveLocation(location);
        }

        //Gets the parking lots from the dto and create then one by one
        List<ParkingLotDto> parkingLotsDTO =  locationDTO.getParkingLots();

        for (ParkingLotDto parkingLotDto : parkingLotsDTO) {

            ParkingLot parkingLot = new ParkingLot();
            parkingLot.setParkingLotID(parkingLotDto.getParkingLotID());
            parkingLot.setLocation(location);
            parkingLot.setTotalSpots(parkingLotDto.getTotalSpots());
            ParkingLot savedParkingLot = parkingLotService.save(parkingLot);

            //Assuming that the admin enters one parking spot at a time, all the spots in the list will obviously be
            //for the same parking lot knowing that their Ids are generated in the front end by appending the lot name
            //with some numbers which specifies the position of the spot
            List<ParkingSpotDto> parkingSpotsDTO = parkingLotDto.getParkingSpots();
            for (ParkingSpotDto parkingSpotDto : parkingSpotsDTO) {
                ParkingSpot parkingSpot = new ParkingSpot();
                parkingSpot.setParkingSpotID(parkingSpotDto.getParkingSpotId());
                parkingSpot.setStatus(ParkingSpotStatus.Available);
                parkingSpot.setParkingLot(parkingLot);
                ParkingSpot savedParkingSpot = parkingSpotService.save(parkingSpot);
            }

            savedParkingLots.add(parkingLotService.toDto(savedParkingLot));
        }

        //Converting everything back to the LocationDto inorder to send it as response entity
        savedLocationDto.setLocationID(location.getLocationID());
        savedLocationDto.setLocationName(location.getLocationName());
        savedLocationDto.setParkingLots(savedParkingLots);

        return ResponseEntity.ok(savedLocationDto);
    }

    @PostMapping("/update-hourly-rate")
    public ResponseEntity<Pricing> updateHourlyRate(@RequestBody Integer price){
        Pricing pricing = pricingService.updateHourlyRate(price);

        return ResponseEntity.ok(pricing);
    }

    @PostMapping("/update-location")
    public ResponseEntity<Location> updateLocation(@RequestBody Integer locationID,  @RequestBody String locationName) {
        Location location = locationService.getLocationById(locationID);
        location.setLocationName(locationName);
        Location savedLocation = locationService.saveLocation(location);
        return ResponseEntity.ok(savedLocation);

    }
}
