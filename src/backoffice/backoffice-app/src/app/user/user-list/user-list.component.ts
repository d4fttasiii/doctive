import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserListDto } from '@core/generated-models';
import { BackofficeService } from '@core/services/backoffice.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;
  take: number;
  skip: number;

  displayedColumns: string[] = ['id', 'name', 'email', 'walletAddress', 'actions'];
  dataSource: MatTableDataSource<UserListDto> =
    new MatTableDataSource<UserListDto>();
    
  constructor(private backoffice: BackofficeService) { }

  async ngOnInit() {
    const data = await this.backoffice.userControllerGetAllUser(
      this.take.toString(),
      this.skip.toString(),
    );
    this.dataSource.data = data;
    this.isLoading = false;
  }

}
