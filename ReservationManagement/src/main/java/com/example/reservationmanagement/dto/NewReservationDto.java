package com.example.reservationmanagement.dto;

import com.example.reservationmanagement.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewReservationDto {

    private LocalDateTime currentDate;
    private LocalDate reservationStartDate;
    private LocalDate reservationEndDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer duration;

//    private ReservationStatus state;
    private Integer cost;

    private Integer userId;
    private String hotelId;
    private String roomId;

//    private RoomDto room;

}
