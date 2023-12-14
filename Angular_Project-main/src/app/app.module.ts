import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { CategoriesModule } from './categories/categories.module';
import { ListModule } from './list/list.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { UsersModule } from './users/users.module';
import { MakeOrdersModule } from './make-orders/make-orders.module';
import { ContactModule } from './contact/contact.module';
import { FooterComponent } from './footer/footer.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeModule } from './home/home.module';
import { UserManagementModule } from './user-management/user-management.module';

const routes: Routes = [];
@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
    ProductsModule,
    SharedModule,
    CategoriesModule,
    ListModule,
    ShoppingCartModule,
    UsersModule,
    MakeOrdersModule,
    ContactModule,
    DashboardModule,
    HomeModule,
    UserManagementModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
