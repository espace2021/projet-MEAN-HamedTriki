import { Component, HostListener, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  showDropdown = false;
  isConnected = false;
  token: string;
  userID: string;
  cartItemCount: number = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.token = this.cookieService.get('token');
    this.userID = this.cookieService.get('userID');
    if (this.token && this.userID) {
      this.isConnected = true;
    }

    this.updateCartItemCount();
  }

  updateCartItemCount() {
    if (this.isConnected) {
      this.shoppingCartService.getShoppingCart(this.userID).subscribe(
        (response) => {
          this.cartItemCount = response.items.length;
        },
        (error) => {
          console.error('Error fetching cart items:', error);
          this.cartItemCount = 0;
        }
      );
    } else {
      console.error('no user id');
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  redirectToUserProfile() {
    window.location.href = '/userProfile';
  }
  redirectToUserOrders() {
    window.location.href = `/orders/user-orders/${this.userID}`;
  }
  handleLogout() {
    this.cookieService.delete('token');
    this.cookieService.delete('userID');
    window.location.href = '/';
  }
}
