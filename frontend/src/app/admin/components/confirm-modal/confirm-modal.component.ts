import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-card" role="dialog" aria-modal="true" [attr.aria-labelledby]="'confirm-title-' + uid">

        <div class="modal-header">
          <div>
            <p class="modal-eyebrow">Confirmation</p>
            <h2 class="modal-title" [id]="'confirm-title-' + uid">{{ title }}</h2>
          </div>
          <button class="close-btn" (click)="cancel.emit()" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p style="color: hsl(var(--foreground)); font-size: 0.9375rem; line-height: 1.6;">
            {{ message }}
          </p>
        </div>

        <div class="modal-footer">
          <button class="btn-outline" (click)="cancel.emit()">Cancel</button>
          <button
            class="btn-luxury"
            [style.background]="isDanger ? 'linear-gradient(135deg, hsl(0,70%,38%), hsl(0,65%,48%))' : ''"
            (click)="confirm.emit()"
          >
            {{ confirmLabel }}
          </button>
        </div>

      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  /** Dialog title */
  @Input() title = 'Confirm';
  /** Body message */
  @Input() message = 'Are you sure?';
  /** Label on the confirm button */
  @Input() confirmLabel = 'Confirm';
  /** When true the confirm button renders in destructive red */
  @Input() isDanger = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel  = new EventEmitter<void>();

  /** Unique suffix so multiple instances don't clash on aria-labelledby */
  readonly uid = Math.random().toString(36).slice(2, 7);

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cancel.emit();
    }
  }
}