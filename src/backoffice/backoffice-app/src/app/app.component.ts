import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { MenuItem } from '@core/models/menu-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  menuItems: MenuItem[];

  ngOnInit(): void {
    this.menuItems = [{
      icon: 'fa-user',
      label: 'Profile',
      route: 'profile',
    }];
  }

  ngAfterViewInit() {
    this.sidenav.mode = 'over';
    this.sidenav.close();
  }
}
