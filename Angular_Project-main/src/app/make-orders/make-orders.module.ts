import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MakeOrdersRoutingModule } from './make-orders-routing.module';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AllOrdersComponent, UserOrdersComponent],
  imports: [CommonModule, MakeOrdersRoutingModule, SharedModule, FormsModule],
})
export class MakeOrdersModule {}
