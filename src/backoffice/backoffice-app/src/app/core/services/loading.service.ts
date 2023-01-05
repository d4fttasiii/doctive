import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoading: boolean = false;
  public static loadingStatus: Subject<boolean> = new Subject();

  get loading(): boolean {
    return this.isLoading;
  }

  set loading(value) {
    this.isLoading = value;
  }

  startLoading() {
    LoadingService.loadingStatus.next(true);
  }

  stopLoading() {
    setTimeout(() => LoadingService.loadingStatus.next(false), 1000);
  }
}