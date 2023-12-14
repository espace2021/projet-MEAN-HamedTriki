import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:33070/order';

  getAllOrders() {
    return this.http
      .get(`${this.baseUrl}/orders`)
      .pipe(catchError(this.handleError));
  }

  getOrderById(id: string) {
    return this.http
      .get(`${this.baseUrl}/orders/${id}`)
      .pipe(catchError(this.handleError));
  }

  getOrdersByUserId(userId: string) {
    return this.http
      .get(`${this.baseUrl}/orders/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  updatePaymentStatus(id: string, paymentStatus: string) {
    return this.http
      .put(`${this.baseUrl}/orders/${id}`, {
        paymentStatus,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(error);
  }
}
