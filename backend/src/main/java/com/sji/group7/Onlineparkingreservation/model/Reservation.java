package com.sji.group7.Onlineparkingreservation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Reservation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reservationID;

    //The date and time at which the reservation is made
    @Column(name = "`current_date`")
    private LocalDateTime currentDate;

    //The date for which the reservation is made
    @Column(name = "`reservation_start_date`")
    private LocalDate reservationStartDate;

    @Column(name = "`reservation_end_date`")
    private LocalDate reservationEndDate;

    //The location of the spot
//    private String location;

    //The starting time of the reservation
    @Column(name = "`start_time`")
    private LocalTime startTime;

    //The time at which the reservation ends
    @Column(name = "`end_time`")
    private LocalTime endTime;

    private int duration;

    @Enumerated(EnumType.STRING)
    private ReservationState state;

    @Column(nullable = false,  columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean deleted = Boolean.FALSE;

    private int cost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parkingLot_id")
    private ParkingLot parkingLot;

    @ManyToOne
    @JoinColumn(name = "spot_id")
    private ParkingSpot parkingSpot;

    private LocalDateTime cancelledAt;
    private LocalDateTime deletedAt;
}
