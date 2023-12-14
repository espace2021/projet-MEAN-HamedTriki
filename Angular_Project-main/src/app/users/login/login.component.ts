import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  rememberMe: boolean = false;

  loginForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    if (errorMessage) {
      this.error = errorMessage;
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  handleLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    const rememberMe = this.loginForm.get('rememberMe')?.value;

    this.http
      .post('http://localhost:33070/login', { email, password, rememberMe })
      .subscribe(
        (response: any) => {
          const { token, user } = response;
          this.cookieService.set('token', token);
          this.cookieService.set('userID', user._id);

          this.toastr.success('You are logged in', 'Success');

          window.location.href = '/userProfile';
        },
        (error) => {
          this.cookieService.delete('token');
          this.cookieService.delete('userID');
          const errorMessage = error.error
            ? error.error.message
            : 'Error! Something went wrong in log in.';
          this.toastr.error(errorMessage, 'Error');
        }
      );
  }
}
