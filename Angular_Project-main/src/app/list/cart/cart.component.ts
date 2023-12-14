import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import { User } from 'src/app/users/user';
import { UserService } from 'src/app/users/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  user: User = new User();
  userId: string = '';
  paymentMethod: string = 'cash';
  @Output() onOrderFinished = new EventEmitter();
  paymentHandler: any = null;
  stripeAPIKey: any =
    'pk_test_51MoAeUHx8XV3iDRETdJnVPnpyS3UmkonHgnWEIBkJ2hdubQt1HHbwpGwQiV5BBKX8mLGffSpfiqHYWVFfbYZ0hWO00qAtLRndF';

  constructor(
    private shoppingCartService: ShoppingCartService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private userService: UserService,
    private r: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.fetchShoppingCartItems();
    });
    this.invokeStripe();

    const token = this.cookieService.get('token');
    if (!token) {
      this.r.navigate(['/access-denied']);
      return;
    }

    this.userService.getUserInfo(token).subscribe(
      (userInfo: any) => {
        this.user = userInfo;
      },
      (error) => {
        console.error(error);
        this.userService.removeInvalidToken();
      }
    );
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');

      script.id = 'stripe-script';

      script.type = 'text/javascript';

      script.src = 'https://checkout.stripe.com/checkout.js';

      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,

          locale: 'auto',

          token: function (stripeToken: any) {
            console.log(stripeToken);

            alert('Payment has been successfull!');

            this.onOrderFinished(false);
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }

  setPaymentMethod(method: string) {
    this.paymentMethod = method;
  }

  fetchShoppingCartItems() {
    this.shoppingCartService.getShoppingCart(this.userId).subscribe(
      (response) => {
        this.cartItems = response.items;
      },
      (error) => {
        console.error('Error fetching cart items:', error);
        this.toastr.error(error.error.error, 'Error fetching cart items');
      }
    );
  }

  removeItem(itemId: string) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to remove this item from the cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shoppingCartService
          .removeItemFromShoppingCart(this.userId, itemId)
          .subscribe(
            (response) => {
              this.cartItems = response.items;
              this.toastr.success('Item removed from the cart successfully');
              setTimeout(() => {
                location.reload();
              }, 3000);
            },
            (error) => {
              this.toastr.error(error.error.error, 'Error removing item');
            }
          );
      }
    });
  }

  updateQuantity(itemId: string, quantity: number) {
    this.shoppingCartService
      .updateItemQuantity(this.userId, itemId, quantity)
      .subscribe(
        (response) => {
          this.cartItems = response.items;
          this.toastr.success('Quantity updated successfully');
        },
        (error) => {
          console.error('Error updating quantity:', error.error);
          this.toastr.error(error.error.error, 'Error updating quantity');
        }
      );
  }

  calculateTotalCost(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  checkout() {
    const userId = this.userId;

    const items = this.cartItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = this.calculateTotalCost();

    const shippingAddress = {
      address: this.user.address,
      city: this.user.city,
      country: this.user.country,
      phoneNumber: this.user.phoneNumber,
      userName: this.user.name,
    };

    const paymentMethod = this.paymentMethod;

    const paymentStatus = 'Pending';

    const orderData = {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
    };

    this.shoppingCartService.createOrder(orderData).subscribe(
      (response) => {
        this.cartItems = [];
        this.toastr.success('Order created successfully');
        this.shoppingCartService.clearCart(userId);
        window.location.href = '/thank-you';
      },
      (error) => {
        console.error('Error creating order:', error);
        this.toastr.error(error.error.message, 'Error creating order');
      }
    );
  }

  checkoutProduct() {
    this.makePayment();
  }

  makePayment() {
    let amount = this.calculateTotalCost();
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,

      locale: 'auto',

      token: (stripeToken: any) => {
        this.processPayment(amount, stripeToken);
      },
    });

    paymentHandler.open({
      name: 'ItSolutionStuff.com',

      description: '3 widgets',

      amount: amount * 100,
    });
  }

  processPayment(amount: any, stripeToken: any) {
    const data = {
      amount: amount * 100,
      token: stripeToken,
    };

    this.shoppingCartService.sendPayment(data).subscribe({
      next: (res: any) => {
        console.log(res);

        this.toastr.success('Payment successful', 'Success');

        this.checkout();
      },
      error: (e) => {
        console.log(e);
        this.toastr.error('Payment not completed', 'Error');
      },
    });
  }

  // createOrderAfterPayment() {
  //   const orderData = {
  //     userId: this.userId, // You can get the user's ID from your component
  //     items: this.cartItems.map((item) => ({
  //       productId: item.productId,
  //       productName: item.productName,
  //       productImage: item.productImage,
  //       quantity: item.quantity,
  //       price: item.price,
  //     })),
  //     totalAmount: this.calculateTotalCost(),
  //     shippingAddress: {
  //       address: this.user.address,
  //       city: this.user.city,
  //       country: this.user.country,
  //       phoneNumber: this.user.phoneNumber,
  //       userName: this.user.name,
  //     },
  //     paymentMethod: this.paymentMethod,
  //     paymentStatus: 'Pending',
  //   };

  //   // Call the createOrder method from your ShoppingCartService
  //   this.shoppingCartService.createOrder(orderData).subscribe(
  //     (response) => {
  //       // Order created successfully
  //       this.cartItems = [];
  //       this.toastr.success('Order created successfully');
  //       this.shoppingCartService.clearCart(this.userId);
  //     },
  //     (error) => {
  //       console.error('Error creating order:', error);
  //       this.toastr.error(error.error.message, 'Error creating order');
  //     }
  //   );
  // }
}
