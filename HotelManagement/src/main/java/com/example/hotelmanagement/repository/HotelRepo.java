package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepo extends JpaRepository<Hotel, String> {
    List<Hotel> findByIsDeletedFalse();
    Hotel findByHotelIDAndIsDeletedFalse(String hotelID);
}
