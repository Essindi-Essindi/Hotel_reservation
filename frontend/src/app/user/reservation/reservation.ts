import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReservationService, NewReservationDto, Reservation, Hotel, Room } from '../../reservation.service';
import { PaymentService, PaymentDto, PaymentMethod } from '../../payment.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavBarComponent],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css']
})
export class ReservationComponent implements OnInit {

  useMockData: boolean = true;

  hotels: Hotel[] = [];
  rooms: Room[] = [];
  filteredRooms: Room[] = [];


  selectedHotelId: string = '';
  selectedHotelName: string = '';
  selectedRoomId: string = '';
  selectedRoom: Room | null = null;


  showModal: boolean = false;
  showPaymentModal: boolean = false;
  showReceipt: boolean = false;
  minDate: string = '';
  isLoading: boolean = false;
  isLoadingRooms: boolean = false;
  errorMessage: string = '';


  newReservation: NewReservationDto = {
    currentDate: '',
    reservationStartDate: '',
    reservationEndDate: '',
    startTime: '14:00',
    endTime: '11:00',
    duration: 0,
    cost: 0,
    userId: 1,
    hotelId: '',
    roomId: ''
  };

  paymentData: PaymentDto = {
    paymentID: '',
    paymentDate: '',
    amount: 0,
    paymentMethod: 'CREDIT_CARD',
    reservationID: 0,
    userID: 1
  };

  availablePaymentMethods: PaymentMethod[] = ['CREDIT_CARD', 'PAYPAL', 'MOMO', 'ORANGE_MONEY'];

  confirmedReservation: Reservation | null = null;
  selectedReceiptReservation: Reservation | null = null;
  confirmedPayment: PaymentDto | null = null;

  constructor(
    private reservationService: ReservationService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadHotels();
    this.setMinDate();
    this.setDefaultDates();
  }

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  setDefaultDates(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.newReservation.reservationStartDate = today.toISOString().split('T')[0];
    this.newReservation.reservationEndDate = tomorrow.toISOString().split('T')[0];
  }

  loadUserData(): void {
    const storedUser = localStorage.getItem('placefinder_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.newReservation.userId = user.id || 1;
      this.paymentData.userID = user.id || 1;
    } else {
      this.newReservation.userId = 1;
      this.paymentData.userID = 1;
    }
  }

  loadHotels(): void {
    this.isLoading = true;

    if (this.useMockData) {
      setTimeout(() => {
        this.hotels = [
          {
            hotelID: 'SAFYAD',
            location: { locationId: 1, locationName: 'Bastos' },
            isDeleted: false,
            deletedAt: null,
            totalRooms: 5,
            price: 299
          },
          {
            hotelID: 'H002',
            location: { locationId: 2, locationName: 'Coastal Bay' },
            isDeleted: false,
            deletedAt: null,
            totalRooms: 8,
            price: 399
          },
          {
            hotelID: 'H003',
            location: { locationId: 3, locationName: 'Highland Valley' },
            isDeleted: false,
            deletedAt: null,
            totalRooms: 10,
            price: 229
          },
          {
            hotelID: 'H004',
            location: { locationId: 4, locationName: 'Arts District' },
            isDeleted: false,
            deletedAt: null,
            totalRooms: 9,
            price: 189
          }
        ];

        this.isLoading = false;
      }, 500);
    } else {
      this.reservationService.getAllHotels().subscribe({
        next: (hotels) => {
          this.hotels = hotels.filter(hotel => !hotel.isDeleted);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load hotels:', error);
          this.errorMessage = 'Failed to load hotels. Please check if backend is running.';
          this.isLoading = false;
        }
      });
    }
  }

  onHotelChange(): void {
    const selectedHotel = this.getSelectedHotel();
    if (!selectedHotel) return;

    this.selectedHotelName = selectedHotel.location.locationName;
    this.newReservation.hotelId = this.selectedHotelId;
    this.selectedRoomId = '';
    this.selectedRoom = null;
    this.filteredRooms = [];

    this.loadRoomsForHotel();
  }

