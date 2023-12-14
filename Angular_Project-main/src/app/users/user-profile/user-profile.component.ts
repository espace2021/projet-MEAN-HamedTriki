import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User = new User();

  showFullAboutMe = false;

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
  }

  handleLogout() {
    this.cookieService.delete('token');
    this.cookieService.delete('userID');
    window.location.href = '/';
  }

  navigateToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  toggleAboutMe() {
    this.showFullAboutMe = !this.showFullAboutMe;
  }

  truncateText(text: string, wordLimit: number): string {
    if (text) {
      const words = text.split(' ');
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ');
      } else {
        return text;
      }
    }
    return '';
  }
}
