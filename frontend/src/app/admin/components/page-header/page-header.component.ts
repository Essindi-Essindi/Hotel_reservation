import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="header-text">
        <p class="eyebrow" *ngIf="eyebrow">{{ eyebrow }}</p>
        <h1 class="title">{{ title }}</h1>
        <p class="description" *ngIf="description">{{ description }}</p>
      </div>
      <div class="header-actions" *ngIf="hasActions">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  @Input() eyebrow?: string;
  @Input() title!: string;
  @Input() description?: string;
  @Input() hasActions = false;
}
