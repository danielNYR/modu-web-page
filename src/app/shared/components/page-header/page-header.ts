import { Component, input } from '@angular/core';

@Component({
  selector: 'moldhea-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
