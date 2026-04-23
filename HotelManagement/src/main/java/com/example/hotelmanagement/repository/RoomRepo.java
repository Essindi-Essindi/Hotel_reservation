package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepo extends JpaRepository<Room,String> {
    List<Room> findAllByHotel_HotelIDAndHotel_IsDeleted(String hotelID, Boolean isDeleted);
}
