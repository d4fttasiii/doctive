import { Injectable } from '@angular/core';
import { LoginMessage } from '@core/generated-models';
import { BackofficeService } from './backoffice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private backoffice: BackofficeService) { }

  async isLoggedIn(): Promise<boolean> {
    return true;
  }

  async getLoginMessage(walletAddress: string): Promise<LoginMessage> {
    return await this.backoffice.userControllerGetLoginMessage(walletAddress);
  }

  async login(walletAddress: string, signature: string) {
    const result = await this.backoffice.userControllerLogin(
      {
        address: walletAddress,
        signature
      }, {
      withCredentials: true,
    });

    console.log(result);
  }
}
