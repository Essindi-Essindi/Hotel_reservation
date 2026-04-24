import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

export interface Location {
  locationId: number;
  locationName: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private base = environment.ApiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.base}/location/all`);
  }

  create(locationName: string): Observable<Location> {
    const params = new HttpParams().set('locationName', locationName);
    return this.http.post<Location>(`${this.base}/location/add`, null, { params });
  }

  update(location: Location): Observable<Location> {
    return this.http.put<Location>(`${this.base}/location/update`, location);
  }

  delete(locationId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/location/delete/${locationId}`);
  }
}
