import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <!-- Sidebar trigger -->
      <button class="sidebar-trigger" (click)="toggleSidebar.emit()" aria-label="Toggle sidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <!-- Search (hidden on mobile, matching Lovable TopBar) -->
      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Search bookings, guests, rooms…" class="search-input" />
      </div>

      <!-- Right actions -->
      <div class="topbar-actions">
        <!-- Mail -->
        <button class="icon-btn" aria-label="Messages">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span class="badge badge-gold"></span>
        </button>

        <!-- Bell -->
        <button class="icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span class="badge badge-red"></span>
        </button>

        <!-- User -->
        <div class="user-block">
          <div class="user-meta">
            <p class="user-name">Catherine B.</p>
            <p class="user-role">Manager</p>
          </div>
          <div class="avatar" aria-label="User avatar">CB</div>
        </div>
      </div>
    </header>
  `,
  styleUrl: './admin-topbar.component.css',
})
export class AdminTopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}
