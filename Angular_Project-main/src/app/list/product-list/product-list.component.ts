import { Component } from '@angular/core';
import { Categories } from 'src/app/categories/categories';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Products } from 'src/app/products/products';
import { ProductsService } from 'src/app/products/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  constructor(
    private categoryService: CategoriesService,
    private productService: ProductsService
  ) {}
  products: Products[] = [];
  categories: Categories[] = [];
  searchQuery: string = '';
  suggestions: any[] = [];
  showOnlyWithPrevPrice: boolean = false;
  showItemCount: number = 8;
  noMoreItemsToLoad: boolean = false;
  selectedCategory: string = '';
  sortAscending: boolean = true;
  sortName: boolean = true;
  stockFilter: boolean = false;
  subcategories: Categories[] = [];
  selectedSubcategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((data: Categories[]) => {
      this.categories = data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    });

    this.productService.getAllToys().subscribe((data: Products[]) => {
      this.products = data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    });
  }

  isOutOfStock(product: Products): boolean {
    return product.stock === 0;
  }

  calculateDiscountPercentage(product: Products): number | null {
    if (product.prevPrice && product.price) {
      const discountPercentage =
        ((product.prevPrice - product.price) / product.prevPrice) * 100;
      return Math.round(discountPercentage);
    }
    return null;
  }

  // FILTER METHODS

  onSearch() {
    this.suggestions = this.products
      .filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .filter((product) => !this.showOnlyWithPrevPrice || product.prevPrice)

      .map((product) => ({
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        _id: product._id,
      }));
  }

  toggleSortOrder() {
    this.sortAscending = !this.sortAscending;

    this.products = this.products.sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;

      if (this.sortAscending) {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  }

  toggleSortName() {
    this.sortName = !this.sortName;

    this.products = this.products.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (this.sortName) {
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      } else {
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0;
      }
    });
  }

  togglePrevPriceFilter() {
    this.showOnlyWithPrevPrice = !this.showOnlyWithPrevPrice;
    this.onSearch();
  }

  getFilteredProducts() {
    if (this.showOnlyWithPrevPrice) {
      return this.products
        .filter((product) => product.prevPrice)
        .filter((product) => !this.stockFilter || product.stock > 0)
        .filter((product) => {
          if (this.minPrice !== null) {
            return product.price >= this.minPrice;
          }
          return true;
        })
        .filter((product) => {
          if (this.maxPrice !== null) {
            return product.price <= this.maxPrice;
          }
          return true;
        })
        .slice(0, this.showItemCount);
    } else {
      return this.products
        .filter((product) => !this.stockFilter || product.stock > 0)
        .filter((product) => {
          if (this.minPrice !== null) {
            return product.price >= this.minPrice;
          }
          return true;
        })
        .filter((product) => {
          if (this.maxPrice !== null) {
            return product.price <= this.maxPrice;
          }
          return true;
        })
        .slice(0, this.showItemCount);
    }
  }

  toggleStockFilter() {
    this.stockFilter = !this.stockFilter;
  }

  onCategorySelect() {
    if (this.selectedCategory) {
      console.log('Selected Category:', this.selectedCategory);

      this.categoryService
        .getSubCategoriesByParentCategory(this.selectedCategory)
        .subscribe((data: Categories[]) => {
          this.subcategories = data;
          this.selectedSubcategory = '';
        });

      this.productService.getAllToys().subscribe((data: Products[]) => {
        this.products = data
          .filter((product) => product.category === this.selectedCategory)
          .filter(
            (product) =>
              !this.selectedSubcategory ||
              product.subCategory === this.selectedSubcategory
          )
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
      });
    } else {
      this.subcategories = [];
      this.productService.getAllToys().subscribe((data: Products[]) => {
        this.products = data
          .filter(
            (product) =>
              !this.selectedSubcategory ||
              product.subCategory === this.selectedSubcategory
          )
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
      });
    }
  }

  resetFilters() {
    this.searchQuery = '';
    this.suggestions = [];
    this.showOnlyWithPrevPrice = false;
    this.showItemCount = 8;
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.sortAscending = true;
    this.stockFilter = false;
    this.minPrice = null;
    this.maxPrice = null;
    this.onCategorySelect();
  }

  filterProductsBySubcategory() {
    if (this.selectedSubcategory) {
      console.log(this.selectedSubcategory);
      this.products = this.products.filter(
        (product) => product.subCategory === this.selectedSubcategory
      );
    } else {
      this.onCategorySelect();
    }
  }

  onSubcategorySelect() {
    console.log('Selected Subcategory:', this.selectedSubcategory);
    this.filterProductsBySubcategory();
  }

  loadMoreItems() {
    const remainingItems = this.products.length - this.showItemCount;
    if (remainingItems > 0) {
      this.showItemCount += Math.min(4, remainingItems);
    } else {
      this.noMoreItemsToLoad = true;
    }
  }
}
