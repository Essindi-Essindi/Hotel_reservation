import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import {Location} from './location.service';

export interface Hotel {
  hotelID: string;
  location: Location;
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
  private base = environment.ApiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.base}/hotel/all`);
  }

  create(dto: NewHotelDto): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.base}/hotel/add`, dto);
  }

  update(dto: UpdateHotelDto): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.base}/hotel/update`, dto);
  }

  delete(hotelName: string): Observable<Hotel> {
    const params = new HttpParams().set('hotelName', hotelName);
    return this.http.delete<Hotel>(`${this.base}/hotel/delete`, { params });
  }
}
