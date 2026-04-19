package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepo extends JpaRepository<Hotel, String> {
}
