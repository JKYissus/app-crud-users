import { Component, OnInit, Renderer2, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isMenuOpen: boolean = false;
  isMobile: boolean = false;
  sidebarOpen: boolean = false;

  constructor(
    private router: Router,
    private renderer: Renderer2, private elementRef: ElementRef
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const sidebarElement = this.elementRef.nativeElement.querySelector('#sidebarMenu');

    if (this.sidebarOpen && !sidebarElement.contains(event.target)) {
      this.closeSidebar();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}
