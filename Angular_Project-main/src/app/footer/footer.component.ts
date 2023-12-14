import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../users/user';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  user: User = new User();

  showFullAboutMe = false;

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.get('token');

    this.userService.getUserInfo(token).subscribe(
      (userInfo: any) => {
        this.user = userInfo;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
