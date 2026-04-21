package com.sji.group7.Onlineparkingreservation.service;

import com.sji.group7.Onlineparkingreservation.dtos.ParkingLotDto;
import com.sji.group7.Onlineparkingreservation.dtos.ParkingSpotDto;
import com.sji.group7.Onlineparkingreservation.model.Location;
import com.sji.group7.Onlineparkingreservation.model.ParkingLot;
import com.sji.group7.Onlineparkingreservation.model.ParkingSpot;
import com.sji.group7.Onlineparkingreservation.repository.ParkingLotRepo;
import com.sji.group7.Onlineparkingreservation.repository.ParkingSpotRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ParkingLotService {

    @Autowired
    private ParkingLotRepo parkingLotRepo;

    @Autowired
    private ParkingSpotRepo parkingSpotRepo;

    @Autowired
    private ParkingSpotService parkingSpotService;

    public ParkingLot save(ParkingLot parkingLot) {
        return parkingLotRepo.save(parkingLot);
    }

    public List<ParkingLot> getAllParkingLots() {
        return parkingLotRepo.findAll();}

    public Optional<ParkingLot> getParkingLotById(String id) {
        return parkingLotRepo.findById(id);
    }

    public List<ParkingLot> getParkingLotsByLocation(Location location) {
        return parkingLotRepo.findParkingLotsByLocation(location);
    }

    public ParkingLotDto toDto(ParkingLot parkingLot) {
        List<ParkingSpot> spots = parkingSpotRepo.findParkingSpotsByParkingLot(parkingLot);
        List<ParkingSpotDto> spotDTO = new ArrayList<>();
        for (ParkingSpot spot : spots) {
            spotDTO.add(parkingSpotService.toDto(spot));
        }

        return ParkingLotDto.builder()
                .parkingLotID(parkingLot.getParkingLotID())
                .totalSpots(spotDTO.size())
                .parkingSpots(spotDTO)
                .build();
    }

}
