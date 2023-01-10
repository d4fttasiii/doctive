import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';


@NgModule({
  declarations: [
    DetailsComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
