import { Component, OnInit } from '@angular/core';
import { UserDto } from '@core/generated-models';
import { AuthService } from '@core/services/auth.service';
import { BackofficeService } from '@core/services/backoffice.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  isLoading = true;
  isSubmitting = false;
  myUser: UserDto;

  constructor(private backoffice: BackofficeService, private authService: AuthService) { }

  async ngOnInit() {
    const userSession = this.authService.getCurrentSession();
    this.myUser = await this.backoffice.userControllerGetUser(userSession.walletAddress);
    this.isLoading = false;
  }

}
