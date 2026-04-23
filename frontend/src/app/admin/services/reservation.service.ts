import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly base = '/reservation';

  constructor(private http: HttpClient) {}

  /** GET /reservation/all */
  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/all`);
  }

  /** GET /reservation/all/user/{userId} */
  getAllByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/all/user/${userId}`);
  }

  /** GET /reservation/all/room?roomId=... */
  getAllByRoom(roomId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/all/room`, {
      params: { roomId },
    });
  }

  /** PUT /reservation/cancel/{reservationId} */
  cancel(reservationId: number): Observable<void> {
    return this.http.put<void>(`${this.base}/cancel/${reservationId}`, null);
  }

  /** DELETE /reservation/delete/{reservationId} */
  delete(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${reservationId}`);
  }
}