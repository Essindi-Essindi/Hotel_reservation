import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface RoomType {
  name: string;
  price: number;
}

interface BookingForm {
  checkIn: string;
  checkOut: string;
  arrivalTime: string;
  departureTime: string;
  roomType: string;
  guests: number;
  preference: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {

  bookOpen = false;

  facilities: string[] = [
    'Executive lounge access',
    'Productive work environment',
    'Complimentary snacks',
    'Complete breakfast',
  ];

  roomTypes: RoomType[] = [
    { name: 'Deluxe Suite',     price: 320 },
    { name: 'Executive Room',   price: 220 },
    { name: 'Royal Penthouse',  price: 780 },
  ];

  // Generate half-hour time slots from 06:00 to 23:30
  times: string[] = (() => {
    const out: string[] = [];
    for (let h = 6; h <= 23; h++) {
      for (const m of [0, 30]) {
        out.push(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        );
      }
    }
    return out;
  })();

  booking: BookingForm = {
    checkIn: '',
    checkOut: '',
    arrivalTime: '14:00',
    departureTime: '11:00',
    roomType: '',
    guests: 2,
    preference: '',
  };

  get nights(): number {
    if (!this.booking.checkIn || !this.booking.checkOut) return 0;
    const diff =
      new Date(this.booking.checkOut).getTime() -
      new Date(this.booking.checkIn).getTime();
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 0;
  }

  get totalCost(): number {
    const room = this.roomTypes.find(r => r.name === this.booking.roomType);
    return room ? this.nights * room.price : 0;
  }

  openBookNow(): void {
    this.bookOpen = true;
  }

  closeOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.bookOpen = false;
    }
  }

  recalcCost(): void {
    // Triggered by room/guest changes — cost recomputed via getters
  }

  submitBooking(): void {
    if (!this.booking.checkIn || !this.booking.checkOut || !this.booking.roomType) {
      alert('Please fill in all required fields.');
      return;
    }
    if (this.nights <= 0) {
      alert('Check-out must be after check-in.');
      return;
    }

    // Maps to Java Reservation entity — wire up your service here
    const payload = {
      reservationStartDate: this.booking.checkIn,
      reservationEndDate:   this.booking.checkOut,
      startTime:            this.booking.arrivalTime,
      endTime:              this.booking.departureTime,
      roomType:             this.booking.roomType,
      guests:               this.booking.guests,
      preference:           this.booking.preference,
      duration:             this.nights,
      cost:                 this.totalCost,
      state:                'PENDING',
    };

    console.log('Reservation payload:', payload);
    alert(`Reservation requested! ${this.nights} night(s) · ${this.booking.roomType} · $${this.totalCost}`);

    // Reset
    this.booking = {
      checkIn: '', checkOut: '',
      arrivalTime: '14:00', departureTime: '11:00',
      roomType: '', guests: 2, preference: '',
    };
    this.bookOpen = false;
  }
}