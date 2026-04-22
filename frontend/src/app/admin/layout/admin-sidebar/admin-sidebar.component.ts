import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

interface NavItem {
  title: string;
  url: string;
  icon: string; 
  safeIcon?: SafeHtml; 
  exact?: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">

      <!-- Header / Logo -->
      <div class="sidebar-header">
        <div class="logo-mark">
          <!-- Diamond SVG matching Lovable's Diamond icon -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/>
          </svg>
        </div>
        <div class="logo-text" *ngIf="!collapsed">
          <span class="brand-name">PlaceFinder</span>
          <span class="brand-sub">Hotel Admin</span>
        </div>
      </div>



      <!-- Navigation (mirrors admin.html sidebar-menu pattern) -->
      <nav class="sidebar-menu">
        <div class="nav-group-label" *ngIf="!collapsed">Management</div>
        <ul>
          <li *ngFor="let item of navItems">
            <a
              [routerLink]="item.url"
              [routerLinkActiveOptions]="{ exact: !!item.exact }"
              routerLinkActive="active"
              class="sidebar-item"
            >
              <!-- Inline SVG icons mirroring Lovable lucide icons -->
              <span class="icon" [innerHTML]="item.icon"></span>
              <span class="label" *ngIf="!collapsed">{{ item.title }}</span>
              <span class="active-dot" *ngIf="!collapsed"></span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Footer (mirrors Lovable SidebarFooter) -->
      <div class="sidebar-footer">
        <div class="footer-card" *ngIf="!collapsed">
          <p class="footer-brand">PlaceFinder Inc.</p>
          <p class="footer-city">Rimberio City</p>
        </div>
        <div class="footer-icon" *ngIf="collapsed">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/>
          </svg>
        </div>
      </div>
    </aside>
  `,
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  navItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      exact: true,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
               <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
             </svg>`,
    },
    {
      title: 'Hotels',
      url: '/admin/hotels',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
               <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
               <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
               <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
             </svg>`,
    },
    {
      title: 'Reservations',
      url: '/admin/reservations',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
               <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/>
               <line x1="3" x2="21" y1="10" y2="10"/>
               <path d="m9 16 2 2 4-4"/>
             </svg>`,
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
               <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
               <circle cx="12" cy="12" r="3"/>
             </svg>`,
    },
  ];
}
