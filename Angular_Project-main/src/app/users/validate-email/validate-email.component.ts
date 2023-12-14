import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.css'],
})
export class ValidateEmailComponent implements OnInit {
  email: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {}

  handleValidateEmail(): void {
    if (!this.email) {
      this.toastr.error('Please enter your email address.');
      return;
    }

    this.http
      .post('http://localhost:33070/reset-email', { email: this.email })
      .subscribe(
        (response: any) => {
          this.toastr.success(response.message);
        },
        (error: any) => {
          const errorMessage = error.error
            ? error.error.message
            : 'Error! Something went wrong.';
          this.toastr.error(errorMessage);
        }
      );
  }
}
