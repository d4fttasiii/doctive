
import { Injectable } from '@angular/core';

import { ApiService, HttpOptions } from './api.service';
import { LoginMessage, LoginDto, UpdateUserDto } from '../generated-models';

@Injectable({
    providedIn: 'root'
})
export class BackofficeService {
    constructor(private apiService: ApiService) { }

    userControllerGetLoginMessage = async (walletAddress: string, options?: HttpOptions): Promise<LoginMessage> => this.apiService.get<LoginMessage>(`/api/v1/user/login/${walletAddress}`, options);
    userControllerLogin = async (data: LoginDto, options?: HttpOptions): Promise<any> => this.apiService.post(`/api/v1/user/login`, data, options);
    userControllerGetUserInfo = async (options?: HttpOptions): Promise<UpdateUserDto> => this.apiService.get<UpdateUserDto>(`/api/v1/user`, options);
    statusControllerGetStatus = async (options?: HttpOptions): Promise<any> => this.apiService.get(`/api/v1/status`, options);
}