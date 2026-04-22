import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewReservationDto {
  currentDate: string;
  reservationStartDate: string;
  reservationEndDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  userId: number;
  hotelId: string;
  roomId: string;
}

export interface Reservation {
  reservationID: number;
  DateIssued: string;
  reservationStartDate: string;
  reservationEndDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  state: 'Confirmed' | 'Cancelled' | 'Completed';
  deleted: boolean;
  cost: number;
  userId: number;
  hotelId: string;
  roomId: string;
  cancelledAt: string | null;
  deletedAt: string | null;
}

export interface Location {
  locationId: number;
  locationName: string;
}

export interface Hotel {
  hotelID: string;
  location: Location;
  isDeleted: boolean;
  deletedAt: string | null;
  totalRooms: number;
  price: number | null;
}

export interface Room {
  roomID: string;
  status: 'AVAILABLE' | 'OCCUPIED';
  hotel: Hotel;
}

export interface NewRoomDto {
  hotelName: string;
  roomName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ============ HOTEL ENDPOINTS ============
  
  // Get all hotels - GET /all
  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels/all`);
  }

  // Create hotel - POST /add
  createHotel(newHotel: any): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.apiUrl}/hotels/add`, newHotel);
  }

  // Update hotel - PUT /update
  updateHotel(hotel: any): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.apiUrl}/hotels/update`, hotel);
  }

  // Delete hotel - DELETE /delete
  deleteHotel(hotelName: string): Observable<Hotel> {
    return this.http.delete<Hotel>(`${this.apiUrl}/hotels/delete?hotelName=${hotelName}`);
  }

  // ============ ROOM ENDPOINTS ============
  
  // Get all rooms for a hotel - GET /all?hotelName=xxx
  getAllRoomsForHotel(hotelName: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms/all?hotelName=${hotelName}`);
  }

  // Update room status - PUT /update?roomId=xxx
  updateRoomStatus(roomId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rooms/update?roomId=${roomId}`, {});
  }

  // Delete room - DELETE /delete?roomId=xxx
  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/rooms/delete?roomId=${roomId}`);
  }

  // Create room - POST /add
  createRoom(roomDto: NewRoomDto): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/rooms/add`, roomDto);
  }

  // ============ RESERVATION ENDPOINTS ============
  
  // Get all reservations (admin) - GET /all
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations/all`);
  }

  // Get reservations by user ID - GET /all/user/{userId}
  getAllReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations/all/user/${userId}`);
  }

  // Cancel reservation - PUT /cancel/{reservationId}
  cancelReservation(reservationId: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/cancel/${reservationId}`, {});
  }

  // Delete reservation (soft delete) - DELETE /delete/{reservationId}
  deleteReservation(reservationId: number): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.apiUrl}/reservations/delete/${reservationId}`);
  }

  // Create reservation - POST /add
  createReservation(reservation: NewReservationDto): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/reservations/add`, reservation);
  }
}