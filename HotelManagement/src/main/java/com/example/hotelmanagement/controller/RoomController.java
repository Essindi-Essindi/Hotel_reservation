package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.dto.NewRoomDto;
import com.example.hotelmanagement.model.Room;
import com.example.hotelmanagement.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/room")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRoomsForHotel(@RequestParam String hotelName){
        try{
            if(hotelName == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<Room> rooms = roomService.getAllRoomsByHotelID(hotelName);
            return new ResponseEntity<>(rooms, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Room> createRoom(@RequestBody NewRoomDto roomDto){
        try{
            if(roomDto == null || roomDto.getHotelName() == null || roomDto.getRoomName() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(roomService.createRoom(roomDto), HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateRoomStatus(@RequestParam String roomId){
        try{
            if(roomId == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>(roomService.updateRoomStatus(roomId), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteRoom(@RequestParam String roomId){
        try{
            if(roomId == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            roomService.deleteRoom(roomId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
     }
}
