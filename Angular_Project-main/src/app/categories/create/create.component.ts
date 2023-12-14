import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Categories } from 'src/app/categories/categories';
import { CategoriesService } from 'src/app/categories/categories.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  category: Categories = new Categories();

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  onSubmit() {
    this.categoriesService.createCategory(this.category).subscribe(
      (response) => {
        this.toastr.success('Category added successfully!', 'Success');
        this.category = new Categories();
        this.router.navigate(['/categories/index']);
      },
      (error) => {
        this.toastr.error('Error adding product', 'Error');
      }
    );
  }
}
