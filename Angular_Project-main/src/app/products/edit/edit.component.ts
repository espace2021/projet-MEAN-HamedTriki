import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { Products } from '../products';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilePondComponent } from 'ngx-filepond';
import { FilePondOptions } from 'filepond';
import { Categories } from 'src/app/categories/categories';
import { CategoriesService } from 'src/app/categories/categories.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  productData: Products = new Products();
  productId: string = '';
  categories: Categories[] = [];
  subcategories: Categories[] = [];

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private r: Router,

    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.fetchProductData();
    });
    this.loadCategories();
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

  loadSubcategoriesByCategory(category: string) {
    this.categoriesService.getSubCategoriesByParentCategory(category).subscribe(
      (data: Categories[]) => {
        this.subcategories = data;
      },
      (error) => {
        console.error('Error fetching subcategories', error);
      }
    );
  }

  fetchProductData() {
    this.productService.getToyById(this.productId).subscribe(
      (response) => {
        this.productData = response;
        this.loadSubcategoriesByCategory(this.productData.category);
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }

  editProduct() {
    this.productService.updateToy(this.productId, this.productData).subscribe(
      (response) => {
        this.toastr.success('Product updated successfully', 'Success');
        this.r.navigate(['/products/index']);
      },
      (error) => {
        this.toastr.error('Error updating product', 'Error');
      }
    );
  }

  pondFiles: FilePondOptions['files'];

  updatePondFiles() {
    this.pondFiles = [
      {
        source: this.productData.imageUrl,
        options: {
          type: 'local',
        },
      },
    ];
  }

  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/jpeg, image/png',
    server: {
      load: (
        source: any,
        load: any,
        error: any,
        progress: any,
        abort: any,
        headers: any
      ) => {
        if (typeof source === 'string' && source !== '') {
          var myRequest = new Request(source);
          fetch(myRequest).then(function (response) {
            response.blob().then(function (myBlob) {
              load(myBlob);
            });
          });
        } else {
          error('Invalid URL');
        }
      },

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
            this.productData.imageUrl = res.url;
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

  onCategoryChange() {
    this.loadSubcategoriesByCategory(this.productData.category);
  }
}
