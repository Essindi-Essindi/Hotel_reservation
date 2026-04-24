import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

import { HotelService, Hotel } from './hotel.service';
import { RoomService, Room } from './room.service';
import { ReservationService } from './reservation.service';
import { Reservation } from '../models/reservation';

export interface KpiItem {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  iconSvg: string;
  accent?: boolean;
}

export interface HotelStat {
  hotel: Hotel;
  total: number;
  reserved: number;
  available: number;
  pct: number;
}

export interface OccupancyPoint {
  month: string;
  revenue: number;
  occupancy: number;
}

export interface RecentReservationRow {
  id: number;
  guest: string;
  hotelName: string;
  roomId: string;
  groupName: string;
  checkIn: string;
  amount: number;
}

export interface DashboardData {
  kpis: KpiItem[];
  hotelStats: HotelStat[];
  occupancyTrend: OccupancyPoint[];
  recentReservations: RecentReservationRow[];
  occupancyPct: number;
  reservedCount: number;
  maxRevenue: number;
}

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const ICON_HOTELS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
  <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
</svg>`;

const ICON_ROOMS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/>
  <path d="M2 17h20"/><path d="M6 8v9"/>
</svg>`;

const ICON_RESERVATIONS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
</svg>`;

const ICON_REVENUE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <line x1="12" y1="1" x2="12" y2="23"/>
  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
</svg>`;

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private hotelSvc = inject(HotelService);
  private roomSvc  = inject(RoomService);
  private resSvc   = inject(ReservationService);

  readonly dashboardData$: Observable<DashboardData> = this._load().pipe(
    shareReplay(1)
  );

  private _load(): Observable<DashboardData> {
    return forkJoin({
      hotels:       this.hotelSvc.getAll(),
      reservations: this.resSvc.getAll(),
    }).pipe(
      switchMap(({ hotels, reservations }) => {
        const roomRequests = hotels.reduce<Record<string, Observable<Room[]>>>(
          (acc, h) => {
            acc[h.hotelID] = this.roomSvc.getAllForHotel(h.hotelID);
            return acc;
          },
          {}
        );

        const roomFork$ = hotels.length
          ? forkJoin(roomRequests)
          : of({} as Record<string, Room[]>);

        return roomFork$.pipe(
          map(roomsByHotel => this._transform(hotels, roomsByHotel, reservations))
        );
      })
    );
  }

  private _transform(
    hotels: Hotel[],
    roomsByHotel: Record<string, Room[]>,
    reservations: Reservation[],
  ): DashboardData {
    const hotelStats         = this.computeHotelStats(hotels, roomsByHotel, reservations);
    const kpis               = this.computeKPIs(hotels, roomsByHotel, reservations);
    const occupancyTrend     = this.computeOccupancyTrend(reservations);
    const recentReservations = this.mapRecentReservations(reservations);
    const maxRevenue         = Math.max(...occupancyTrend.map(d => d.revenue), 1);

    const allRooms      = Object.values(roomsByHotel).flat();
    const totalRooms    = allRooms.length;
    const reservedCount = reservations.filter(r => r.state === 'Confirmed').length;
    const occupancyPct  = totalRooms > 0
      ? Math.round((reservedCount / totalRooms) * 100)
      : 0;

    return { kpis, hotelStats, occupancyTrend, recentReservations, occupancyPct, reservedCount, maxRevenue };
  }

  computeKPIs(
    hotels: Hotel[],
    roomsByHotel: Record<string, Room[]>,
    reservations: Reservation[],
  ): KpiItem[] {
    const allRooms     = Object.values(roomsByHotel).flat();
    const totalRooms   = allRooms.length;
    const totalRes     = reservations.length;
    const revenue      = reservations.reduce((sum, r) => sum + (r.cost ?? 0), 0);
    const confirmed    = reservations.filter(r => r.state === 'Confirmed').length;
    const occupancyPct = totalRooms > 0 ? Math.round((confirmed / totalRooms) * 100) : 0;

    return [
      {
        label:   'Total Hotels',
        value:   String(hotels.length),
        delta:   `${hotels.reduce((s, h) => s + (h.totalRooms ?? 0), 0)} total rooms`,
        trend:   'up',
        iconSvg: ICON_HOTELS,
      },
      {
        label:   'Total Rooms',
        value:   String(totalRooms),
        delta:   `across ${hotels.length} properties`,
        trend:   'up',
        accent:  true,
        iconSvg: ICON_ROOMS,
      },
      {
        label:   'Total Reservations',
        value:   String(totalRes),
        delta:   `${confirmed} confirmed · ${occupancyPct}% occupancy`,
        trend:   confirmed > 0 ? 'up' : 'down',
        iconSvg: ICON_RESERVATIONS,
      },
      {
        label:   'Revenue',
        value:   `$${revenue.toLocaleString()}`,
        delta:   `from ${totalRes} reservation${totalRes !== 1 ? 's' : ''}`,
        trend:   revenue > 0 ? 'up' : 'down',
        iconSvg: ICON_REVENUE,
      },
    ];
  }

  computeHotelStats(
    hotels: Hotel[],
    roomsByHotel: Record<string, Room[]>,
    reservations: Reservation[],
  ): HotelStat[] {
    return hotels.map(hotel => {
      const rooms     = roomsByHotel[hotel.hotelID] ?? [];
      const total     = rooms.length;
      const reserved  = reservations.filter(
        r => r.hotelId === hotel.hotelID && r.state === 'Confirmed'
      ).length;
      const available = Math.max(0, total - reserved);
      const pct       = total > 0 ? Math.round((reserved / total) * 100) : 0;

      return { hotel, total, reserved, available, pct };
    });
  }

  computeOccupancyTrend(reservations: Reservation[]): OccupancyPoint[] {
    const byMonth = new Map<string, { revenue: number; confirmed: number; total: number }>();

    for (const res of reservations) {
      const dateStr = res.reservationStartDate ?? res.DateIssued;
      if (!dateStr) continue;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) continue;

      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const entry = byMonth.get(key) ?? { revenue: 0, confirmed: 0, total: 0 };
      entry.revenue += res.cost ?? 0;
      entry.total   += 1;
      if (res.state === 'Confirmed') entry.confirmed += 1;
      byMonth.set(key, entry);
    }

    return [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([key, v]) => {
        const monthIndex = parseInt(key.split('-')[1], 10) - 1;
        const occupancy  = v.total > 0 ? Math.round((v.confirmed / v.total) * 100) : 0;
        return {
          month:     MONTH_ABBR[monthIndex] ?? key,
          revenue:   v.revenue,
          occupancy,
        };
      });
  }

  mapRecentReservations(reservations: Reservation[]): RecentReservationRow[] {
    return [...reservations]
      .sort((a, b) => {
        const da = new Date(a.DateIssued ?? '').getTime() || 0;
        const db = new Date(b.DateIssued ?? '').getTime() || 0;
        return db - da;
      })
      .slice(0, 10)
      .map(r => ({
        id:        r.reservationID,
        guest:     `User ${r.userId}`,
        hotelName: r.hotelId,
        roomId:    r.roomId,
        groupName: 'Standard',
        checkIn:   r.reservationStartDate ?? r.DateIssued ?? '',
        amount:    r.cost ?? 0,
      }));
  }
}
