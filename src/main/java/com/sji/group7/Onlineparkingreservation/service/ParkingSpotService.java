package com.sji.group7.Onlineparkingreservation.service;

import com.sji.group7.Onlineparkingreservation.dtos.ParkingSpotDto;
import com.sji.group7.Onlineparkingreservation.model.ParkingLot;
import com.sji.group7.Onlineparkingreservation.model.ParkingSpot;
import com.sji.group7.Onlineparkingreservation.repository.ParkingLotRepo;
import com.sji.group7.Onlineparkingreservation.repository.ParkingSpotRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParkingSpotService {

    @Autowired
    private ParkingSpotRepo parkingSpotRepo;

    public List<ParkingSpot> saveAll(List<ParkingSpot> parkingSpots) {
        return parkingSpotRepo.saveAll(parkingSpots);
    }

    public ParkingSpot save(ParkingSpot parkingSpot){
        return parkingSpotRepo.save(parkingSpot);
    }

    public List<ParkingSpot> getAllParkingSpots() {
        return parkingSpotRepo.findAll();
    }

    public Optional<ParkingSpot> getParkingSpot(String parkingSpotID) {
        return parkingSpotRepo.findById(parkingSpotID);
    }

    public ParkingSpot getParkingSpotById(String parkingSpotID) {
        return parkingSpotRepo.findById(parkingSpotID).get();
    }

    public ParkingSpotDto toDto(ParkingSpot parkingSpot) {
        return ParkingSpotDto.builder()
                .parkingSpotId(parkingSpot.getParkingSpotID())
                .parkingSpotStatus(parkingSpot.getStatus())
                .build();
    }
}
