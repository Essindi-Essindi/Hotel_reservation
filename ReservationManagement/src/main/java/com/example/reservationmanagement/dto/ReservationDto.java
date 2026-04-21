package com.example.reservationmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDto {

    private LocalDate reservationStartDate;
    private LocalDate reservationEndDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer duration;
    private Integer cost;

//    private RoomDto room;

}
