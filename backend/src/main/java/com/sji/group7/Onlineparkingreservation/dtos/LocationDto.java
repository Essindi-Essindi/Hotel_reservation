package com.sji.group7.Onlineparkingreservation.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationDto {

    private Integer locationID;
    private String locationName;
    private List<ParkingLotDto> parkingLots;
}
