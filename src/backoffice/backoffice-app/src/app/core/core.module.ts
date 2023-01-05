import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { BackofficeService } from './services/backoffice.service';
import { CachingService } from './services/caching.service';
import { LoadingService } from './services/loading.service';
import { Web3Service } from './services/web3.service';

@NgModule({
  providers: [
    ApiService,
    AuthService,
    BackofficeService,
    CachingService,
    LoadingService,
    Web3Service,
  ],
  imports: [CommonModule, HttpClientModule],
})
export class CoreModule { }
