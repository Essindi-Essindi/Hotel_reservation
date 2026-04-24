import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card" [class.accent]="accent">

      <!-- Diamond decorations -->
      <div class="diamond-deco deco-outer"></div>
      <div class="diamond-deco deco-inner"></div>

      <!-- Header -->
      <div class="kpi-header">
        <div class="kpi-icon">
          <span [innerHTML]="iconSvgSafe"></span>
        </div>

        <span
          class="delta-badge"
          [class.up]="trend === 'up'"
          [class.down]="trend === 'down'"
        >
          <!-- Trend icons -->
          <svg *ngIf="trend === 'up'" viewBox="0 0 24 24">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>

          <svg *ngIf="trend === 'down'" viewBox="0 0 24 24">
            <line x1="7" y1="7" x2="17" y2="17"></line>
            <polyline points="17 7 17 17 7 17"></polyline>
          </svg>

          {{ delta }}
        </span>
      </div>

      <!-- Content -->
      <p class="kpi-label">{{ label }}</p>
      <p class="kpi-value">{{ value }}</p>
    </div>
  `,
  styleUrls: ['./kpi-card.component.css'],
})
export class KpiCardComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() delta!: string;
  @Input() trend: 'up' | 'down' = 'up';
  @Input() accent = false;

  private _iconSvg!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  @Input()
  set iconSvg(value: string) {
    this._iconSvg = this.sanitizer.bypassSecurityTrustHtml(value);
  }

  get iconSvgSafe(): SafeHtml {
    return this._iconSvg;
  }
}