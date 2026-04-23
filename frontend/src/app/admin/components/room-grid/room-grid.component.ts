import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-room-grid',
  imports: [],
  templateUrl: './room-grid.component.html',
  styleUrl: './room-grid.component.css'
})
export class RoomGridComponent {
  @Input() rows: number = 0;
  @Input() cols: number = 0;
  @Input() rooms: any[] = [];
  @Input() cellSize: string = '';
  @Input() generatorMode: boolean = false;
}
