import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private timer: any;
    private timerSubject: Subject<{ active: boolean; time: { minutes: number; seconds: number }; percentage: number }> = new Subject<{ active: boolean; time: { minutes: number; seconds: number }; percentage: number }>();
    private totalSeconds = 0;
    private initialTotalSeconds = 0;

    constructor() { }

    startTimer(minutes: number, seconds: number): void {
        this.totalSeconds = minutes * 60 + seconds;
        this.initialTotalSeconds = this.totalSeconds;
        this.timer = setInterval(() => {
            this.totalSeconds--;
            if (this.totalSeconds === 0) {
                this.stopTimer();
            } else {
                const time = this.calculateTime(this.totalSeconds);
                const percentage = this.calculatePercentage(this.totalSeconds, this.initialTotalSeconds);
                this.timerSubject.next({ active: true, time, percentage });
            }
        }, 1000);
    }

    pauseTimer(): void {
        clearInterval(this.timer);
        const time = this.calculateTime(this.totalSeconds);
        const percentage = this.calculatePercentage(this.totalSeconds, this.initialTotalSeconds);
        this.timerSubject.next({ active: false, time, percentage });
    }

    stopTimer(): void {
        clearInterval(this.timer);
        this.totalSeconds = 0;
        this.timerSubject.next({ active: false, time: { minutes: 0, seconds: 0 }, percentage: 0 });
    }

    getTimer(): Observable<{ active: boolean; time: { minutes: number; seconds: number }; percentage: number }> {
        return this.timerSubject.asObservable();
    }

    private calculateTime(totalSeconds: number): { minutes: number; seconds: number } {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return { minutes, seconds };
    }

    private calculatePercentage(currentSeconds: number, initialSeconds: number): number {
        return Math.floor((currentSeconds / initialSeconds) * 100);
    }
}