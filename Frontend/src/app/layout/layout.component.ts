import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Topbar} from './topbar/topbar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Topbar, MatSidenavModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent implements OnInit {
  isMobile = false;
  sidebarOpen = true;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1024; // 1024px is standard 'lg' tailwind breakpoint

    if (this.isMobile && !wasMobile) {
      this.sidebarOpen = false;
    } else if (!this.isMobile && wasMobile) {
      this.sidebarOpen = true;
    }
  }

  toggleSidebar(sidenav: any) {
    if (this.isMobile) {
      sidenav.toggle();
    } else {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }
}
