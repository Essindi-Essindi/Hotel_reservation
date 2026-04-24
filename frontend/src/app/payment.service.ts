import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../environments/environment';

export type PaymentMethod = 'CreditCard'| 'Paypal' | 'MobileMoney' | 'OrangeMoney';

export interface PaymentDto {
  paymentID: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reservationID: number;
  userID: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private BaseUrl = environment.ApiUrl;
  private apiUrl = `${this.BaseUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  createPayment(payment: PaymentDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(this.apiUrl, payment);
  }

  getAllPayments(): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(this.apiUrl);
  }

  getPaymentById(id: string): Observable<PaymentDto> {
    return this.http.get<PaymentDto>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByUser(userId: number): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  getPaymentsByReservation(reservationId: number): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}/reservation/${reservationId}`);
  }

  getPaymentsByMethod(method: PaymentMethod): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}/method/${method}`);
  }

  updatePayment(id: string, payment: PaymentDto): Observable<PaymentDto> {
    return this.http.put<PaymentDto>(`${this.apiUrl}/${id}`, payment);
  }

  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
