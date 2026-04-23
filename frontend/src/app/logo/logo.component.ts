import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent {
  /** 'light' = white text (for dark backgrounds), 'dark' = maroon text (for light backgrounds) */
  @Input() variant: 'light' | 'dark' = 'light';
}
