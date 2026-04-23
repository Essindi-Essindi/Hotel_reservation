package com.example.hotelmanagement.dto;

import com.example.hotelmanagement.model.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateHotelDto {

    private String hotelName;
    private String locationName;
    private Integer totalRooms;
    private Float price;

}
