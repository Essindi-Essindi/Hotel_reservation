package com.example.hotelmanagement.service;

import com.example.hotelmanagement.dto.NewHotelDto;
import com.example.hotelmanagement.dto.UpdateHotelDto;
import com.example.hotelmanagement.model.Hotel;
import com.example.hotelmanagement.model.Location;
import com.example.hotelmanagement.repository.HotelRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepo  hotelRepo;

    @Autowired
    private LocationService locationService;

    public List<Hotel> getAllHotels() {
        return hotelRepo.findByIsDeletedFalse();
    }

    public void saveHotel(Hotel hotel) {
        hotelRepo.save(hotel);
    }

    public Hotel getHotelById(String hotelID) {
        return hotelRepo.findByHotelIDAndIsDeletedFalse(hotelID);
    }

    public Hotel createHotel(NewHotelDto  newHotelDto) {
        Hotel hotel = new Hotel();
        hotel.setHotelID(newHotelDto.getHotelName());

        Location location = locationService.getLocationByName(newHotelDto.getLocationName());
        hotel.setLocation(location);
        hotel.setTotalRooms(newHotelDto.getTotalRooms());
        hotel.setPrice(newHotelDto.getPrice());

        return hotelRepo.save(hotel);
    }

    public Hotel updateHotel(UpdateHotelDto hotel) {
        Hotel existingHotel = hotelRepo.getReferenceById(hotel.getHotelName());

        existingHotel.setTotalRooms(hotel.getTotalRooms() != null ? hotel.getTotalRooms() : existingHotel.getTotalRooms());
        Location location = locationService.getLocationByName(hotel.getLocationName());
        existingHotel.setLocation(location!= null ? location : existingHotel.getLocation());
        existingHotel.setPrice(hotel.getPrice() != null ? hotel.getPrice() : existingHotel.getPrice());

        return hotelRepo.save(existingHotel);
    }

    public void deleteHotel(String hotelID) {
        Hotel hotel = hotelRepo.getReferenceById(hotelID);

        hotel.setIsDeleted(Boolean.TRUE);
        hotel.setDeletedAt(LocalDateTime.now());

        hotelRepo.save(hotel);

    }
}
