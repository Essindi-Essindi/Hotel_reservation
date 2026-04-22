import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.css']
})
export class AuthShellComponent {
  @Input() image!: string;
  @Input() imageAlt: string = 'Hotel';
  @Input() eyebrow!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
}
