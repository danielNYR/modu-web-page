import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideBoxes,
  lucideKeyRound,
  lucideLayoutDashboard,
  lucideLogOut,
  lucideScrollText,
  lucideUserCheck,
  lucideUsers,
} from '@ng-icons/lucide';
import { NAV_ITEMS } from '@app/core/nav/nav-items';

@Component({
  selector: 'moldhea-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideUsers,
      lucideUserCheck,
      lucideKeyRound,
      lucideBoxes,
      lucideBell,
      lucideScrollText,
      lucideLogOut,
    }),
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly navItems = NAV_ITEMS;

  constructor(private readonly router: Router) {}

  logout(): void {
    this.router.navigateByUrl('/login');
  }
}
