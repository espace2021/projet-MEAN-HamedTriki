import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [IndexComponent, CreateComponent],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule, FormsModule],
})
export class CategoriesModule {}
