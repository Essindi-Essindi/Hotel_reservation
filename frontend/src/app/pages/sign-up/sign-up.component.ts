import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { AuthShellComponent } from '../../auth-shell/auth-shell.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AuthShellComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  hotelLobby = 'hotel-lobby.jpg';
  showPassword = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email:    ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone:    ['', [Validators.maxLength(20), Validators.pattern(/^[0-9+\-\s()]*$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      terms:    [false, [Validators.requiredTrue]]
    });
  }

  get name()     { return this.form.get('name')!; }
  get username() { return this.form.get('username')!; }
  get email()    { return this.form.get('email')!; }
  get phone()    { return this.form.get('phone')!; }
  get password() { return this.form.get('password')!; }
  get terms()    { return this.form.get('terms')!; }

  errorFor(ctrl: AbstractControl, field: string): string {
    if (!this.submitted || !ctrl.errors) return '';
    const e = ctrl.errors;
    if (e['required'])   return `${field} is required`;
    if (e['requiredTrue']) return 'You must accept the terms';
    if (e['minlength'])  return `${field} must be at least ${e['minlength'].requiredLength} characters`;
    if (e['maxlength'])  return `${field} is too long`;
    if (e['email'])      return 'Invalid email address';
    if (e['pattern']) {
      if (field === 'Username') return 'Letters, numbers and underscores only';
      if (field === 'Phone')    return 'Invalid phone number';
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.form.invalid) return;

    // Maps to Java User { name, username, email, phone, password } — role assigned server-side
    const payload = {
      name:     this.name.value,
      username: this.username.value,
      email:    this.email.value,
      phone:    this.phone.value || null,
      password: this.password.value
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.successMessage = `Welcome to Place-Finder, ${this.name.value}!`;
        this.form.reset();
        this.submitted = false;
        // Optionally navigate to sign-in or dashboard
        // this.router.navigate(['/sign-in']);
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }
}
