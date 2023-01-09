import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthResponse, LoginMessage } from '@core/generated-models';
import { BackofficeUserSession } from '@core/models/backoffice-user';
import { CachingStorageType } from '@core/models/caching-storage';
import jwt_decode from "jwt-decode";
import * as moment from 'moment';
import { from, Observable } from 'rxjs';

import { BackofficeService } from './backoffice.service';
import { CachingService } from './caching.service';

const BACKOFFICE_USER_SESSION = 'DOCTIVE_BACKOFFICE_USER_SESSION';
const BACKOFFICE_USER_REFRESH_VALID_UNTIL = 'BACKOFFICE_USER_REFRESH_VALID_UNTIL';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private backoffice: BackofficeService,
    private snackBar: MatSnackBar,
    private caching: CachingService) { }

  isLoggedIn(): boolean {
    const session = this.getCurrentSession();

    return !!session;
  }

  async getLoginMessage(walletAddress: string): Promise<LoginMessage> {
    return await this.backoffice.userControllerGetLoginMessage(walletAddress);
  }

  async login(walletAddress: string, signature: string) {
    try {
      const { access_token, refresh_token } = await this.backoffice.userControllerLogin({
        address: walletAddress,
        signature
      });
      this.createSession(access_token, refresh_token);
    }
    catch {
      this.snackBar.open('Unable to authenticate you!', 'Dismiss', {
        duration: 3000,
      });
    }
  }

  refreshToken(): Observable<AuthResponse> {
    return from(this.backoffice.userControllerRefresh());
  }

  logout() {
    this.caching.remove(BACKOFFICE_USER_SESSION);
  }

  getCurrentSession(): BackofficeUserSession | null {
    const session = this.caching.get<BackofficeUserSession>(BACKOFFICE_USER_SESSION);
    if (!session) {
      return null;
    }

    if (session.exp <= moment().unix()) {
      this.caching.remove(BACKOFFICE_USER_SESSION);
      return null;
    }
    else {
      return session;
    }
  }

  canUseRefreshToken(): boolean {
    const refresh = this.caching.get<BackofficeUserSession>(BACKOFFICE_USER_REFRESH_VALID_UNTIL);
    if (!refresh) {
      return false;
    }

    console.log(refresh.exp);
    console.log(moment().unix());

    return refresh.exp >= moment().unix();
  }

  createSession(access_token: string, refresh_token: string) {
    const user = jwt_decode<BackofficeUserSession>(access_token);
    const refresh = jwt_decode<BackofficeUserSession>(refresh_token);

    this.caching.set(BACKOFFICE_USER_SESSION, user, CachingStorageType.LocalStorage, 3_600_000);
    this.caching.set(BACKOFFICE_USER_REFRESH_VALID_UNTIL, refresh, CachingStorageType.LocalStorage, 86_400_000)
  }
}
