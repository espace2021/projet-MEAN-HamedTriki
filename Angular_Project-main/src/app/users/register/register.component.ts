import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  countries: any[] = [];
  selectedCountry: string = '';
  flag: string = '';
  loading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.title = 'Register';
    this.createForm();
    this.fetchCountries();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  fetchCountries() {
    this.http.get('https://restcountries.com/v3.1/all').subscribe(
      (data: any) => {
        this.countries = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  handleRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    const { name, email, password, country, city, address } =
      this.registerForm.value;

    this.http
      .post('http://localhost:33070/register', {
        name,
        email,
        password,
        country,
        city,
        address,
      })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.toastr.success(
            'User registered successfully! Please check your email for verification.'
          );
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.error(error);
          const errorMessage = error.error
            ? error.error.message
            : 'Error! Something went wrong in registration.';
          this.toastr.error(errorMessage);
        }
      );
  }

  handleCountryChange(event: any) {
    this.selectedCountry = event.target.value;

    const countryData = this.countries.find(
      (country) => country.name.common === this.selectedCountry
    );
    if (countryData) {
      this.flag = countryData.flags.png;
    }
  }
}
