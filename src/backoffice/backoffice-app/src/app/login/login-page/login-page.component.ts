import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Web3Service } from '@core/services/web3.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private web3: Web3Service,
    private router: Router,
  ) {}

  async ngOnInit() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['profile']);
    }
    this.isLoading = false;
  }

  async login() {
    this.isLoading = true;
    this.isSubmitting = true;
    try {
      const accounts = await this.web3.connectAccount();
      const { message } = await this.authService.getLoginMessage(accounts[0]);
      const signature = await this.web3.signMessage(message);
      await this.authService.login(accounts[0], signature);
    } finally {
      this.isLoading = false;
      this.isSubmitting = false;
    }
  }
}
