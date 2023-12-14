import { Component } from '@angular/core';
import { Products } from '../products';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent {
  productData: Products = new Products();
  productId: string = '';

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private r: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProductData();
    });
  }

  fetchProductData() {
    this.productService.getToyById(this.productId).subscribe(
      (response) => {
        this.productData = response;
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }

  returnTo() {
    this.r.navigate(['/products/index']);
  }
}
