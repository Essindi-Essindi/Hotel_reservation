export type ReservationStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Reservation {
  id: number;
  currentDate: string;          // ISO string (LocalDateTime)
  reservationStartDate: string; // ISO date string (LocalDate)
  reservationEndDate: string;   // ISO date string (LocalDate)
  startTime: string;            // HH:mm:ss (LocalTime)
  endTime: string;              // HH:mm:ss (LocalTime)
  duration: number;
  cost: number;
  status: ReservationStatus;
  userId: number;
  hotelId: string;
  roomId: string;
}