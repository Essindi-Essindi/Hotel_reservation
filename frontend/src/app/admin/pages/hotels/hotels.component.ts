import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-hotels',
    standalone: true,
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css'],
  imports: [CommonModule, FormsModule]
})
export class HotelsComponent implements OnInit {

  showModal = false;

  hotels: any[] = [];

  newHotel = {
    name: '',
    location: ''
  };

  ngOnInit(): void {
    // initial dummy data (you can remove if not needed)
    this.hotels = [
      { name: 'Hotel Paradise', location: 'Yaoundé' },
      { name: 'Royal Palace', location: 'Douala' }
    ];
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveHotel() {
    if (!this.newHotel.name || !this.newHotel.location) return;

    this.hotels.push({
      name: this.newHotel.name,
      location: this.newHotel.location
    });

    this.newHotel = { name: '', location: '' };
    this.closeModal();
  }

  deleteHotel(index: number) {
    this.hotels.splice(index, 1);
  }
}