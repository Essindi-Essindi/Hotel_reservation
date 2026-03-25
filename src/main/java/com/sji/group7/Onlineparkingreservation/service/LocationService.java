package com.sji.group7.Onlineparkingreservation.service;

import com.sji.group7.Onlineparkingreservation.dtos.LocationDto;
import com.sji.group7.Onlineparkingreservation.dtos.ParkingLotDto;
import com.sji.group7.Onlineparkingreservation.model.Location;
import com.sji.group7.Onlineparkingreservation.model.ParkingLot;
import com.sji.group7.Onlineparkingreservation.repository.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepo locationRepo;

    @Autowired
    private ParkingLotService parkingLotService;


    public List<Location> getAllLocations(){
        return locationRepo.findAll();
    }

    public Location saveLocation(Location location){
        return locationRepo.save(location);
    }

    public Location getLocationByLocationName(String locationName){
        return locationRepo.findLocationByLocationName(locationName);
    }

    public Location getLocationById(Integer id){
        return locationRepo.findById(id).get();
    }

    public LocationDto toDto(Location location){
        List<ParkingLot> lots = parkingLotService.getParkingLotsByLocation(location);
        List<ParkingLotDto> parkingLotDTOs = new ArrayList<>();

        for(ParkingLot parkingLot : lots){
            parkingLotDTOs.add(parkingLotService.toDto(parkingLot));
        }

        return LocationDto.builder()
                .locationID(location.getLocationID())
                .locationName(location.getLocationName())
                .parkingLots(parkingLotDTOs)
                .build();
    }
}