  loadRoomsForHotel(): void {
    if (!this.selectedHotelName) return;

    this.isLoadingRooms = true;

    if (this.useMockData) {
      setTimeout(() => {
        const selectedHotel = this.getSelectedHotel();
        if (!selectedHotel) return;

        const totalRooms = selectedHotel.totalRooms;
        const generatedRooms: Room[] = [];

        for (let i = 1; i <= totalRooms; i++) {
          const isOccupied = (i === 3);
          generatedRooms.push({
            roomID: `Room${i}`,
            status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
            hotel: selectedHotel
          });
        }

        this.rooms = generatedRooms;
        this.filteredRooms = generatedRooms;
        this.isLoadingRooms = false;
      }, 500);
    } else {
      this.reservationService.getAllRoomsForHotel(this.selectedHotelName).subscribe({
        next: (rooms) => {
          this.rooms = rooms;
          this.filteredRooms = rooms;
          this.isLoadingRooms = false;
        },
        error: (error) => {
          console.error('Failed to load rooms:', error);
          this.errorMessage = 'Failed to load rooms for this hotel.';
          this.isLoadingRooms = false;
        }
      });
    }
  }

  onRoomSelect(room: Room): void {
    if (room.status !== 'AVAILABLE') return;

    this.selectedRoomId = room.roomID;
    this.selectedRoom = room;
    this.newReservation.roomId = room.roomID;
  }

  getAvailableRoomsCount(): number {
    return this.filteredRooms.filter(r => r.status === 'AVAILABLE').length;
  }

  getTotalRoomsCount(): number {
    return this.filteredRooms.length;
  }

  getSelectedHotel(): Hotel | undefined {
    return this.hotels.find(h => h.hotelID === this.selectedHotelId);
  }

  getHotelDisplayName(hotel: Hotel): string {
    return hotel.hotelID || 'Hotel';
  }

  getHotelName(): string {
    const hotel = this.getSelectedHotel();
    if (!hotel) return '';
    return hotel.hotelID || 'Hotel';
  }

  getHotelLocation(): string {
    const hotel = this.getSelectedHotel();
    if (!hotel) return '';
    return hotel.location?.locationName || 'Location';
  }

  getRoomPrice(): number {
    const hotel = this.getSelectedHotel();
    return hotel?.price || 0;
  }

  calculateDurationAndCost(): void {
    if (this.newReservation.reservationStartDate && this.newReservation.reservationEndDate && this.selectedRoom) {
      const start = new Date(this.newReservation.reservationStartDate);
      const end = new Date(this.newReservation.reservationEndDate);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (nights > 0) {
        this.newReservation.duration = nights;
        this.newReservation.cost = nights * this.getRoomPrice();
      } else {
        this.newReservation.duration = 0;
        this.newReservation.cost = 0;
      }
    }
  }

  openModal(): void {
    if (!this.selectedRoom) return;
    this.newReservation.currentDate = new Date().toISOString();
    this.calculateDurationAndCost();
    this.showModal = true;
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.errorMessage = '';
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.errorMessage = '';
  }

  openPaymentModal(): void {
    if (!this.newReservation.reservationStartDate || !this.newReservation.reservationEndDate) {
      this.errorMessage = 'Please select check-in and check-out dates.';
      return;
    }

    if (this.newReservation.duration <= 0) {
      this.errorMessage = 'Please select valid dates (at least 1 night).';
      return;
    }

    this.closeModal();
    this.resetPaymentForm();
    this.showPaymentModal = true;
  }

  resetPaymentForm(): void {
    this.paymentData = {
      paymentID: '',
      paymentDate: new Date().toISOString(),
      amount: this.newReservation.cost,
      paymentMethod: 'CREDIT_CARD',
      reservationID: 0,
      userID: this.newReservation.userId
    };
    this.errorMessage = '';
  }

