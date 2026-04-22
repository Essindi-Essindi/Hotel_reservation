import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Reservation, ReservationStatus, Hotel } from '../../services/mock-data.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

const ALL_STATUSES: (ReservationStatus | 'All')[] = [
  'All', 'Confirmed', 'Pending', 'Checked In', 'Checked Out', 'Cancelled',
];

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {
  statuses = ALL_STATUSES;
  hotels: Hotel[] = [];
  allReservations: Reservation[] = [];

  // Filter state (mirrors React useState)
  query    = signal('');
  status   = signal<string>('All');
  hotelId  = signal<string>('All');

  filtered = computed(() => {
    return this.allReservations.filter(r => {
      if (this.status() !== 'All' && r.status !== this.status()) return false;
      if (this.hotelId() !== 'All' && r.hotelId !== this.hotelId()) return false;
      const q = this.query().toLowerCase();
      if (q && !`${r.guest} ${r.id} ${r.hotelName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  constructor(private data: MockDataService) {}

  ngOnInit() {
    this.hotels = this.data.hotels;
    this.allReservations = this.data.reservations;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  deleteReservation(id: string) {
    if (confirm('Delete this reservation?')) {
      this.allReservations = this.allReservations.filter(r => r.id !== id);
    }
  }
}
