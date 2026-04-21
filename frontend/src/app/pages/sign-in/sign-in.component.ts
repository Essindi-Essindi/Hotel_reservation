import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthShellComponent } from '../../auth-shell/auth-shell.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AuthShellComponent],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  hotelSuite = 'hotel-suite.jpg';
  showPassword = false;
  submitted = false;
  successMessage = '';

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      rememberMe: [false]
    });
  }

  get username() { return this.form.get('username')!; }
  get password()  { return this.form.get('password')!; }

  usernameError(): string {
    if (!this.submitted || !this.username.errors) return '';
    if (this.username.errors['required'])   return 'Username is required';
    if (this.username.errors['minlength'])  return 'Username must be at least 3 characters';
    if (this.username.errors['maxlength'])  return 'Username is too long';
    return '';
  }

  passwordError(): string {
    if (!this.submitted || !this.password.errors) return '';
    if (this.password.errors['required'])  return 'Password is required';
    if (this.password.errors['maxlength']) return 'Password is too long';
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    // TODO: Call AuthService.login({ username, password }) → maps to Spring Security
    console.log('Login payload:', {
      username: this.username.value,
      password: this.password.value
    });

    this.successMessage = `Welcome back, ${this.username.value}.`;
  }
}
