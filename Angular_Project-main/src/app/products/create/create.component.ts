import { Component, ViewChild } from '@angular/core';
import { Products } from '../products';
import { ProductsService } from '../products.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FilePondComponent } from 'ngx-filepond';
import { Categories } from 'src/app/categories/categories';
import { CategoriesService } from 'src/app/categories/categories.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  product: Products = new Products();
  categories: Categories[] = [];
  subCategories: Categories[] = [];
  @ViewChild('myPond') myPond: FilePondComponent;

  constructor(
    private productService: ProductsService,
    private toastr: ToastrService,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  onSubmit() {
    this.productService.createToy(this.product).subscribe(
      (response) => {
        this.toastr.success('Product added successfully!', 'Success');
        this.product = new Products();
        this.router.navigate(['/products/index']);
      },
      (error) => {
        console.error('Error adding product:', error);

        this.toastr.error('Error adding product', 'Error');
      }
    );
  }

  loadCategories() {
    this.categoriesService.getAllCategories().subscribe(
      (data: Categories[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  onCategoryChange(event: Event) {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    this.loadSubCategories(selectedCategory);
  }

  loadSubCategories(selectedCategory: string) {
    this.categoriesService
      .getSubCategoriesByParentCategory(selectedCategory)
      .subscribe(
        (data: Categories[]) => {
          this.subCategories = data;
        },
        (error) => {
          console.error('Error fetching sub-categories', error);
        }
      );
  }

  // onFileChanged(event: any) {
  //   const imageData = event.target.files[0];
  //   const data = new FormData();

  //   data.append('file', imageData);
  //   data.append('upload_preset', 'Ecommerce_cloudinary');
  //   data.append('cloud_name', 'dhzlfojtv');
  //   data.append('public_id', imageData.name);
  //   this.productService.uploadSignature(data).subscribe((res) => {
  //     this.product.imageUrl = res.url;
  //   });
  // }

  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/jpeg, image/png',
    server: {
      process: (
        fieldName: any,
        file: any,
        metadata: any,
        load: any,
        error: any,
        progress: any,
        abort: any
      ) => {
        const data = new FormData();

        data.append('file', file);
        data.append('upload_preset', 'Ecommerce_cloudinary');
        data.append('cloud_name', 'dhzlfojtv');
        data.append('public_id', file.name);

        this.productService.uploadSignature(data).subscribe({
          next: (res) => {
            this.product.imageUrl = res.url;
            load(res);
          },
          error: (e) => {
            console.log(e);
            error(e);
            return () => {
              abort();
            };
          },
          complete: () => {
            console.log('done');
            return () => {
              abort();
            };
          },
        });
      },
      revert: (uniqueFileId: any, load: any, error: any) => {
        error('Error');
        load();
      },
    },
  };
}
