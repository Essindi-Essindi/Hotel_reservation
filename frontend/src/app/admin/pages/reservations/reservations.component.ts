import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MockDataService,
  Reservation,
  ReservationStatus,
  Hotel
} from '../../services/mock-data.service';
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

  // Filters
  query   = signal('');
  status  = signal<string>('All');
  hotelId = signal<string>('All');

  // Modal state
  showModal = signal(false);
  modalMode = signal<'create' | 'view' | 'edit'>('create');
  selectedReservation = signal<Reservation | null>(null);

  form: Partial<Reservation> = {};

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

  // ======================
  // MODAL LOGIC
  // ======================

  openCreateModal() {
    this.modalMode.set('create');
    this.form = { status: 'Confirmed' };
    this.showModal.set(true);
  }

  openViewModal(r: Reservation) {
    this.modalMode.set('view');
    this.selectedReservation.set(r);
    this.showModal.set(true);
  }

  openEditModal(r: Reservation) {
    this.modalMode.set('edit');
    this.selectedReservation.set(r);
    this.form = { ...r };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedReservation.set(null);
    this.form = {};
  }

  /** Close modal when clicking the backdrop (not the card itself) */
  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  /** Sync hotelName on the form when the hotel select changes */
  onHotelChange(hotelId: string) {
    const hotel = this.hotels.find(h => h.id === hotelId);
    if (hotel) {
      this.form.hotelName = hotel.name;
    }
  }

  saveReservation() {
    if (this.modalMode() === 'create') {
      const newReservation: Reservation = {
        ...(this.form as Reservation),
        id: 'RES-' + Math.floor(Math.random() * 10000),
      };
      this.allReservations = [newReservation, ...this.allReservations];
    }

    if (this.modalMode() === 'edit') {
      this.allReservations = this.allReservations.map(r =>
        r.id === this.selectedReservation()?.id
          ? { ...r, ...this.form }
          : r
      );
    }

    this.closeModal();
  }

  deleteReservation(id: string) {
    if (confirm('Delete this reservation?')) {
      this.allReservations = this.allReservations.filter(r => r.id !== id);
    }
  }
}