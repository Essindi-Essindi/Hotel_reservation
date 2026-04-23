package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.ReservationStatus;
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
public class Reservation {

    private Integer reservationID;

    private LocalDateTime currentDate;
    private LocalDate reservationStartDate;
    private LocalDate reservationEndDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer duration;

    private ReservationStatus state;

    private Boolean deleted = Boolean.FALSE;
    private Integer cost;

    private Integer userId;
    private String hotelId;
    private String roomId;

    private LocalDateTime cancelledAt;
    private LocalDateTime deletedAt;
}
