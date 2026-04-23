import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  DashboardService,
  KpiItem,
  HotelStat,
  OccupancyPoint,
  RecentReservationRow,
} from '../../services/dashboard.service';

import { PageHeaderComponent }  from '../../components/page-header/page-header.component';
import { KpiCardComponent }     from '../../components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    KpiCardComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {

  private dashboardSvc = inject(DashboardService);
  private destroy$     = new Subject<void>();

  kpis: KpiItem[]                        = [];
  hotelStats: HotelStat[]                = [];
  recentReservations: RecentReservationRow[] = [];
  occupancyTrend: OccupancyPoint[]       = [];

  maxRevenue    = 0;
  occupancyPct  = 0;
  reservedCount = 0;

  ngOnInit(): void {
    this.dashboardSvc.dashboardData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.kpis                = data.kpis;
          this.hotelStats          = data.hotelStats;
          this.recentReservations  = data.recentReservations;
          this.occupancyTrend      = data.occupancyTrend;
          this.maxRevenue          = data.maxRevenue;
          this.occupancyPct        = data.occupancyPct;
          this.reservedCount       = data.reservedCount;
        },
        error: err => console.error('Dashboard load error:', err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  }

  barHeight(val: number, max: number): string {
    if (!max) return '0%';
    return `${Math.round((val / max) * 100)}%`;
  }
}