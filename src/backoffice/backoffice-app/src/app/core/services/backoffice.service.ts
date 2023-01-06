
import { Injectable } from '@angular/core';

import { ApiService, HttpOptions } from './api.service';
import { LoginMessage, LoginDto, UserDto, UpsertUserDto, InstitutionDto, UpsertInstitutionDto } from '../generated-models';

@Injectable({
    providedIn: 'root'
})
export class BackofficeService {
    constructor(private apiService: ApiService) { }

    userControllerGetLoginMessage = async (walletAddress: string): Promise<LoginMessage> => this.apiService.get<LoginMessage>(`/api/v1/user/login/${walletAddress}`);
    userControllerLogin = async (data: LoginDto, options: HttpOptions): Promise<any> => this.apiService.post(`/api/v1/user/login`, data, options);
    userControllerGetOwnUser = async (): Promise<UserDto> => this.apiService.get<UserDto>(`/api/v1/user/own`);
    userControllerUpdateOwnUser = async (data: UpsertUserDto, options: HttpOptions): Promise<UserDto> => this.apiService.put<UserDto>(`/api/v1/user/own`, data, options);
    userControllerGetAllUser = async (take: string, skip: string): Promise<UserDto> => this.apiService.get<UserDto>(`/api/v1/user/${take}/${skip}`);
    userControllerGetUser = async (walletAddress: string): Promise<UserDto> => this.apiService.get<UserDto>(`/api/v1/user/${walletAddress}`);
    userControllerUpdateUser = async (walletAddress: string, data: UpsertUserDto, options: HttpOptions): Promise<UserDto> => this.apiService.put<UserDto>(`/api/v1/user/${walletAddress}`, data, options);
    userControllerCreateUser = async (data: UpsertUserDto, options: HttpOptions): Promise<UserDto> => this.apiService.post<UserDto>(`/api/v1/user`, data, options);
    statusControllerGetStatus = async (): Promise<any> => this.apiService.get(`/api/v1/status`);
    institutionControllerGetInstitutions = async (take: string, skip: string): Promise<undefined> => this.apiService.get<undefined>(`/api/v1/institution/${take}/${skip}`);
    institutionControllerGetInstitution = async (id: string): Promise<undefined> => this.apiService.get<undefined>(`/api/v1/institution/${id}`);
    institutionControllerUpdateUser = async (id: string, data: UpsertInstitutionDto, options: HttpOptions): Promise<InstitutionDto> => this.apiService.put<InstitutionDto>(`/api/v1/institution/${id}`, data, options);
    institutionControllerCreateUser = async (data: UpsertInstitutionDto, options: HttpOptions): Promise<InstitutionDto> => this.apiService.post<InstitutionDto>(`/api/v1/institution`, data, options);
}