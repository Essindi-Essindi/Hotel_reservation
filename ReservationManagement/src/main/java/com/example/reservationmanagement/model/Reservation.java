package com.example.reservationmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reservationID;

    private LocalDateTime currentDate;
    private LocalDate reservationStartDate;
    private LocalDate reservationEndDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer duration;

    @Enumerated(EnumType.STRING)
    private ReservationStatus state;

    private Boolean deleted = Boolean.FALSE;
    private Integer cost;

    private Integer userId;
    private Integer hotelId;
    private Integer hotelRoomId;

    private LocalDateTime cancelledAt;
    private LocalDateTime deletedAt;

}
