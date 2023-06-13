import { Component, OnInit } from '@angular/core';
import { TimerService } from 'src/app/services/api.time.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  private _minutes: number = 0;
  private _seconds: number = 0;
  timerIsActive: boolean = false;
  percentage: number = 100;

  constructor(
    private timerService: TimerService,
  ) {
    this.timerService.getTimer().subscribe({
      next: ({ active, time, percentage }) => {
        this.timerIsActive = active;
        this.percentage = percentage;
        this._minutes = time.minutes;
        this._seconds = time.seconds;
      }
    });
  }

  get minutes(): string {
    return String(this._minutes).padStart(2, '0');
  }

  get seconds(): string {
    return String(this._seconds).padStart(2, '0');
  }
}