  processPayment(): void {
    if (!this.paymentData.paymentMethod) {
      this.errorMessage = 'Please select a payment method.';
      return;
    }

    this.isLoading = true;
    this.paymentData.paymentDate = new Date().toISOString();
    this.paymentData.amount = this.newReservation.cost;

    if (this.useMockData) {
      setTimeout(() => {
        const mockPayment: PaymentDto = {
          paymentID: 'PAY-' + Math.floor(Math.random() * 90000) + 10000,
          paymentDate: this.paymentData.paymentDate,
          amount: this.paymentData.amount,
          paymentMethod: this.paymentData.paymentMethod,
          reservationID: 0,
          userID: this.paymentData.userID
        };

        this.confirmedPayment = mockPayment;
        this.createReservationAfterPayment();
      }, 1500);
    } else {
      this.paymentService.createPayment(this.paymentData).subscribe({
        next: (payment) => {
          this.confirmedPayment = payment;
          this.createReservationAfterPayment();
        },
        error: (error) => {
          console.error('Payment failed:', error);
          this.errorMessage = 'Payment processing failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  createReservationAfterPayment(): void {
    this.calculateDurationAndCost();
    this.newReservation.currentDate = new Date().toISOString();

    if (this.useMockData) {
      setTimeout(() => {
        const reservation: Reservation = {
          reservationID: Math.floor(Math.random() * 90000) + 10000,
          DateIssued: new Date().toISOString(),
          reservationStartDate: this.newReservation.reservationStartDate,
          reservationEndDate: this.newReservation.reservationEndDate,
          startTime: this.newReservation.startTime,
          endTime: this.newReservation.endTime,
          duration: this.newReservation.duration,
          state: 'Confirmed',
          deleted: false,
          cost: this.newReservation.cost,
          userId: this.newReservation.userId,
          hotelId: this.newReservation.hotelId,
          roomId: this.newReservation.roomId,
          cancelledAt: null,
          deletedAt: null
        };

        if (this.confirmedPayment) {
          this.confirmedPayment.reservationID = reservation.reservationID;
        }

        this.confirmedReservation = reservation;
        this.selectedReceiptReservation = reservation;

        const roomIndex = this.rooms.findIndex(r => r.roomID === this.selectedRoom!.roomID);
        if (roomIndex !== -1) {
          this.rooms[roomIndex].status = 'OCCUPIED';
        }

        this.filteredRooms = [...this.rooms];
        this.showPaymentModal = false;
        this.showReceipt = true;
        this.isLoading = false;
      }, 1000);
    } else {
      this.reservationService.createReservation(this.newReservation).subscribe({
        next: (reservation) => {
          this.confirmedReservation = reservation;
          this.selectedReceiptReservation = reservation;
          if (this.confirmedPayment) {
            const updatedPayment = { ...this.confirmedPayment, reservationID: reservation.reservationID };
            this.paymentService.updatePayment(this.confirmedPayment.paymentID, updatedPayment).subscribe({
              next: () => {
                this.confirmedPayment = updatedPayment;
              },
              error: (err) => console.error('Failed to update payment with reservation ID:', err)
            });
          }
          this.reservationService.updateRoomStatus(this.selectedRoom!.roomID).subscribe({
            next: () => {
              const roomIndex = this.rooms.findIndex(r => r.roomID === this.selectedRoom!.roomID);
              if (roomIndex !== -1) {
                this.rooms[roomIndex].status = 'OCCUPIED';
              }
              this.filteredRooms = [...this.rooms];
            },
            error: (err) => console.error('Failed to update room status:', err)
          });
          this.showPaymentModal = false;
          this.showReceipt = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Reservation creation failed:', error);
          this.errorMessage = 'Reservation failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  downloadReceipt(): void {
    if (!this.selectedReceiptReservation) return;

    const hotelName = this.getHotelName();
    const hotelLocation = this.getHotelLocation();
    const hotelPrice = this.getRoomPrice();

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
            background: #f5f0ea;
          }
          .receipt-paper {
            max-width: 550px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .receipt {
            padding: 2rem;
          }
          .receipt h4 {
            color: #2c7a4d;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .receipt-details {
            background: #e8f5e9;
            padding: 1.5rem;
            border-radius: 16px;
            margin: 1rem 0;
          }
          .receipt-details p {
            margin: 0.8rem 0;
            padding: 0.5rem 0;
            border-bottom: 1px dashed #c8e6c9;
            display: flex;
            justify-content: space-between;
            font-size: 1rem;
          }
          .receipt-details p strong {
            color: #2c3e2f;
            font-weight: 600;
          }
          .payment-details {
            background: #e3f2fd;
            padding: 1rem;
            border-radius: 12px;
            margin-top: 1rem;
          }
          .payment-details h5 {
            color: #1565c0;
            margin-bottom: 0.8rem;
          }
          .receipt-footer {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 2px solid #e8f5e9;
            text-align: center;
            font-size: 0.85rem;
            color: #6b5b4e;
          }
        </style>
      </head>
      <body>
        <div class="receipt-paper">
          <div class="receipt">
            <h4><i class="fas fa-check-circle"></i> Booking Confirmed</h4>
            <div class="receipt-details">
              <p><strong>Reservation ID:</strong> ${this.selectedReceiptReservation.reservationID}</p>
              <p><strong>Hotel:</strong> ${hotelName}</p>
              <p><strong>Location:</strong> ${hotelLocation}</p>
              <p><strong>Room:</strong> ${this.selectedReceiptReservation.roomId}</p>
              <p><strong>Check-in:</strong> ${this.selectedReceiptReservation.reservationStartDate} at ${this.selectedReceiptReservation.startTime}</p>
              <p><strong>Check-out:</strong> ${this.selectedReceiptReservation.reservationEndDate} at ${this.selectedReceiptReservation.endTime}</p>
              <p><strong>Duration:</strong> ${this.selectedReceiptReservation.duration} nights</p>
              <p><strong>Price per night:</strong> $${hotelPrice}</p>
              <p><strong>Total Cost:</strong> $${this.selectedReceiptReservation.cost}</p>
              <p><strong>Status:</strong> ${this.selectedReceiptReservation.state}</p>
              <p><strong>Date Issued:</strong> ${new Date(this.selectedReceiptReservation.DateIssued).toLocaleString()}</p>
            </div>
            ${this.confirmedPayment ? `
            <div class="payment-details">
              <h5><i class="fas fa-credit-card"></i> Payment Information</h5>
              <p><strong>Payment ID:</strong> ${this.confirmedPayment.paymentID}</p>
              <p><strong>Payment Method:</strong> ${this.formatPaymentMethod(this.confirmedPayment.paymentMethod)}</p>
              <p><strong>Amount Paid:</strong> $${this.confirmedPayment.amount}</p>
              <p><strong>Payment Date:</strong> ${new Date(this.confirmedPayment.paymentDate).toLocaleString()}</p>
            </div>
            ` : ''}
            <div class="receipt-footer">
              <i class="fas fa-check-circle"></i> Thank you for choosing Placefinder!
            </div>
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

  formatPaymentMethod(method: string): string {
    const methods: { [key: string]: string } = {
      'CREDIT_CARD': 'Credit Card',
      'DEBIT_CARD': 'Debit Card',
      'PAYPAL': 'PayPal',
      'MOMO': 'MTN Mobile Money',
      'ORANGE_MONEY': 'Orange Money'
    };
    return methods[method] || method;
  }

  resetAndClose(): void {
    this.showModal = false;
    this.showPaymentModal = false;
    this.showReceipt = false;
    this.selectedRoomId = '';
    this.selectedRoom = null;
    this.selectedReceiptReservation = null;
    this.confirmedReservation = null;
    this.confirmedPayment = null;
    this.errorMessage = '';
    this.setDefaultDates();
  }
}
