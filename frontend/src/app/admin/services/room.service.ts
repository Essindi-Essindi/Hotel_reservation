import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import {Hotel} from './hotel.service';

export interface Room {
  roomID: string;
  // roomName: string;
  hotelName: Hotel;
  status?: string;
}

export interface NewRoomDto {
  hotelName: string;
  roomName: string;
}

@Injectable({ providedIn: 'root' })
export class RoomService {
  private base = environment.ApiUrl;

  constructor(private http: HttpClient) {}

  getAllForHotel(hotelName: string): Observable<Room[]> {
    const params = new HttpParams().set('hotelName', hotelName);
    return this.http.get<Room[]>(`${this.base}/room/all`, { params });
  }

  create(dto: NewRoomDto): Observable<Room> {
    return this.http.post<Room>(`${this.base}/room/add`, dto);
  }

  updateStatus(roomId: string): Observable<void> {
    const params = new HttpParams().set('roomId', roomId);
    return this.http.put<void>(`${this.base}/room/update`, null, { params });
  }

  delete(roomId: string): Observable<void> {
    const params = new HttpParams().set('roomId', roomId);
    return this.http.delete<void>(`${this.base}/room/delete`, { params });
  }
}
