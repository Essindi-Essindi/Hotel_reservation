package com.sji.group7.Onlineparkingreservation.dtos;

import com.sji.group7.Onlineparkingreservation.model.ParkingSpotStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParkingSpotDto {

    private String parkingSpotId;
    private ParkingSpotStatus parkingSpotStatus;

}
