import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent implements OnInit {
  readonly auth = inject(AuthService);
  sidebarOpen = false;

  ngOnInit(): void {
    this.auth.refreshProfile();
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  initials(): string {
    return (this.auth.user()?.name || 'U')
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
}
