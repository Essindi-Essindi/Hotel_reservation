import { Injectable } from '@angular/core';

export type RoomStatus = 'Available' | 'Reserved' | 'Disabled';
export type ReservationStatus = 'Confirmed' | 'Pending' | 'Checked In' | 'Checked Out' | 'Cancelled';

export interface Room {
  id: string;
  row: number;
  col: number;
  status: RoomStatus;
  pricePerNight: number;
}

export interface RoomGroup {
  id: string;
  name: string;
  rows: number;
  cols: number;
  rooms: Room[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  image: string;
  groups: RoomGroup[];
}

export interface Reservation {
  id: string;
  guest: string;
  hotelId: string;
  hotelName: string;
  groupName: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  amount: number;
}

export interface OccupancyTrend {
  month: string;
  revenue: number;
  occupancy: number;
}

function generateRooms(rows: number, cols: number, reservedIds: string[] = [], disabledIds: string[] = []): Room[] {
  const rooms: Room[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const id = `${String.fromCharCode(65 + j)}${i + 1}`;
      let status: RoomStatus = 'Available';
      if (reservedIds.includes(id)) status = 'Reserved';
      if (disabledIds.includes(id)) status = 'Disabled';
      rooms.push({ id, row: i, col: j, status, pricePerNight: 320 + (i * 20) });
    }
  }
  return rooms;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {

  hotels: Hotel[] = [
    {
      id: 'h1',
      name: 'PlaceFinder Grand Palace',
      city: 'Rimberio',
      address: '12 Avenue des Roses, Rimberio City, 75008',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
      groups: [
        {
          id: 'g1',
          name: 'Floor 1 · Garden Wing',
          rows: 3,
          cols: 5,
          rooms: generateRooms(3, 5, ['A1','B2','C3','D1','E2'], ['C5']),
        },
        {
          id: 'g2',
          name: 'Floor 2 · Terrace Wing',
          rows: 3,
          cols: 6,
          rooms: generateRooms(3, 6, ['A1','B1','C2','D3','E3','F2'], ['F3']),
        },
        {
          id: 'g3',
          name: 'Floor 3 · Presidential',
          rows: 2,
          cols: 4,
          rooms: generateRooms(2, 4, ['A1','B2','C1'], ['D2']),
        },
      ],
    },
    {
      id: 'h2',
      name: 'PlaceFinder Marina Resort',
      city: "Côte d'Azur",
      address: '88 Promenade de la Mer, Côte d\'Azur',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
      groups: [
        {
          id: 'g4',
          name: 'Sea View Wing',
          rows: 4,
          cols: 6,
          rooms: generateRooms(4, 6, ['A1','A2','B3','C4','D5','E6','F1'], ['F6']),
        },
        {
          id: 'g5',
          name: 'Garden Suites',
          rows: 3,
          cols: 5,
          rooms: generateRooms(3, 5, ['A1','B2','C3','D4','E1'], []),
        },
      ],
    },
    {
      id: 'h3',
      name: 'PlaceFinder Mountain Lodge',
      city: 'Aspen Heights',
      address: '1 Alpine Ridge, Aspen Heights',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
      groups: [
        {
          id: 'g6',
          name: 'Alpine Wing',
          rows: 2,
          cols: 5,
          rooms: generateRooms(2, 5, ['A1','B2','C1'], ['E2']),
        },
        {
          id: 'g7',
          name: 'Summit Suites',
          rows: 2,
          cols: 4,
          rooms: generateRooms(2, 4, ['A1','B1','C2'], []),
        },
      ],
    },
    {
      id: 'h4',
      name: 'PlaceFinder City Boutique',
      city: 'Rimberio',
      address: '5 Rue du Palais, Rimberio City',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
      groups: [
        {
          id: 'g8',
          name: 'Classic Floor',
          rows: 3,
          cols: 4,
          rooms: generateRooms(3, 4, ['A1','B1','C2','D3'], []),
        },
        {
          id: 'g9',
          name: 'Deluxe Floor',
          rows: 3,
          cols: 4,
          rooms: generateRooms(3, 4, ['A1','B2','D1'], ['D4']),
        },
        {
          id: 'g10',
          name: 'Penthouse',
          rows: 2,
          cols: 4,
          rooms: generateRooms(2, 4, ['A1','C2'], []),
        },
      ],
    },
  ];

  reservations: Reservation[] = [
    { id: 'RES-001', guest: 'Sophie Laurent', hotelId: 'h1', hotelName: 'PlaceFinder Grand Palace', groupName: 'Floor 1 · Garden Wing', roomId: 'A1', checkIn: '2026-04-22', checkOut: '2026-04-25', status: 'Checked In', amount: 1140 },
    { id: 'RES-002', guest: 'Marco Bellini', hotelId: 'h1', hotelName: 'PlaceFinder Grand Palace', groupName: 'Floor 2 · Terrace Wing', roomId: 'B1', checkIn: '2026-04-23', checkOut: '2026-04-27', status: 'Confirmed', amount: 1520 },
    { id: 'RES-003', guest: 'Amara Diallo', hotelId: 'h2', hotelName: 'PlaceFinder Marina Resort', groupName: 'Sea View Wing', roomId: 'A2', checkIn: '2026-04-20', checkOut: '2026-04-24', status: 'Checked In', amount: 1280 },
    { id: 'RES-004', guest: 'James Thornton', hotelId: 'h2', hotelName: 'PlaceFinder Marina Resort', groupName: 'Garden Suites', roomId: 'B2', checkIn: '2026-04-25', checkOut: '2026-04-28', status: 'Confirmed', amount: 960 },
    { id: 'RES-005', guest: 'Yuki Nakamura', hotelId: 'h3', hotelName: 'PlaceFinder Mountain Lodge', groupName: 'Alpine Wing', roomId: 'A1', checkIn: '2026-04-21', checkOut: '2026-04-23', status: 'Checked Out', amount: 640 },
    { id: 'RES-006', guest: 'Leila Mansouri', hotelId: 'h1', hotelName: 'PlaceFinder Grand Palace', groupName: 'Floor 3 · Presidential', roomId: 'A1', checkIn: '2026-04-22', checkOut: '2026-04-26', status: 'Confirmed', amount: 2400 },
    { id: 'RES-007', guest: 'Carlos Vega', hotelId: 'h4', hotelName: 'PlaceFinder City Boutique', groupName: 'Deluxe Floor', roomId: 'A1', checkIn: '2026-04-18', checkOut: '2026-04-20', status: 'Checked Out', amount: 640 },
    { id: 'RES-008', guest: 'Nina Petrov', hotelId: 'h2', hotelName: 'PlaceFinder Marina Resort', groupName: 'Sea View Wing', roomId: 'B3', checkIn: '2026-04-24', checkOut: '2026-04-29', status: 'Pending', amount: 1600 },
    { id: 'RES-009', guest: 'David Osei', hotelId: 'h3', hotelName: 'PlaceFinder Mountain Lodge', groupName: 'Summit Suites', roomId: 'B1', checkIn: '2026-04-26', checkOut: '2026-04-28', status: 'Confirmed', amount: 700 },
    { id: 'RES-010', guest: 'Isabelle Moreau', hotelId: 'h4', hotelName: 'PlaceFinder City Boutique', groupName: 'Classic Floor', roomId: 'C2', checkIn: '2026-04-15', checkOut: '2026-04-17', status: 'Cancelled', amount: 640 },
    { id: 'RES-011', guest: 'Ahmed Khalil', hotelId: 'h1', hotelName: 'PlaceFinder Grand Palace', groupName: 'Floor 1 · Garden Wing', roomId: 'D1', checkIn: '2026-04-22', checkOut: '2026-04-24', status: 'Checked In', amount: 760 },
    { id: 'RES-012', guest: 'Fatou Sy', hotelId: 'h2', hotelName: 'PlaceFinder Marina Resort', groupName: 'Sea View Wing', roomId: 'C4', checkIn: '2026-04-22', checkOut: '2026-04-25', status: 'Checked In', amount: 1020 },
  ];

  occupancyTrend: OccupancyTrend[] = [
    { month: 'Jan', revenue: 28000, occupancy: 62 },
    { month: 'Feb', revenue: 31000, occupancy: 68 },
    { month: 'Mar', revenue: 34000, occupancy: 71 },
    { month: 'Apr', revenue: 29000, occupancy: 64 },
    { month: 'May', revenue: 38000, occupancy: 78 },
    { month: 'Jun', revenue: 42000, occupancy: 85 },
    { month: 'Jul', revenue: 39000, occupancy: 82 },
    { month: 'Aug', revenue: 45000, occupancy: 89 },
    { month: 'Sep', revenue: 36000, occupancy: 75 },
    { month: 'Oct', revenue: 33000, occupancy: 70 },
    { month: 'Nov', revenue: 30000, occupancy: 65 },
    { month: 'Dec', revenue: 41000, occupancy: 83 },
  ];

  flattenRooms(): Room[] {
    return this.hotels.flatMap(h => h.groups.flatMap(g => g.rooms));
  }

  getStats() {
    const allRooms = this.flattenRooms();
    const total = allRooms.length;
    const reserved = allRooms.filter(r => r.status === 'Reserved').length;
    const available = allRooms.filter(r => r.status === 'Available').length;
    const disabled = allRooms.filter(r => r.status === 'Disabled').length;
    const occupancyPct = Math.round((reserved / Math.max(1, total - disabled)) * 100);
    const totalGroups = this.hotels.reduce((s, h) => s + h.groups.length, 0);
    return { total, reserved, available, disabled, occupancyPct, totalGroups };
  }
}
