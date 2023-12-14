import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { ValidateRegistrationComponent } from './validate-register/validate-register.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AccessNotVerifiedComponent } from './access-not-verified/access-not-verified.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ThankYouComponent } from './thank-you/thank-you.component';

@NgModule({
  declarations: [
    EditProfileComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    ValidateEmailComponent,
    ValidateRegistrationComponent,
    AccessDeniedComponent,
    AccessNotVerifiedComponent,
    ThankYouComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class UsersModule {}
