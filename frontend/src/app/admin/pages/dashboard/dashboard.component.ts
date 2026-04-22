import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit() {
    new Chart('revenueChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Revenue',
          data: [5000, 8000, 6000, 12000, 15000],
          borderColor: '#7b1e2b',
          backgroundColor: 'rgba(123,30,43,0.2)',
          fill: true
        }]
      }
    });
  }
}