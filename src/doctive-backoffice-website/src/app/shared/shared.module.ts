import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoreModule } from '@core/core.module';

import { AddressBoxComponent } from './address-box/address-box.component';
import { ContainerComponent } from './container/container.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuComponent } from './menu/menu.component';
import { MetricBoxComponent } from './metric-box/metric-box.component';
import { ShortAddressPipe } from './short-address.pipe';
import { WalletConnectorComponent } from './wallet-connector/wallet-connector.component';

const MAT_MODULES = [
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  MatCardModule,
  MatListModule,
  MatTooltipModule,
  MatTableModule,
  MatInputModule,
  MatChipsModule,
  MatTabsModule,
  MatSelectModule,
  MatSnackBarModule,
  MatDialogModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatBadgeModule,
  MatMenuModule,
  MatSliderModule,
];

const EXPORTS = [
  MenuComponent,
  MenuItemComponent,
  ContainerComponent,
  WalletConnectorComponent,
  MetricBoxComponent,
  AddressBoxComponent,
  ShortAddressPipe,
];

@NgModule({
  declarations: [...EXPORTS],
  imports: [CommonModule, CoreModule, FormsModule, ...MAT_MODULES],
  providers: [],
  exports: [FormsModule, ...EXPORTS, ...MAT_MODULES],
})
export class SharedModule { }
