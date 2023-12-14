import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { UserGuard } from '../users/user.guard';
import { AdminGuard } from '../users/admin.guard';

const routes: Routes = [
  { path: 'orders', redirectTo: 'orders/user-orders', pathMatch: 'full' },
  {
    path: 'orders/user-orders/:id',
    component: UserOrdersComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'orders/all-orders',
    component: AllOrdersComponent,
    canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakeOrdersRoutingModule {}
