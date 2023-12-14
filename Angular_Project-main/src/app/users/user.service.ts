import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:33070';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getUserInfo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http
      .get<any>(`${this.baseUrl}/userInfo`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateUserProfile(
    user: any,
    oldPassword: string,
    newPassword: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http
      .put<any>(
        `${this.baseUrl}/updateUserProfile`,
        { user, oldPassword, newPassword },
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  removeInvalidToken() {
    this.cookieService.delete('token');
    this.cookieService.delete('userID');
    const errorMessage = 'Your session has expired. Please log in again.';
    const redirectUrl = `/login?error=${encodeURIComponent(errorMessage)}`;
    window.location.href = redirectUrl;
  }

  private handleError(error: any) {
    let errorMessage = 'Failed to fetch user information';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    return throwError(errorMessage);
  }
}
