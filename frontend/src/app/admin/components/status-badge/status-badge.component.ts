import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationStatus } from '../../services/mock-data.service';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="statusClass">
      {{ status }}
    </span>
  `,
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  @Input() status!: ReservationStatus;

  get statusClass(): string {
    const map: Record<ReservationStatus, string> = {
      'Confirmed':   'confirmed',
      'Pending':     'pending',
      'Checked In':  'checked-in',
      'Checked Out': 'checked-out',
      'Cancelled':   'cancelled',
    };
    return map[this.status] ?? '';
  }
}
