import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'institution',
    loadChildren: () =>
      import('./institution/institution.module').then((m) => m.InstitutionModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
