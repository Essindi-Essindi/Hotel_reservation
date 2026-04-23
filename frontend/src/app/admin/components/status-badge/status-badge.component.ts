import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationStatus } from '../../models/reservation';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="statusClass">
      {{ label }}
    </span>
  `,
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  @Input() status!: ReservationStatus;

  get statusClass(): string {
    const map: Record<ReservationStatus, string> = {
      CONFIRMED:  'confirmed',
      CANCELLED:  'cancelled',
      COMPLETED:  'checked-out',
    };
    return map[this.status] ?? '';
  }

  get label(): string {
    const map: Record<ReservationStatus, string> = {
      CONFIRMED: 'Confirmed',
      CANCELLED: 'Cancelled',
      COMPLETED: 'Completed',
    };
    return map[this.status] ?? this.status;
  }
}