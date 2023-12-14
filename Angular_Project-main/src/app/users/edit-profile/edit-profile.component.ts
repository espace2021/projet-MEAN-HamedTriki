import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  user: any = {};
  oldPassword: string = '';
  newPassword: string = '';
  token: string;
  countries: any[] = [];

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.cookieService.get('token');

    if (!this.token) {
      this.toastr.error('Authentication token not found', 'Error');
      return;
    }

    this.userService.getUserInfo(this.token).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        this.toastr.error('Failed to fetch user information', 'Error');
        this.userService.removeInvalidToken();
      }
    );

    this.http.get('https://restcountries.com/v3.1/all').subscribe(
      (data: any) => {
        this.countries = data;
      },
      (error) => {
        this.toastr.error('Failed to fetch country data', 'Error');
      }
    );
  }

  updateProfile() {
    this.userService
      .updateUserProfile(
        this.user,
        this.oldPassword,
        this.newPassword,
        this.token
      )
      .subscribe(
        () => {
          this.toastr.success('Profile updated successfully', 'Success');
          this.router.navigate(['/userProfile']);
        },
        (error) => {
          console.log(error);
          this.toastr.error(error, 'Error');
        }
      );
  }
}
