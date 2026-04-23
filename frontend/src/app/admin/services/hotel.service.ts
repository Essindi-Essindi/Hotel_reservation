import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  hotelName: string;
  locationName: string;
  totalRooms: number;
  price: number;
}

export interface NewHotelDto {
  hotelName: string;
  totalRooms: number;
  locationName: string;
  price: number;
}

export interface UpdateHotelDto {
  hotelName: string;
  locationName: string;
  totalRooms: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  private base = '/hotel';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.base}/all`);
  }

  create(dto: NewHotelDto): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.base}/add`, dto);
  }

  update(dto: UpdateHotelDto): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.base}/update`, dto);
  }

  delete(hotelName: string): Observable<Hotel> {
    const params = new HttpParams().set('hotelName', hotelName);
    return this.http.delete<Hotel>(`${this.base}/delete`, { params });
  }
}