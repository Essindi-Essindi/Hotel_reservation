package com.example.hotelmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    private String hotelID;

    @ManyToOne
    private Location location;

    private Boolean isDeleted = Boolean.FALSE;
    private LocalDateTime deletedAt;

    private Integer totalRooms;
    private Float price;

}
