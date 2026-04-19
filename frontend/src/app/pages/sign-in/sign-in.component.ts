import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {

  form = { username: '', password: '', remember: false };
  errors: Record<string, string> = {};
  showPassword = false;

  onSubmit(): void {
    this.errors = {};

    if (!this.form.username || this.form.username.trim().length < 3) {
      this.errors['username'] = 'Username must be at least 3 characters.';
    }
    if (!this.form.password) {
      this.errors['password'] = 'Password is required.';
    }

    if (Object.keys(this.errors).length > 0) return;

    // Maps to Spring Security username/password auth — wire up AuthService here
    console.log('Sign in payload:', {
      username: this.form.username,
      password: this.form.password,
    });

    alert(`Welcome back, ${this.form.username}!`);
  }
}