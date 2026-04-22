import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Hotel, RoomGroup } from '../../services/mock-data.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { RoomGridComponent } from '../../components/room-grid/room-grid.component';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, RoomGridComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  selectedHotel = signal<Hotel | null>(null);
  activeGroupId = signal<string>('');
  showNewModal = signal(false);

  // New hotel form state (mirrors React useState in Hotels.tsx)
  newName = '';
  newCity = '';
  newAddress = '';
  newGroupName = '';

  constructor(private data: MockDataService) {}

  ngOnInit() {
    this.hotels = [...this.data.hotels];
  }

  totalRooms(h: Hotel): number {
    return h.groups.reduce((s, g) => s + g.rooms.length, 0);
  }

  reservedCount(h: Hotel): number {
    return h.groups.flatMap(g => g.rooms).filter(r => r.status === 'Reserved').length;
  }

  openManage(h: Hotel) {
    this.selectedHotel.set(h);
    this.activeGroupId.set(h.groups[0]?.id ?? '');
  }

  closeManage() { this.selectedHotel.set(null); }

  deleteHotel(id: string) {
    if (confirm('Remove this hotel from the list?')) {
      this.hotels = this.hotels.filter(h => h.id !== id);
    }
  }

  setActiveGroup(id: string) { this.activeGroupId.set(id); }

  activeGroup(h: Hotel): RoomGroup | undefined {
    return h.groups.find(g => g.id === this.activeGroupId());
  }

  openNew()  { this.showNewModal.set(true);  }
  closeNew() { this.showNewModal.set(false); }

  createHotel() {
    alert(`Hotel "${this.newName || 'Untitled'}" created (mock — not persisted)`);
    this.newName = ''; this.newCity = ''; this.newAddress = ''; this.newGroupName = '';
    this.closeNew();
  }
}
