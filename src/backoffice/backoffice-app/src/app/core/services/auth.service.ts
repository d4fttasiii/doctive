import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginMessage } from '@core/generated-models';
import { BackofficeUserSession } from '@core/models/backoffice-user';
import { CachingStorageType } from '@core/models/caching-storage';
import jwt_decode from "jwt-decode";
import * as moment from 'moment';

import { BackofficeService } from './backoffice.service';
import { CachingService } from './caching.service';

const BACKOFFICE_USER_SESSION = 'DOCTIVE_BACKOFFICE_USER_SESSION';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private backoffice: BackofficeService,
    private snackBar: MatSnackBar,
    private caching: CachingService) { }

  async isLoggedIn(): Promise<boolean> {
    const session = this.getCurrentSession();

    return !!session;
  }

  async getLoginMessage(walletAddress: string): Promise<LoginMessage> {
    return await this.backoffice.userControllerGetLoginMessage(walletAddress);
  }

  async login(walletAddress: string, signature: string) {
    try {
      const { access_token } = await this.backoffice.userControllerLogin(
        {
          address: walletAddress,
          signature
        }, {
        withCredentials: true,
      });
      const user = jwt_decode<BackofficeUserSession>(access_token);
      this.caching.set(BACKOFFICE_USER_SESSION, user, CachingStorageType.LocalStorage, 3_600_000);
    }
    catch {
      this.snackBar.open('Unable to authenticate you!', 'Dismiss', {
        duration: 3000,
      });
    }
  }

  async logout() {
    this.caching.remove(BACKOFFICE_USER_SESSION);
    
  }

  getCurrentSession(): BackofficeUserSession | null {
    const session = this.caching.get<BackofficeUserSession>(BACKOFFICE_USER_SESSION);
    if (session.exp <= moment().unix()) {
      this.caching.remove(BACKOFFICE_USER_SESSION);
      return null;
    }
    else {
      return session;
    }
  }
}
