package com.example.hotelmanagement.dto;

import com.example.hotelmanagement.model.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDto {

    private String roomId;
    private RoomStatus roomStatus;

}
