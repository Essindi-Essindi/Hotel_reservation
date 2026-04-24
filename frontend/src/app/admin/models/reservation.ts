export type ReservationStatus = 'Confirmed' | 'Cancelled' | 'Completed';

export interface Reservation {
  reservationID: number;
  DateIssued: string;          // ISO string (LocalDateTime)
  reservationStartDate: string; // ISO date string (LocalDate)
  reservationEndDate: string;   // ISO date string (LocalDate)
  startTime: string;            // HH:mm:ss (LocalTime)
  endTime: string;              // HH:mm:ss (LocalTime)
  duration: number;
  cost: number;
  state: ReservationStatus;
  userId: number;
  hotelId: string;
  roomId: string;
}
