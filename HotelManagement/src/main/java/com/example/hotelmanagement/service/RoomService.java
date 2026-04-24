package com.example.hotelmanagement.service;

import com.example.hotelmanagement.dto.NewRoomDto;
import com.example.hotelmanagement.feign.ReservationManagementInterface;
import com.example.hotelmanagement.model.Hotel;
import com.example.hotelmanagement.model.ReservationStatus;
import com.example.hotelmanagement.model.Room;
import com.example.hotelmanagement.model.RoomStatus;
import com.example.hotelmanagement.repository.RoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepo roomRepo;

    @Autowired
    private HotelService hotelService;

    @Autowired
    private ReservationManagementInterface reservationManagement;

    public List<Room> getAllRoomsByHotelID(String hotelID){
        return roomRepo.findAllByHotel_HotelIDAndHotel_IsDeleted(hotelID, false);
    }

    public Room getRoomById(String roomID){
        return roomRepo.findById(roomID).get();
    }

    public void saveAndFlush(Room room){
        roomRepo.saveAndFlush(room);
    }

    public Room createRoom(NewRoomDto newRoomDto){

        Room newRoom = new Room();
        newRoom.setRoomID(newRoomDto.getRoomName());
        newRoom.setStatus(RoomStatus.AVAILABLE);
        Hotel hotel = hotelService.getHotelById(newRoomDto.getHotelName());
        if(hotel != null){
            hotel.setTotalRooms(hotel.getTotalRooms() + 1);
            newRoom.setHotel(hotel);
            hotelService.saveHotel(hotel);
        }
        return  roomRepo.save(newRoom);
    }

    public Room updateRoomStatus(String roomID){
        Room room = roomRepo.findById(roomID).orElseThrow(() -> new RuntimeException("Room not found"));
        room.setStatus(room.getStatus() != RoomStatus.AVAILABLE ? RoomStatus.AVAILABLE : RoomStatus.OCCUPIED);
        return roomRepo.save(room);
    }

    public void deleteRoom(String roomID){
        Room room = roomRepo.findById(roomID).orElseThrow(() -> new RuntimeException("Room not found"));

        List<Reservation> reservations = reservationManagement.getAllReservationsByRoomId(roomID).getBody();

        assert reservations != null;
        for(Reservation reservation : reservations){
            reservation.setState(ReservationStatus.Cancelled);
            reservation.setCancelledAt(LocalDateTime.now());
            reservationManagement.saveReservation(reservation);
        }

        roomRepo.delete(room);
    }


}
