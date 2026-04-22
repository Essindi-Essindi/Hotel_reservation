import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
     

      <!-- Search (hidden on mobile, matching Lovable TopBar) -->
      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Search bookings, guests, rooms…" class="search-input" />
      </div>

      <!-- Right actions -->
      <div class="topbar-actions">

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
