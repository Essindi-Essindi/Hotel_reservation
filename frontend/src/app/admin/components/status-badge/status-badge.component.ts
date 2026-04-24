import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ReservationStatus } from '../../models/reservation'; // ← add "type"

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
      Confirmed: 'confirmed',
      Cancelled: 'cancelled',
      Completed: 'checked-out',
    };
    return map[this.status] ?? '';
  }

  get label(): string {
    const map: Record<ReservationStatus, string> = {
      Confirmed: 'Confirmed',
      Cancelled: 'Cancelled',
      Completed: 'Completed',
    };
    return map[this.status] ?? this.status;
  }
}
