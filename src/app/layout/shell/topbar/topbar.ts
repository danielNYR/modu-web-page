import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideSearch } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
  selector: 'moldhea-topbar',
  imports: [NgIcon, HlmAvatarImports],
  providers: [provideIcons({ lucideSearch, lucideBell })],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {}
