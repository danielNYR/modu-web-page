import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'moldhea-pagination',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly totalElements = input<number>();
  readonly first = input(true);
  readonly last = input(true);

  readonly pageChange = output<number>();

  previous(): void {
    if (!this.first()) this.pageChange.emit(this.page() - 1);
  }

  next(): void {
    if (!this.last()) this.pageChange.emit(this.page() + 1);
  }
}
