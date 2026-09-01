import { Component, computed, input, output } from '@angular/core';
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

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const start = Math.max(0, Math.min(current - 2, total - 5));
    return Array.from({ length: Math.min(5, total) }, (_, index) => start + index);
  });

  goTo(page: number): void {
    if (page >= 0 && page < this.totalPages() && page !== this.page()) this.pageChange.emit(page);
  }

  previous(): void {
    if (!this.first()) this.pageChange.emit(this.page() - 1);
  }

  next(): void {
    if (!this.last()) this.pageChange.emit(this.page() + 1);
  }
}
