import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { AdminGuard } from '../users/admin.guard';

const routes: Routes = [
  { path: 'categories', redirectTo: 'categories/index', pathMatch: 'full' },
  {
    path: 'categories/index',
    component: IndexComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'categories/create',
    component: CreateComponent,
    canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
