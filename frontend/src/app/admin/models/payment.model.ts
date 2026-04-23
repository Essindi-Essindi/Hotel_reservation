export type PaymentMethod = 'CASH' | 'CARD' | 'WIRE_TRANSFER' | 'MOBILE';

export interface PaymentDto {
  paymentID?: string;
  paymentDate?: string | Date;
  amount: number;
  paymentMethod: PaymentMethod;
  reservationID: number;
  userID: number;
}