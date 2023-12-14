import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/products/products';
import { ProductsService } from 'src/app/products/products.service';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { User } from 'src/app/users/user';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  productData: Products = new Products();
  productId: string = '';
  randomProducts: Products[] = [];
  selectedStock: number = 0;
  user: User = new User();
  token: string;
  userID: string;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private shoppingCartService: ShoppingCartService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProductData();
      this.fetchRandomData();
    });
    this.token = this.cookieService.get('token');
    this.userID = this.cookieService.get('userID');
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

  fetchRandomData() {
    this.productService.getRandomToys().subscribe(
      (response) => {
        this.randomProducts = response;
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }

  isOutOfStock(product: Products): boolean {
    return product.stock === 0;
  }

  calculateDiscountPercentage(product: Products): number | null {
    if (product.prevPrice && product.price) {
      const discountPercentage =
        ((product.prevPrice - product.price) / product.prevPrice) * 100;
      return Math.round(discountPercentage);
    }
    return null;
  }

  generateStockOptions(stock: number): number[] {
    return Array.from({ length: stock }, (_, index) => index + 1);
  }

  addToCart() {
    if (this.userID) {
      if (this.selectedStock > 0) {
        const cartItem = {
          userId: this.userID,
          productId: this.productId,
          productName: this.productData.name,
          productImage: this.productData.imageUrl,
          quantity: this.selectedStock,
          price: this.productData.price,
        };

        this.shoppingCartService.createOrAddToShoppingCart(cartItem).subscribe(
          (response) => {
            this.toastr.success('Product added to cart successfully');
            setTimeout(() => {
              window.location.href = '/list/product-list';
            }, 3000);
          },
          (error) => {
            console.error('Error adding product to cart:', error);
            this.toastr.error(
              error.error.error,
              'Error adding product to cart'
            );
          }
        );
      } else {
        this.toastr.warning(
          'Please select a quantity to add to the cart',
          'Warning'
        );
      }
    } else {
      this.toastr.warning('Please login to add to the cart', 'Warning');
    }
  }
}
