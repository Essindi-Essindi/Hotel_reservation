import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ReservationService, Reservation, Hotel } from '../../reservation.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavBarComponent],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History implements OnInit {
  useMockData: boolean = true;  
  
  userId: number = 1;
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  hotels: Hotel[] = [];
  
  isLoading: boolean = false;
  showCancelModal: boolean = false;
  showDeleteModal: boolean = false;
  showReceiptModal: boolean = false;
  selectedReservation: Reservation | null = null;
  selectedReceiptReservation: Reservation | null = null;
  
  filters = {
    state: 'all',
    hotelId: 'all',
    date: ''
  };
  
  uniqueHotelIds: string[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadHotels();
    this.loadReservations();
  }

  loadUserData(): void {
    const storedUser = localStorage.getItem('placefinder_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.id || 1;
    }
  }

  loadHotels(): void {
    if (this.useMockData) {
      this.hotels = [
        { 
          hotelID: 'H001', 
          location: { locationId: 1, locationName: 'Grand Plaza Hotel - Downtown City Center' },
          isDeleted: false,
          deletedAt: null,
          totalRooms: 12,
          price: 299
        },
        { 
          hotelID: 'H002', 
          location: { locationId: 2, locationName: 'Ocean View Resort - Coastal Bay' },
          isDeleted: false,
          deletedAt: null,
          totalRooms: 8,
          price: 399
        },
        { 
          hotelID: 'H003', 
          location: { locationId: 3, locationName: 'Mountain Retreat Lodge - Highland Valley' },
          isDeleted: false,
          deletedAt: null,
          totalRooms: 10,
          price: 229
        },
        { 
          hotelID: 'H004', 
          location: { locationId: 4, locationName: 'Sunset Boutique Hotel - Arts District' },
          isDeleted: false,
          deletedAt: null,
          totalRooms: 9,
          price: 189
        }
      ];
    } else {
      this.reservationService.getAllHotels().subscribe({
        next: (hotels) => {
          this.hotels = hotels.filter(hotel => !hotel.isDeleted);
        },
        error: (error) => {
          console.error('Failed to load hotels:', error);
        }
      });
    }
  }

  loadReservations(): void {
    this.isLoading = true;
    
    if (this.useMockData) {
      setTimeout(() => {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        this.reservations = [
          {
            reservationID: 1001,
            DateIssued: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(),
            reservationStartDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
            reservationEndDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8).toISOString().split('T')[0],
            startTime: '14:00',
            endTime: '11:00',
            duration: 3,
            state: 'Confirmed',
            deleted: false,
            cost: 897,
            userId: this.userId,
            hotelId: 'H001',
            roomId: 'Room1',
            cancelledAt: null,
            deletedAt: null
          },
          {
            reservationID: 1002,
            DateIssued: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10).toISOString(),
            reservationStartDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0],
            reservationEndDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
            startTime: '15:00',
            endTime: '10:00',
            duration: 3,
            state: 'Confirmed',
            deleted: false,
            cost: 1197,
            userId: this.userId,
            hotelId: 'H002',
            roomId: 'Room2',
            cancelledAt: null,
            deletedAt: null
          },
          {
            reservationID: 1003,
            DateIssued: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - 20).toISOString(),
            reservationStartDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - 5).toISOString().split('T')[0],
            reservationEndDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - 2).toISOString().split('T')[0],
            startTime: '13:00',
            endTime: '12:00',
            duration: 3,
            state: 'Completed',
            deleted: false,
            cost: 687,
            userId: this.userId,
            hotelId: 'H003',
            roomId: 'Room3',
            cancelledAt: null,
            deletedAt: null
          },
          {
            reservationID: 1004,
            DateIssued: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - 30).toISOString(),
            reservationStartDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - 15).toISOString().split('T')[0],
            reservationEndDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - 12).toISOString().split('T')[0],
            startTime: '16:00',
            endTime: '14:00',
            duration: 3,
            state: 'Cancelled',
            deleted: false,
            cost: 525,
            userId: this.userId,
            hotelId: 'H001',
            roomId: 'Room2',
            cancelledAt: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - 25).toISOString(),
            deletedAt: null
          },
          {
            reservationID: 1005,
            DateIssued: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString(),
            reservationStartDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12).toISOString().split('T')[0],
            reservationEndDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString().split('T')[0],
            startTime: '14:00',
            endTime: '11:00',
            duration: 2,
            state: 'Confirmed',
            deleted: false,
            cost: 378,
            userId: this.userId,
            hotelId: 'H004',
            roomId: 'Room1',
            cancelledAt: null,
            deletedAt: null
          }
        ];
        
        this.extractUniqueHotelIds();
        this.applyFilters();
        this.isLoading = false;
      }, 500);
    } else {
      this.reservationService.getAllReservationsByUserId(this.userId).subscribe({
        next: (reservations) => {
          this.reservations = reservations.filter(r => !r.deleted);
          this.extractUniqueHotelIds();
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load reservations:', error);
          this.isLoading = false;
        }
      });
    }
  }

  private extractUniqueHotelIds(): void {
    const hotels = new Set(this.reservations.map(r => r.hotelId));
    this.uniqueHotelIds = Array.from(hotels);
  }

  getHotelName(hotelId: string): string {
    const hotel = this.hotels.find(h => h.hotelID === hotelId);
    if (hotel) {
      return hotel.location?.locationName?.split(' - ')[0] || hotelId;
    }
  
    const hotels: { [key: string]: string } = {
      'H001': 'Grand Plaza Hotel',
      'H002': 'Ocean View Resort',
      'H003': 'Mountain Retreat Lodge',
      'H004': 'Sunset Boutique Hotel'
    };
    return hotels[hotelId] || hotelId;
  }

  getHotelLocation(hotelId: string): string {
    const hotel = this.hotels.find(h => h.hotelID === hotelId);
    if (hotel) {
      return hotel.location?.locationName?.split(' - ')[1] || hotel.location?.locationName || '';
    }
    return '';
  }

  applyFilters(): void {
    let filtered = this.reservations.filter(r => !r.deleted);
    
    if (this.filters.state !== 'all') {
      filtered = filtered.filter(r => r.state === this.filters.state);
    }
    
    if (this.filters.hotelId !== 'all') {
      filtered = filtered.filter(r => r.hotelId === this.filters.hotelId);
    }
    
    if (this.filters.date) {
      filtered = filtered.filter(r => r.reservationStartDate === this.filters.date);
    }
    
    this.filteredReservations = filtered;
  }

  clearFilters(): void {
    this.filters = {
      state: 'all',
      hotelId: 'all',
      date: ''
    };
    this.applyFilters();
  }

  getStatusClass(state: string): string {
    switch(state) {
      case 'Confirmed': return 'status-confirmed';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  openReceiptModal(reservation: Reservation): void {
    this.selectedReceiptReservation = reservation;
    this.showReceiptModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeReceiptModal(): void {
    this.showReceiptModal = false;
    this.selectedReceiptReservation = null;
    document.body.style.overflow = '';
  }

  downloadReceipt(): void {
    const receiptElement = document.getElementById('receiptPaper');
    if (!receiptElement || !this.selectedReceiptReservation) return;
    
    const hotelName = this.getHotelName(this.selectedReceiptReservation.hotelId);
    const hotelLocation = this.getHotelLocation(this.selectedReceiptReservation.hotelId);
    
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt_${this.selectedReceiptReservation.reservationID}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 2rem;
            background: white;
          }
          .receipt-paper {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border: 1px solid #ddd;
            border-radius: 12px;
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px solid #571726;
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
          }
          .receipt-header i {
            font-size: 2.5rem;
            color: #571726;
            margin-bottom: 0.5rem;
          }
          .receipt-header h2 {
            color: #571726;
            font-size: 1.5rem;
            margin: 0.5rem 0;
          }
          .receipt-header p {
            color: #6b5b4e;
            font-size: 0.9rem;
          }
          .receipt-body {
            margin-bottom: 1.5rem;
          }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            padding: 0.6rem 0;
          }
          .receipt-label {
            font-weight: 600;
            color: #6b5b4e;
          }
          .receipt-value {
            font-weight: 500;
            color: #3c2a2a;
          }
          .receipt-value.total {
            font-size: 1.2rem;
            font-weight: 800;
            color: #2c7a4d;
          }
          .receipt-divider {
            height: 1px;
            background: #eee;
            margin: 0.5rem 0;
          }
          .status-badge {
            display: inline-block;
            padding: 0.2rem 0.8rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .status-confirmed { background: #e6b422; color: #2c2b26; }
          .status-completed { background: #2c7a4d; color: white; }
          .status-cancelled { background: #c0392b; color: white; }
          .receipt-footer {
            margin-top: 1rem;
            padding-top: 0.5rem;
            border-top: 1px dashed #ddd;
            font-size: 0.8rem;
            color: #c0392b;
          }
          .receipt-thankyou {
            text-align: center;
            padding-top: 1rem;
            border-top: 1px solid #eee;
            font-size: 0.8rem;
            color: #6b5b4e;
          }
        </style>
      </head>
      <body>
        <div class="receipt-paper">
          <div class="receipt-header">
            <i class="fas fa-hotel"></i>
            <h2>PlaceFinder</h2>
            <p>Hotel Reservation Receipt</p>
          </div>
          
          <div class="receipt-body">
            <div class="receipt-row">
              <span class="receipt-label">Reservation ID:</span>
              <span class="receipt-value">${this.selectedReceiptReservation.reservationID}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Date Issued:</span>
              <span class="receipt-value">${new Date(this.selectedReceiptReservation.DateIssued).toLocaleString()}</span>
            </div>
            <div class="receipt-divider"></div>
            
            <div class="receipt-row">
              <span class="receipt-label">Hotel:</span>
              <span class="receipt-value">${hotelName}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Location:</span>
              <span class="receipt-value">${hotelLocation}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Room ID:</span>
              <span class="receipt-value">${this.selectedReceiptReservation.roomId}</span>
            </div>
            <div class="receipt-divider"></div>
            
            <div class="receipt-row">
              <span class="receipt-label">Check-in:</span>
              <span class="receipt-value">${this.selectedReceiptReservation.reservationStartDate} at ${this.selectedReceiptReservation.startTime}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Check-out:</span>
              <span class="receipt-value">${this.selectedReceiptReservation.reservationEndDate} at ${this.selectedReceiptReservation.endTime}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Duration:</span>
              <span class="receipt-value">${this.selectedReceiptReservation.duration} night(s)</span>
            </div>
            <div class="receipt-divider"></div>
            
            <div class="receipt-row">
              <span class="receipt-label">Total Cost:</span>
              <span class="receipt-value total">$${this.selectedReceiptReservation.cost}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Status:</span>
              <span class="receipt-value status-badge ${this.getStatusClass(this.selectedReceiptReservation.state)}">
                ${this.selectedReceiptReservation.state}
              </span>
            </div>
            
            ${this.selectedReceiptReservation.state === 'Cancelled' && this.selectedReceiptReservation.cancelledAt ? `
            <div class="receipt-footer">
              <p><i class="fas fa-info-circle"></i> Cancelled on: ${new Date(this.selectedReceiptReservation.cancelledAt).toLocaleDateString()}</p>
            </div>
            ` : ''}
          </div>
          
          <div class="receipt-thankyou">
            <p>Thank you for choosing PlaceFinder!</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${this.selectedReceiptReservation.reservationID}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  openCancelModal(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.showCancelModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedReservation = null;
    document.body.style.overflow = '';
  }

  confirmCancel(): void {
    if (!this.selectedReservation) return;
    
    if (this.useMockData) {
      const reservation = this.reservations.find(r => r.reservationID === this.selectedReservation!.reservationID);
      if (reservation) {
        reservation.state = 'Cancelled';
        reservation.cancelledAt = new Date().toISOString();
      }
      this.applyFilters();
      this.closeCancelModal();
    } else {
      this.reservationService.cancelReservation(this.selectedReservation.reservationID).subscribe({
        next: (updatedReservation) => {
          const index = this.reservations.findIndex(r => r.reservationID === updatedReservation.reservationID);
          if (index !== -1) {
            this.reservations[index] = updatedReservation;
          }
          this.applyFilters();
          this.closeCancelModal();
        },
        error: (error) => {
          console.error('Failed to cancel reservation:', error);
        }
      });
    }
  }

  openDeleteModal(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedReservation = null;
    document.body.style.overflow = '';
  }

  confirmDelete(): void {
    if (!this.selectedReservation) return;
    
    if (this.useMockData) {
      const reservation = this.reservations.find(r => r.reservationID === this.selectedReservation!.reservationID);
      if (reservation) {
        reservation.deleted = true;
        reservation.deletedAt = new Date().toISOString();
      }
      this.applyFilters();
      this.closeDeleteModal();
    } else {
      this.reservationService.deleteReservation(this.selectedReservation.reservationID).subscribe({
        next: (deletedReservation) => {
          const index = this.reservations.findIndex(r => r.reservationID === deletedReservation.reservationID);
          if (index !== -1) {
            this.reservations[index] = deletedReservation;
          }
          this.applyFilters();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Failed to delete reservation:', error);
        }
      });
    }
  }

  printHistory(): void {
    window.print();
  }
}