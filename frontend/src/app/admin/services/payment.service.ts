import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentDto, PaymentMethod } from '../models/payment.model';
import {environment} from '../../../environments/environment';

const BASE = environment.ApiUrl;

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  /** POST /api/payments */
  createPayment(dto: PaymentDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(`${BASE}/api/payments`, dto);
  }

  /** GET /api/payments */
  getAllPayments(): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${BASE}/api/payments`);
  }

  /** GET /api/payments/{id} */
  getPaymentById(id: string): Observable<PaymentDto> {
    return this.http.get<PaymentDto>(`${BASE}/api/payments/${id}`);
  }

  /** GET /api/payments/user/{userID} */
  getPaymentsByUser(userID: number): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${BASE}/api/payments/user/${userID}`);
  }

  /** GET /api/payments/reservation/{reservationID} */
  getPaymentsByReservation(reservationID: number): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${BASE}/api/payments/reservation/${reservationID}`);
  }

  /** GET /api/payments/method/{method} */
  getPaymentsByMethod(method: PaymentMethod): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${BASE}/api/payments/method/${method}`);
  }

  /** DELETE /api/payments/{id} */
  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/api/payments/${id}`);
  }
}
