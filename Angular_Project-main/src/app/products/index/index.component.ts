import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';
import { Products } from '../products';
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  constructor(public productsService: ProductsService) {}

  products: Products[] = [];
  originalProducts: Products[] = [];

  itemsPerPage = 5;
  currentPage = 1;

  ngOnInit(): void {
    this.productsService.getAllToys().subscribe((data: Products[]) => {
      this.products = data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      this.originalProducts = [...this.products];

      this.products.forEach((product, index) => {
        product.relativeTime = this.calculateRelativeTime(product.createdAt);
        product.index = index + 1;
      });
    });
  }

  deleteProduct(_id: object) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteToy(_id).subscribe(
          (res) => {
            this.products = this.products.filter((item) => item._id !== _id);
            this.originalProducts = this.originalProducts.filter(
              (item) => item._id !== _id
            );
            Swal.fire({
              icon: 'success',
              title: 'Product Deleted',
              text: 'The product has been successfully deleted!',
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while deleting the product.',
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The product has not been deleted.',
        });
      }
    });
  }

  filter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.products = this.originalProducts.filter((product) =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  getDisplayedProducts(): Products[] {
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIdx, startIdx + this.itemsPerPage);
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  getTotalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  getPagesArray(): number[] {
    return Array(this.getTotalPages())
      .fill(0)
      .map((_, idx) => idx + 1);
  }

  truncateText(text: string, wordLimit: number): string {
    if (text) {
      const words = text.split(' ');
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ');
      } else {
        return text;
      }
    }
    return '';
  }

  calculateRelativeTime(createdAt: string): string {
    if (createdAt) {
      const date = new Date(createdAt);
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return '';
  }
}
