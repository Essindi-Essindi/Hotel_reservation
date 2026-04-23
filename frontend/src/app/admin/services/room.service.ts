import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  roomId: string;
  roomName: string;
  hotelName: string;
  status?: string;
}

export interface NewRoomDto {
  hotelName: string;
  roomName: string;
}

@Injectable({ providedIn: 'root' })
export class RoomService {
  private base = '/room';

  constructor(private http: HttpClient) {}

  getAllForHotel(hotelName: string): Observable<Room[]> {
    const params = new HttpParams().set('hotelName', hotelName);
    return this.http.get<Room[]>(`${this.base}/all`, { params });
  }

  create(dto: NewRoomDto): Observable<Room> {
    return this.http.post<Room>(`${this.base}/add`, dto);
  }

  updateStatus(roomId: string): Observable<void> {
    const params = new HttpParams().set('roomId', roomId);
    return this.http.put<void>(`${this.base}/update`, null, { params });
  }

  delete(roomId: string): Observable<void> {
    const params = new HttpParams().set('roomId', roomId);
    return this.http.delete<void>(`${this.base}/delete`, { params });
  }
}