import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {

  form = {
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    terms: false,
  };

  errors: Record<string, string> = {};
  showPassword = false;

  onSubmit(): void {
    this.errors = {};

    // Basic validation — mirrors the React zod schema
    if (!this.form.name || this.form.name.trim().length < 2) {
      this.errors['name'] = 'Name must be at least 2 characters.';
    }

    if (!this.form.username || this.form.username.trim().length < 3) {
      this.errors['username'] = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.form.username)) {
      this.errors['username'] = 'Letters, numbers and underscores only.';
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.form.email || !emailRe.test(this.form.email)) {
      this.errors['email'] = 'Invalid email address.';
    }

    if (!this.form.password || this.form.password.length < 8) {
      this.errors['password'] = 'Password must be at least 8 characters.';
    }

    if (!this.form.terms) {
      this.errors['terms'] = 'You must accept the terms.';
    }

    if (Object.keys(this.errors).length > 0) return;

    // Maps to Java User { name, username, email, phone, password } — role assigned server-side
    const payload = {
      name:     this.form.name,
      username: this.form.username,
      email:    this.form.email,
      phone:    this.form.phone,
      password: this.form.password,
    };

    console.log('Sign up payload:', payload);
    alert(`Account created! Welcome to Wardiere, ${this.form.name}.`);

    // Reset form
    this.form = { name: '', username: '', email: '', phone: '', password: '', terms: false };
  }
}