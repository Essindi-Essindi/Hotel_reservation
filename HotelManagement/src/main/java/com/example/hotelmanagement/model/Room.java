package com.example.hotelmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    private String roomID;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    private Hotel hotel;
}
