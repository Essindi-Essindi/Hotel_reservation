import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of, from, Observable } from 'rxjs';
import { concatMap, catchError, tap, finalize } from 'rxjs/operators';

import { HotelService, Hotel } from '../../services/hotel.service';
import { LocationService, Location } from '../../services/location.service';
import { RoomService, Room } from '../../services/room.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

// ─── Local UI model ───────────────────────────────────────────────────────────

export interface HotelUI extends Hotel {
  rooms: Room[];
  roomsLoaded: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent implements OnInit {

  // ── Services ──────────────────────────────────────────────────────────────
  private hotelSvc    = inject(HotelService);
  private locationSvc = inject(LocationService);
  private roomSvc     = inject(RoomService);
  private fb          = inject(FormBuilder);

  // ── State ─────────────────────────────────────────────────────────────────
  hotels         = signal<HotelUI[]>([]);
  locations      = signal<Location[]>([]);

  /** Manage-modal hotel */
  selectedHotel  = signal<HotelUI | null>(null);

  // ── Page loading ──────────────────────────────────────────────────────────
  loadingHotels  = signal(false);
  hotelsError    = signal<string | null>(null);

  // ── New-hotel modal ───────────────────────────────────────────────────────
  showNewModal   = signal(false);
  creatingHotel  = signal(false);
  createError    = signal<string | null>(null);
  /** Partial success: hotel created but some rooms failed */
  roomWarning    = signal<string | null>(null);

  hotelForm!: FormGroup;
  /** room name inputs — one per row */
  roomNames: string[] = [];

  // ── Inline location creation ──────────────────────────────────────────────
  showAddLocation   = signal(false);
  newLocationName   = '';
  addingLocation    = signal(false);
  locationAddError  = signal<string | null>(null);

  // ── Standalone add-room modal ─────────────────────────────────────────────
  showAddRoomModal  = signal(false);
  addingRoom        = signal(false);
  addRoomError      = signal<string | null>(null);
  roomForm!: FormGroup;

  // ── Manage modal ──────────────────────────────────────────────────────────
  loadingRooms      = signal(false);

  // ─────────────────────────────────────────────────────────────────────────
  ngOnInit() {
    this._buildHotelForm();
    this._buildRoomForm();
    this._loadHotels();
    this._loadLocations();
    this.hotelForm.get('hotelName')?.valueChanges.subscribe((newName: string) => {
      const prefix = newName?.trim() || 'Hotel';

      // Update the entire array with the new prefix
      this.roomNames = this.roomNames.map((_, i) => `${prefix} Room ${i + 1}`);
    });
  }

  // ── Form builders ─────────────────────────────────────────────────────────
  private _buildHotelForm() {
    this.hotelForm = this.fb.group({
      hotelName:    ['', [Validators.required, Validators.minLength(2)]],
      locationName: ['', Validators.required],
      price:        [null, [Validators.required, Validators.min(0)]],
      totalRooms:   [1,   [Validators.required, Validators.min(1), Validators.max(500)]],
    });

    // keep roomNames array in sync with totalRooms
    this.hotelForm.get('totalRooms')!.valueChanges.subscribe((n: number) => {
      const count = Math.max(1, Math.min(500, +n || 1));
      this._syncRoomNames(count);
    });
  }

  private _buildRoomForm() {
    this.roomForm = this.fb.group({
      hotelName: ['', Validators.required],
      roomName:  ['', Validators.required],
    });
  }

  private _syncRoomNames(count: number) {
    const current = this.roomNames.length;
    const hotelPrefix = this.hotelForm.get('hotelName')?.value || 'Hotel';

    if (count > current) {
      for (let i = current; i < count; i++) {
        this.roomNames.push(`${hotelPrefix} Room  ${i + 1}`);
      }
    } else {
      this.roomNames = this.roomNames.slice(0, count);
    }
  }

  // ── Data loading ──────────────────────────────────────────────────────────
  private _loadHotels() {
    this.loadingHotels.set(true);
    this.hotelsError.set(null);
    this.hotelSvc.getAll().subscribe({
      next: (list) => {
        console.log("Listed hotels:", list);
        this.hotels.set(list.map(h => ({ ...h, rooms: [], roomsLoaded: false })));
        this.loadingHotels.set(false);
      },
      error: (err) => {
        this.hotelsError.set('Failed to load hotels. Please try again.');
        this.loadingHotels.set(false);
        console.error(err);
      },
    });
  }

  private _loadLocations() {
    this.locationSvc.getAll().subscribe({
      next: (locs) => this.locations.set(locs),
      error: (err) => console.error('Could not load locations', err),
    });
  }

  // ── Computed helpers ──────────────────────────────────────────────────────
  reservedCount(h: HotelUI): number {
    return h.rooms.filter(r => r.status?.toLowerCase() === 'OCCUPIED').length;
  }

  // ── MANAGE MODAL ──────────────────────────────────────────────────────────
  openManage(h: HotelUI) {
    this.selectedHotel.set(h);
    if (!h.roomsLoaded) this._fetchRooms(h);
  }

  closeManage() { this.selectedHotel.set(null); }

  private _fetchRooms(h: HotelUI) {
    this.loadingRooms.set(true);
    this.roomSvc.getAllForHotel(h.hotelID).subscribe({
      next: (rooms) => {
        console.log("Listed rooms for hotel", h.hotelID, rooms);
        this._patchHotel(h.hotelID, { rooms, roomsLoaded: true });
        // refresh selectedHotel reference
        const updated = this.hotels().find(x => x.hotelID === h.hotelID);
        if (updated) this.selectedHotel.set(updated);
        this.loadingRooms.set(false);
      },
      error: (err) => {
        console.error('Could not load rooms', err);
        this.loadingRooms.set(false);
      },
    });
  }

  private _patchHotel(name: string, patch: Partial<HotelUI>) {
    this.hotels.update(list =>
      list.map(h => h.hotelID === name ? { ...h, ...patch } : h)
    );
  }

  // ── DELETE HOTEL ──────────────────────────────────────────────────────────
  deleteHotel(name: string) {
    if (!confirm(`Remove "${name}" from the list?`)) return;
    this.hotelSvc.delete(name).subscribe({
      next: () => this.hotels.update(list => list.filter(h => h.hotelID !== name)),
      error: (err) => {
        console.error(err);
        alert('Failed to delete hotel. Please try again.');
      },
    });
  }

  // ── NEW HOTEL MODAL ───────────────────────────────────────────────────────
  openNew() {
    this.hotelForm.reset({ totalRooms: 1 });
    const hotelPrefix = this.hotelForm.get('hotelName')?.value || 'Hotel';

    this.roomNames = [`${hotelPrefix} Room 1`];
    this.createError.set(null);
    this.roomWarning.set(null);
    this.showAddLocation.set(false);
    this.newLocationName = '';
    this.showNewModal.set(true);
  }

  closeNew() {
    if (this.creatingHotel()) return;
    this.showNewModal.set(false);
  }

  updateRoomName(i: number, value: string) {
    this.roomNames[i] = value;
  }

  createHotel() {
    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      return;
    }
    const { hotelName, locationName, price, totalRooms } = this.hotelForm.value;

    this.creatingHotel.set(true);
    this.createError.set(null);
    this.roomWarning.set(null);

    // Step 1: create hotel
    this.hotelSvc.create({ hotelName, locationName, price, totalRooms }).pipe(
      concatMap((hotel) => {
        // Step 2: create rooms sequentially
        const names = this.roomNames.slice(0, totalRooms).map((n, i) => n || `Room ${i + 1}`);
        const calls: Observable<any>[] = names.map(roomName =>
          this.roomSvc.create({ hotelName, roomName }).pipe(
            catchError(err => {
              console.error(`Failed to create room "${roomName}"`, err);
              return of({ __failed: true, roomName });
            })
          )
        );

        return forkJoin(calls).pipe(
          tap(results => {
            const failed = results.filter((r: any) => r?.__failed);
            if (failed.length) {
              this.roomWarning.set(
                `Hotel created, but ${failed.length} room(s) failed: ${failed.map((r: any) => r.roomName).join(', ')}`
              );
            }
          }),
          // carry the hotel through
          concatMap(() => of(hotel))
        );
      }),
      finalize(() => this.creatingHotel.set(false))
    ).subscribe({
      next: (hotel) => {
        const newUI: HotelUI = { ...hotel, rooms: [], roomsLoaded: false };
        this.hotels.update(list => [...list, newUI]);
        if (!this.roomWarning()) this.showNewModal.set(false);
        // if there was a warning, keep modal open so user can see it
      },
      error: (err) => {
        console.error(err);
        this.createError.set(
          err?.error?.message ?? 'Failed to create hotel. Please check your inputs and try again.'
        );
      },
    });
  }

