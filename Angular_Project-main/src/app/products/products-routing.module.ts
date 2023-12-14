import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AdminGuard } from '../users/admin.guard';
const routes: Routes = [
  { path: 'products', redirectTo: 'products/index', pathMatch: 'full' },
  {
    path: 'products/index',
    component: IndexComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'products/:id/view',
    component: ViewComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'products/create',
    component: CreateComponent,
    canActivate: [AdminGuard],
  },
  { path: 'products/:id', component: EditComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
