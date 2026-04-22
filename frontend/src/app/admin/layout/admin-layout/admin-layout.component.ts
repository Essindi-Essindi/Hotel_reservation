import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../admin-sidebar/sidebar.component';
import { AdminTopbarComponent } from '../admin-topbar/admin-topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AdminTopbarComponent],
  template: `
    <div class="admin-shell" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        (toggleCollapse)="sidebarCollapsed.set(!sidebarCollapsed())"
      />
      <div class="admin-body">
        <app-admin-topbar (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())" />
        <main class="admin-main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  sidebarCollapsed = signal(false);
}