import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../order';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from 'src/app/users/user';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
})
export class AllOrdersComponent implements OnInit {
  orders: Order[] = [];
  user: User = new User();

  @ViewChild('orderDetailsModal') orderDetailsModal: TemplateRef<any>;
  selectedOrder: Order | null;
  @ViewChild('htmlData') htmlData!: ElementRef;

  constructor(
    private orderService: OrderService,
    private cookieService: CookieService,
    private router: Router,
    private userService: UserService
  ) {}
  openOrderDetailsModal(order: Order) {
    this.selectedOrder = order;
  }
  isPending(orderStatus: string): boolean {
    return orderStatus === 'Pending';
  }

  closeModal() {
    this.selectedOrder = null;
  }

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
    this.orderService.getAllOrders().subscribe(
      (orders: any) => {
        this.orders = orders.sort((a: any, b: any) => {
          return (
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
        });
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  openPDF() {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 100;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 20;
      PDF.addImage(FILEURI, 'PNG', 50, position, fileWidth, fileHeight);
      PDF.save(`cart of ${this.user.name}.pdf`);
    });
  }

  acceptedOrder(index: number) {
    const orderId = this.orders[index]._id;

    Swal.fire({
      title: 'Accepted Order',
      text: 'Are you sure you want to Accept this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Yes, Accepted it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performOrderCancellation(orderId, index);
      }
    });
  }

  performOrderCancellation(orderId: string, index: number) {
    this.orderService.updatePaymentStatus(orderId, 'Accepted').subscribe(
      (result) => {
        this.orders[index].paymentStatus = 'Accepted';

        Swal.fire(
          'Order Accepted',
          'The order has been canceled successfully.',
          'success'
        );
      },
      (error) => {
        console.error('Error:', error);

        Swal.fire(
          'Error',
          'An error occurred while Accepting the order.',
          'error'
        );
      }
    );
  }
}
