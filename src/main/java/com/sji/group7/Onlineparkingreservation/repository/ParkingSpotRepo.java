package com.sji.group7.Onlineparkingreservation.repository;

import com.sji.group7.Onlineparkingreservation.model.ParkingLot;
import com.sji.group7.Onlineparkingreservation.model.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParkingSpotRepo extends JpaRepository<ParkingSpot,String> {

    List<ParkingSpot> findParkingSpotsByParkingLot(ParkingLot parkingLot);

    List<ParkingSpot> findParkingSpotsByParkingLot_ParkingLotID(String parkingLotParkingLotID);

    ParkingSpot findParkingSpotByParkingSpotID(String parkingSpotID);

}
