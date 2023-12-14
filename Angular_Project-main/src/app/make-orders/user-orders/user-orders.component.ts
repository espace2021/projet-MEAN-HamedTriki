import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../order';
import { OrderItem } from '../order-item';
import { OrderService } from '../order.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/users/user';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  userId: string;
  orders: Order[] = [];
  @ViewChild('orderDetailsModal') orderDetailsModal: TemplateRef<any>;
  selectedOrder: Order | null;
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const token = this.cookieService.get('token');
    if (!token) {
      this.router.navigate(['/access-denied']);
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

    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.orderService.getOrdersByUserId(this.userId).subscribe(
        (orders: any) => {
          this.orders = orders
            .map((orderData: any) => {
              return new Order(
                orderData._id,
                orderData.userId,
                orderData.items.map((itemData: any) => {
                  return new OrderItem(
                    itemData.productId,
                    itemData.productName,
                    itemData.productImage,
                    itemData.quantity,
                    itemData.price
                  );
                }),
                orderData.totalAmount,
                new Date(orderData.orderDate),
                orderData.shippingAddress,
                orderData.paymentMethod,
                orderData.paymentStatus
              );
            })
            .sort((a: any, b: any) => {
              return (
                new Date(b.orderDate).getTime() -
                new Date(a.orderDate).getTime()
              );
            });
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    });
  }

  openOrderDetailsModal(order: Order) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  cancelOrder(index: number) {
    const orderId = this.orders[index]._id;
    Swal.fire({
      title: 'Cancel Order',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performOrderCancellation(orderId, index);
      }
    });
  }

  performOrderCancellation(orderId: string, index: number) {
    this.orderService.updatePaymentStatus(orderId, 'Canceled').subscribe(
      (result) => {
        this.orders[index].paymentStatus = 'Canceled';

        Swal.fire(
          'Order Canceled',
          'The order has been canceled successfully.',
          'success'
        );
      },
      (error) => {
        console.error('Error:', error);

        Swal.fire(
          'Error',
          'An error occurred while canceling the order.',
          'error'
        );
      }
    );
  }
}
