import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private router: Router) {
  }
  @Input() userId: number = Number(localStorage.getItem("userId")) || 1;
  userName: string = localStorage.getItem("username") || 'Guest User';


  showProfileModal: boolean = false;
  editProfile: UserProfile = {
    id: 1,
    name: '',
    username: '',
    email: '',
    phone: ''
  };

  private backupProfile: UserProfile | null = null;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // const user = localStorage.getItem('placefinder_user');
    const fullName = localStorage.getItem("name");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const phone =  localStorage.getItem("telephone");
    const userId = localStorage.getItem("userId");
    if (fullName && username && email && phone && phone) {
      const userData: UserProfile = {
        id: Number(userId),
        name: fullName,
        username: username,
        email: email,
        phone: phone,
      };
      this.userName = userData.name || 'Guest User';
      this.userId = userData.id || 1;
      this.editProfile = { ...userData };
    } else {
      this.userName = username || 'Alex Johnson';
      this.userId = Number(userId) || 1;
      this.editProfile = {
        id: Number(userId) || 1,
        name: fullName || 'Alex Johnson',
        username: username || 'alexj',
        email: email || 'alex.johnson@example.com',
        phone: phone || '+1 (555) 123-4567'
      };
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('placefinder_user', JSON.stringify(this.editProfile));
  }


  openProfileModal(): void {

    this.backupProfile = { ...this.editProfile };
    this.showProfileModal = true;
    document.body.style.overflow = 'hidden';
  }


  closeProfileModal(): void {
    this.showProfileModal = false;
    document.body.style.overflow = '';
    this.backupProfile = null;
  }
  cancelEdit(): void {
    if (this.backupProfile) {
      this.editProfile = { ...this.backupProfile };
      this.userName = this.editProfile.name;
    }
    this.closeProfileModal();
  }

  saveProfile(): void {
    if (!this.editProfile.name.trim()) {
      this.editProfile.name = 'Place Finder User';
    }
    if (!this.editProfile.username.trim()) {
      this.editProfile.username = 'explorer_' + Date.now();
    }
    if (!this.editProfile.email.trim()) {
      this.editProfile.email = 'user@placefinder.com';
    }
    if (!this.editProfile.phone.trim()) {
      this.editProfile.phone = 'Not provided';
    }

    this.userName = this.editProfile.name;

    this.saveToLocalStorage();

    this.closeProfileModal();

    this.showToastMessage('Profile updated successfully!');
  }

  private showToastMessage(message: string): void {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#2d6a4f';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '10000';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  onLogout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('placefinder_user');
    this.userName = 'Guest User';
    this.editProfile = {
      id: 0,
      name: 'Guest User',
      username: 'guest',
      email: '',
      phone: ''
    };
    this.showToastMessage('Logged out successfully');
    this.router.navigate(['']);
  }
}
