import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService
  ) {}

  canActivate(): Observable<boolean> {
    const token = this.cookieService.get('token');
    if (!token) {
      this.router.navigate(['/access-denied']);
      return of(false);
    }

    return this.userService.getUserInfo(token).pipe(
      switchMap((userAttributes: any) => {
        if (
          userAttributes.verified === true &&
          userAttributes.userType === true
        ) {
          return of(true);
        } else if (userAttributes.userType === false) {
          this.cookieService.delete('token');
          this.router.navigate(['/access-denied']);
          return of(false);
        } else if (userAttributes.verified === false) {
          this.cookieService.delete('token');
          this.router.navigate(['/access-not-verified']);
          return of(false);
        } else {
          return of(false);
        }
      }),
      catchError((error) => {
        console.error(error);
        this.removeInvalidToken();
        return of(false);
      })
    );
  }

  removeInvalidToken() {
    this.cookieService.delete('token');
    this.cookieService.delete('userID');
    const errorMessage = 'Your session has expired. Please log in again.';
    const redirectUrl = `/login?error=${encodeURIComponent(errorMessage)}`;
    window.location.href = redirectUrl;
  }
}
