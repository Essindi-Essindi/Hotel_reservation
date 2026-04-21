package com.example.hotelmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewHotelDto {

    private String hotelName;
    private Integer totalRooms;
    private String locationName;

//    private List<NewRoomDto> rooms;
}
