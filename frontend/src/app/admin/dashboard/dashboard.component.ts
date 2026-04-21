import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,             // ✅ mark as standalone
  imports: [CommonModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userDropdownOpen = false;

  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }
}