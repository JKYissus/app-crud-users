import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isMenuOpen: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logOut() {
    sessionStorage.removeItem('session');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('timeExpired');
    sessionStorage.removeItem('timeSession');

    this.router.navigate(['login']);
  }
}
