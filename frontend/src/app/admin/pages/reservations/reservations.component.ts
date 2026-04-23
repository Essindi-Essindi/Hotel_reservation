import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationService } from '../../services/reservation.service';
import { Reservation, ReservationStatus } from '../../models/reservation';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

// ── Filter types ──────────────────────────────────────────────────────────────

type StatusFilter = ReservationStatus | 'All';

const ALL_STATUSES: StatusFilter[] = ['All', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

// ── View-model (what the table/view-modal renders) ────────────────────────────

interface ReservationRow {
  id: number;
  guest: string;           // derived from userId (placeholder until user API wired)
  hotelId: string;
  hotelName: string;       // derive from hotelId when hotel API is available
  roomId: string;
  checkIn: string;         // reservationStartDate formatted
  checkOut: string;        // reservationEndDate formatted
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  status: ReservationStatus;
  userId: number;
}

// ── Confirmation modal config ─────────────────────────────────────────────────

interface ConfirmConfig {
  title: string;
  message: string;
  confirmLabel: string;
  isDanger: boolean;
  onConfirm: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {

  // ── Constants exposed to template ──────────────────────────────────────────

  readonly statuses = ALL_STATUSES;

  // ── Raw data ────────────────────────────────────────────────────────────────

  private rawReservations: Reservation[] = [];

  // ── Mapped rows ─────────────────────────────────────────────────────────────

  allReservations: ReservationRow[] = [];

  // ── Filters ─────────────────────────────────────────────────────────────────

  query   = signal('');
  status  = signal<string>('All');
  hotelId = signal<string>('All');

  // ── Modal: view ─────────────────────────────────────────────────────────────

  showViewModal   = signal(false);
  selectedRow     = signal<ReservationRow | null>(null);

  // ── Modal: confirm (cancel / delete) ────────────────────────────────────────

  showConfirmModal = signal(false);
  confirmConfig: ConfirmConfig | null = null;

  // ── Filtered rows (computed) ─────────────────────────────────────────────────

  filtered = computed(() => {
    return this.allReservations.filter(r => {
      if (this.status() !== 'All' && r.status !== this.status()) return false;
      if (this.hotelId() !== 'All' && r.hotelId !== this.hotelId()) return false;

      const q = this.query().toLowerCase();
      if (q && !`${r.guest} ${r.id} ${r.hotelName}`.toLowerCase().includes(q)) return false;

      return true;
    });
  });

  // ── Unique hotels for filter dropdown ────────────────────────────────────────

  hotels = computed<{ id: string; name: string }[]>(() => {
    const seen = new Set<string>();
    return this.allReservations
      .filter(r => { if (seen.has(r.hotelId)) return false; seen.add(r.hotelId); return true; })
      .map(r => ({ id: r.hotelId, name: r.hotelName }));
  });

  // ── Constructor ──────────────────────────────────────────────────────────────

  constructor(private reservationService: ReservationService) {}

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadReservations();
  }

  // ── Data loading ─────────────────────────────────────────────────────────────

  private loadReservations(): void {
    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.rawReservations = data;
        this.allReservations = data.map(r => this.mapToRow(r));
      },
      error: (err) => {
        console.error('Failed to load reservations', err);
      },
    });
  }

  /**
   * Maps a raw Reservation from the API to the ReservationRow view-model.
   *
   * Note: guest name and hotel name are not returned by the reservation
   * endpoint. Wire up user/hotel API calls here when those services are ready.
   * For now they fall back to readable placeholders.
   */
  private mapToRow(r: Reservation): ReservationRow {
    return {
      id:        r.id,
      guest:     `User #${r.userId}`,           // replace with actual user name when user API available
      hotelId:   r.hotelId,
      hotelName: r.hotelId,                      // replace with actual hotel name when hotel API available
      roomId:    r.roomId,
      checkIn:   r.reservationStartDate,
      checkOut:  r.reservationEndDate,
      startTime: r.startTime,
      endTime:   r.endTime,
      duration:  r.duration,
      cost:      r.cost,
      status:    r.status,
      userId:    r.userId,
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // ── Permission guards ─────────────────────────────────────────────────────────

  canCancel(row: ReservationRow): boolean {
    return row.status === 'CONFIRMED';
  }

  canDelete(row: ReservationRow): boolean {
    return row.status === 'CANCELLED';
  }

  // ── View modal ───────────────────────────────────────────────────────────────

  openViewModal(row: ReservationRow): void {
    this.selectedRow.set(row);
    this.showViewModal.set(true);
  }

  closeViewModal(): void {
    this.showViewModal.set(false);
    this.selectedRow.set(null);
  }

  onViewBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeViewModal();
    }
  }

  // ── Cancel reservation ───────────────────────────────────────────────────────

  requestCancel(row: ReservationRow): void {
    if (!this.canCancel(row)) return;

    this.confirmConfig = {
      title:        'Cancel Reservation',
      message:      'Are you sure you want to cancel this reservation?',
      confirmLabel: 'Cancel Reservation',
      isDanger:     true,
      onConfirm:    () => this.executeCancel(row.id),
    };
    this.showConfirmModal.set(true);
  }

  private executeCancel(reservationId: number): void {
    this.reservationService.cancel(reservationId).subscribe({
      next: () => {
        this.closeConfirmModal();
        this.loadReservations();
      },
      error: (err) => {
        console.error('Failed to cancel reservation', err);
        this.closeConfirmModal();
      },
    });
  }

  // ── Delete reservation ───────────────────────────────────────────────────────

  requestDelete(row: ReservationRow): void {
    if (!this.canDelete(row)) return;

    this.confirmConfig = {
      title:        'Delete Reservation',
      message:      'This action is permanent. Delete this cancelled reservation?',
      confirmLabel: 'Delete',
      isDanger:     true,
      onConfirm:    () => this.executeDelete(row.id),
    };
    this.showConfirmModal.set(true);
  }

  private executeDelete(reservationId: number): void {
    this.reservationService.delete(reservationId).subscribe({
      next: () => {
        this.closeConfirmModal();
        this.loadReservations();
      },
      error: (err) => {
        console.error('Failed to delete reservation', err);
        this.closeConfirmModal();
      },
    });
  }

  // ── Confirm modal ─────────────────────────────────────────────────────────────

  onConfirm(): void {
    this.confirmConfig?.onConfirm();
  }

  closeConfirmModal(): void {
    this.showConfirmModal.set(false);
    this.confirmConfig = null;
  }
}