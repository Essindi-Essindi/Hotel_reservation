import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

interface NotificationPref {
  label: string;
  desc: string;
  enabled: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  // Hotel info
  brandName = 'PlaceFinder Hotel';
  contactEmail = 'reservations@PlaceFinder.com';
  phone = '+1 (555) 234-1290';
  country = 'France';
  address = '12 Avenue des Roses, Rimberio City, 75008';

  // Theme
  selectedTheme = 0;
  selectedLogo = 'Diamond';

  // Pricing
  pricePerHour = 48;
  pricePerNight = 380;
  currency = 'USD';
  taxRate = 12;

  // Notifications
  notifications: NotificationPref[] = [
    { label: 'New reservations', desc: 'Email when a booking is created', enabled: true },
    { label: 'Cancellations',    desc: 'Email when a guest cancels',      enabled: true },
    { label: 'Daily summary',    desc: 'Daily occupancy & revenue digest', enabled: false },
    { label: 'Maintenance alerts', desc: 'Room status changes',            enabled: false },
  ];

  saved = false;

  save() {
    this.saved = true;
    setTimeout(() => (this.saved = false), 2500);
  }
}
