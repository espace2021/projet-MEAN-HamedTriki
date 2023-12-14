import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserGuard } from './user.guard';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { ValidateRegistrationComponent } from './validate-register/validate-register.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AccessNotVerifiedComponent } from './access-not-verified/access-not-verified.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'userProfile',
    component: UserProfileComponent,
    canActivate: [UserGuard],
  },

  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'thank-you',
    component: ThankYouComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'access-not-verified',
    component: AccessNotVerifiedComponent,
  },

  {
    path: 'validate-registration/:token',
    component: ValidateRegistrationComponent,
  },
  { path: 'validate-email', component: ValidateEmailComponent },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
