import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService, Hotel, Reservation } from '../../services/mock-data.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

interface KpiItem {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  iconSvg: string;
  accent?: boolean;
}

interface HotelStat {
  hotel: Hotel;
  total: number;
  reserved: number;
  available: number;
  pct: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, KpiCardComponent, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  kpis: KpiItem[] = [];
  hotelStats: HotelStat[] = [];
  recentReservations: Reservation[] = [];
  occupancyTrend: { month: string; revenue: number; occupancy: number }[] = [];

  // For the simple area/bar chart we render as pure SCSS-driven bars
  maxRevenue = 0;

  // Hero text
  occupancyPct = 0;
  reservedCount = 0;

  constructor(private data: MockDataService) {}

  ngOnInit() {
    const stats = this.data.getStats();
    this.occupancyPct = stats.occupancyPct;
    this.reservedCount = stats.reserved;

    this.kpis = [
      {
        label: 'Total Hotels',
        value: String(this.data.hotels.length),
        delta: `${stats.totalGroups} room groups`,
        trend: 'up',
        iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
          <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
        </svg>`,
      },
      {
        label: 'Total Rooms',
        value: String(stats.total),
        delta: `${stats.disabled} disabled`,
        trend: 'up',
        accent: true,
        iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/>
          <path d="M2 17h20"/><path d="M6 8v9"/>
        </svg>`,
      },
      {
        label: 'Available',
        value: String(stats.available),
        delta: `${Math.round((stats.available / stats.total) * 100)}% of inventory`,
        trend: 'up',
        iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>`,
      },
      {
        label: 'Reserved',
        value: String(stats.reserved),
        delta: `${stats.occupancyPct}% occupancy`,
        trend: 'down',
        iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>`,
      },
    ];

    this.hotelStats = this.data.hotels.map(h => {
      const rooms = h.groups.flatMap(g => g.rooms);
      const total = rooms.length;
      const reserved = rooms.filter(r => r.status === 'Reserved').length;
      const available = rooms.filter(r => r.status === 'Available').length;
      const disabled = rooms.filter(r => r.status === 'Disabled').length;
      const pct = Math.round((reserved / Math.max(1, total - disabled)) * 100);
      return { hotel: h, total, reserved, available, pct };
    });

    this.recentReservations = this.data.reservations.slice(0, 6);
    this.occupancyTrend = this.data.occupancyTrend;
    this.maxRevenue = Math.max(...this.occupancyTrend.map(d => d.revenue));
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  barHeight(val: number, max: number): string {
    return `${Math.round((val / max) * 100)}%`;
  }
}
