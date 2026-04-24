export type PaymentMethod = 'CreditCard' | 'OrangeMoney' | 'MobileMoney' | 'PayPal';

export interface PaymentDto {
  paymentID?: string;
  paymentDate?: string | Date;
  amount: number;
  paymentMethod: PaymentMethod;
  reservationID: number;
  userID: number;
}
