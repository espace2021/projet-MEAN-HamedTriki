import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validate-registration',
  templateUrl: './validate-register.component.html',
  styleUrls: ['./validate-register.component.css'],
})
export class ValidateRegistrationComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const token = params['token'];
    });
  }

  handleValidateRegistration(): void {
    this.route.params.subscribe((params) => {
      const token = params['token'];

      this.http.post(`http://localhost:33070/verify/${token}`, {}).subscribe(
        (response: any) => {
          this.toastr.success(response.message);
          this.router.navigate(['/login']);
        },
        (error: any) => {
          this.toastr.error(error.error || 'Registration Verification failed');
        }
      );
    });
  }
}
