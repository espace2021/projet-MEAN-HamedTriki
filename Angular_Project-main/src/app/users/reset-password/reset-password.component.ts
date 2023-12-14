import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleResetPassword(): void {
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    this.route.params.subscribe((params) => {
      const token = params['token'];
      console.log('pass' + this.password);
      console.log('passC' + this.confirmPassword);
      this.http
        .post(`http://localhost:33070/reset-password/${token}`, {
          password: this.password,
        })
        .subscribe(
          (response: any) => {
            this.toastr.success(response.message);
            this.router.navigate(['/login']);
          },
          (error: any) => {
            console.error(error);
            const errorMessage = error.error
              ? error.error.message
              : 'Error! Something went wrong.';
            this.toastr.error(errorMessage);
          }
        );
    });
  }
}
