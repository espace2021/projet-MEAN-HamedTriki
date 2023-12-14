import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:33070/cart';
  private apiPayment = 'http://localhost:33070/order';

  constructor(private http: HttpClient) {}

  createOrAddToShoppingCart(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  getShoppingCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  removeItemFromShoppingCart(userId: string, itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/remove/${itemId}`);
  }

  updateItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/update/${itemId}`, {
      quantity,
    });
  }

  createOrder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiPayment}/orders`, orderData, {
      headers,
    });
  }

  clearCart(userId: string) {
    this.http.delete(`${this.apiUrl}/shopping-cart/${userId}`).subscribe(
      (response) => {
        console.log('Shopping cart cleared successfully');
      },
      (error) => {
        console.error('Error clearing shopping cart:', error);
      }
    );
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  sendPayment(data: any): Observable<any> {
    return this.http.post(
      this.apiPayment + '/payment/',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}
