import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = 'http://localhost:33070/toy/';

  constructor(private http: HttpClient) {}

  getAllToys(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(catchError(this.handleError));
  }

  getToyById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + id).pipe(catchError(this.handleError));
  }

  getRandomToys(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/random/aleatory`)
      .pipe(catchError(this.handleError));
  }

  createToy(toyData: any): Observable<any> {
    return this.http
      .post(this.baseUrl, toyData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  updateToy(id: string, toyData: any): Observable<any> {
    return this.http
      .put(this.baseUrl + id, toyData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  deleteToy(id: object): Observable<any> {
    return this.http
      .delete(this.baseUrl + id)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(error);
  }

  uploadSignature(vals: any): Observable<any> {
    let data = vals;
    return this.http.post(
      'https://api.cloudinary.com/v1_1/dhzlfojtv/image/upload',
      data
    );
  }
}
