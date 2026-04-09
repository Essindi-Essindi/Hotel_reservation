package com.sji.group7.Onlineparkingreservation.dtos;

import com.sji.group7.Onlineparkingreservation.model.Location;
import com.sji.group7.Onlineparkingreservation.model.ParkingSpot;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParkingLotDto {

    private String parkingLotID;
    private int totalSpots;
    private List<ParkingSpotDto> parkingSpots;

}
