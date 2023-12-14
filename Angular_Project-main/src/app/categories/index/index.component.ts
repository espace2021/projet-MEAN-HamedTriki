import { Component } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { Categories } from '../categories';
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {
  constructor(public categoriesService: CategoriesService) {}

  categories: Categories[] = [];
  originalCategories: Categories[] = [];

  itemsPerPage = 5;
  currentPage = 1;

  ngOnInit(): void {
    this.categoriesService
      .getAllCategories()
      .subscribe((data: Categories[]) => {
        this.categories = data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        this.originalCategories = [...this.categories];

        this.categories.forEach((category, index) => {
          category.relativeTime = this.calculateRelativeTime(
            category.createdAt
          );
          category.index = index + 1;
        });
      });
  }

  deleteCategory(_id: object) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriesService.deleteToy(_id).subscribe(
          (res) => {
            this.categories = this.categories.filter(
              (item) => item._id !== _id
            );
            this.originalCategories = this.originalCategories.filter(
              (item) => item._id !== _id
            );
            Swal.fire({
              icon: 'success',
              title: 'Category Deleted',
              text: 'The category has been successfully deleted!',
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while deleting the category.',
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The category has not been deleted.',
        });
      }
    });
  }

  filter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.categories = this.originalCategories.filter((category) =>
      category.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
  getDisplayedCategories(): Categories[] {
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    return this.categories.slice(startIdx, startIdx + this.itemsPerPage);
  }
  setPage(page: number) {
    this.currentPage = page;
  }

  getTotalPages(): number {
    return Math.ceil(this.categories.length / this.itemsPerPage);
  }

  getPagesArray(): number[] {
    return Array(this.getTotalPages())
      .fill(0)
      .map((_, idx) => idx + 1);
  }

  calculateRelativeTime(createdAt: string): string {
    if (createdAt) {
      const date = new Date(createdAt);
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return '';
  }
}
