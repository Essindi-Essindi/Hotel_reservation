import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card" [class.accent]="accent">
      <!-- Diamond decorations (exact Lovable replica) -->
      <div class="diamond-deco deco-outer"></div>
      <div class="diamond-deco deco-inner"></div>

      <div class="kpi-header">
        <div class="kpi-icon">
          <span [innerHTML]="iconSvg"></span>
        </div>
        <span class="delta-badge" [class.up]="trend === 'up'" [class.down]="trend === 'down'">
          <svg *ngIf="trend === 'up'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
          <svg *ngIf="trend === 'down'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/>
          </svg>
          {{ delta }}
        </span>
      </div>

      <p class="kpi-label">{{ label }}</p>
      <p class="kpi-value">{{ value }}</p>
    </div>
  `,
  styleUrl: './kpi-card.component.css',
})
export class KpiCardComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() delta!: string;
  @Input() trend: 'up' | 'down' = 'up';
  @Input() accent = false;
  @Input() iconSvg!: string;
}