  // ── INLINE LOCATION CREATION ──────────────────────────────────────────────
  toggleAddLocation() {
    this.showAddLocation.update(v => !v);
    this.newLocationName = '';
    this.locationAddError.set(null);
  }

  saveNewLocation() {
    const name = this.newLocationName.trim();
    if (!name) return;
    this.addingLocation.set(true);
    this.locationAddError.set(null);
    this.locationSvc.create(name).subscribe({
      next: (loc) => {
        this.locations.update(list => [...list, loc]);
        this.hotelForm.patchValue({ locationName: loc.locationName });
        this.showAddLocation.set(false);
        this.newLocationName = '';
        this.addingLocation.set(false);
      },
      error: (err) => {
        this.locationAddError.set(err?.error?.message ?? 'Failed to create location.');
        this.addingLocation.set(false);
      },
    });
  }

  // ── STANDALONE ADD ROOM ───────────────────────────────────────────────────
  openAddRoom() {
    this.roomForm.reset();
    this.addRoomError.set(null);
    this.showAddRoomModal.set(true);
  }

  closeAddRoom() {
    if (this.addingRoom()) return;
    this.showAddRoomModal.set(false);
  }

  submitAddRoom() {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }
    const { hotelName, roomName } = this.roomForm.value;
    this.addingRoom.set(true);
    this.addRoomError.set(null);

    this.roomSvc.create({ hotelName, roomName }).subscribe({
      next: (room) => {
        // update rooms list if hotel is loaded
        this._patchHotel(hotelName, {
          rooms: [...(this.hotels().find(h => h.hotelID === hotelName)?.rooms ?? []), room],
        });
        // bump totalRooms display
        const hotel = this.hotels().find(h => h.hotelID === hotelName);
        if (hotel) {
          this._patchHotel(hotelName, { totalRooms: hotel.totalRooms + 1 });
        }
        this.addingRoom.set(false);
        this.showAddRoomModal.set(false);
      },
      error: (err) => {
        this.addRoomError.set(err?.error?.message ?? 'Failed to add room.');
        this.addingRoom.set(false);
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  hotelNames(): string[] {
    return this.hotels().map(h => h.hotelID);
  }

  field(form: FormGroup, name: string) {
    return form.get(name);
  }

  hasError(form: FormGroup, name: string, error: string): boolean {
    const c = form.get(name);
    return !!(c?.touched && c.hasError(error));
  }
}
