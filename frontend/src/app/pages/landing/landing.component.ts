import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../../logo/logo.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LogoComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  searchQuery = '';

  stats = [
    { icon: '★', value: '4.9/5',  label: 'from 12,800+ stays' },
    { icon: '⊙', value: '840+',   label: 'hotels worldwide'   },
  ];

  destinations = [
    { name: 'Coastal', count: 248, image: 'destination-coastal.jpg', tag: 'Oceanfront'     },
    { name: 'Alpine',  count: 132, image: 'destination-alpine.jpg',  tag: 'Mountain'       },
    { name: 'Urban',   count: 386, image: 'destination-city.jpg',    tag: 'City Icons'     },
    { name: 'Desert',  count: 74,  image: 'destination-desert.jpg',  tag: 'Private Oases'  },
  ];

  featuredHotels = [
    { name: 'Villa Serena',  location: 'Amalfi Coast, Italy',    price: 620, rating: 4.9, image: 'destination-coastal.jpg' },
    { name: 'Maison du Lac', location: 'Zermatt, Switzerland',   price: 480, rating: 4.8, image: 'destination-alpine.jpg'  },
    { name: 'The Belmonde',  location: 'Paris, France',          price: 540, rating: 4.9, image: 'destination-city.jpg'    },
  ];

  features = [
    {
      icon: '✦',
      title: 'Curated, never compiled',
      desc: 'Every property is hand-selected by our travel editors — no algorithms, no filler.'
    },
    {
      icon: '◈',
      title: 'Member rates, guaranteed',
      desc: 'Best price across the network or we refund the difference. Always.'
    },
    {
      icon: '◇',
      title: 'Concierge, on call',
      desc: 'From private transfers to a corner suite at sunset — one message away.'
    }
  ];

  testimonials = [
    {
      quote: "I've stopped using anything else. Place-Finder finds places I didn't know I was looking for.",
      name: 'Amélie R.',
      role: 'Member since 2023'
    },
    {
      quote: "The concierge upgraded our anniversary stay to a suite with a private terrace. Unforgettable.",
      name: 'James & Priya K.',
      role: 'Lifetime members'
    }
  ];
}