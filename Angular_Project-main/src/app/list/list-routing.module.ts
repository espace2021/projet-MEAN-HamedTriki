import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { UserGuard } from '../users/user.guard';

const routes: Routes = [
  { path: 'list', redirectTo: 'list/product-list', pathMatch: 'full' },
  { path: 'list/product-list', component: ProductListComponent },
  { path: 'list/:id/product-detail', component: ProductDetailComponent },
  { path: 'list/:id/cart', component: CartComponent, canActivate: [UserGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRoutingModule {}
