
import { Injectable } from '@angular/core';

import { ApiService, HttpOptions } from './api.service';
import { LoginMessage, AuthResponse, LoginDto, UserDto, UpsertUserDto, InstitutionDto, UpsertInstitutionDto, InstitutionSubscriptionDto, InstitutionManagerDto, UpsertInstitutionManagerDto } from '../generated-models';

@Injectable({
    providedIn: 'root'
})
export class BackofficeService {
    constructor(private apiService: ApiService) { }

    userControllerGetLoginMessage = async (walletAddress: string): Promise<LoginMessage> => this.apiService.get<LoginMessage>(`/api/v1/user/login/${walletAddress}`);
    userControllerLogin = async (data: LoginDto, options: HttpOptions): Promise<AuthResponse> => this.apiService.post<AuthResponse>(`/api/v1/user/login`, data, options);
    userControllerGetAllUser = async (take: string, skip: string): Promise<UserDto> => this.apiService.get<UserDto>(`/api/v1/user/${take}/${skip}`);
    userControllerGetUser = async (walletAddress: string): Promise<UserDto> => this.apiService.get<UserDto>(`/api/v1/user/${walletAddress}`);
    userControllerUpdateUser = async (walletAddress: string, data: UpsertUserDto, options: HttpOptions): Promise<UserDto> => this.apiService.put<UserDto>(`/api/v1/user/${walletAddress}`, data, options);
    userControllerCreateUser = async (data: UpsertUserDto, options: HttpOptions): Promise<UserDto> => this.apiService.post<UserDto>(`/api/v1/user`, data, options);
    statusControllerGetStatus = async (): Promise<any> => this.apiService.get(`/api/v1/status`);
    institutionControllerGetInstitutions = async (take: string, skip: string): Promise<undefined> => this.apiService.get<undefined>(`/api/v1/institution/${take}/${skip}`);
    institutionControllerGetInstitution = async (id: string): Promise<undefined> => this.apiService.get<undefined>(`/api/v1/institution/${id}`);
    institutionControllerUpdateInstitution = async (id: string, data: UpsertInstitutionDto, options: HttpOptions): Promise<InstitutionDto> => this.apiService.put<InstitutionDto>(`/api/v1/institution/${id}`, data, options);
    institutionControllerCreateInstitution = async (data: UpsertInstitutionDto, options: HttpOptions): Promise<InstitutionDto> => this.apiService.post<InstitutionDto>(`/api/v1/institution`, data, options);
    institutionControllerUpsertInstitutionSubscription = async (id: string, data: UpsertInstitutionDto, options: HttpOptions): Promise<InstitutionSubscriptionDto> => this.apiService.post<InstitutionSubscriptionDto>(`/api/v1/institution/${id}/subscription`, data, options);
    institutionControllerGetInstitutionManagers = async (id: string): Promise<undefined> => this.apiService.get<undefined>(`/api/v1/institution/${id}/manager`);
    institutionControllerCreateInstitutionManager = async (id: string, data: UpsertInstitutionManagerDto, options: HttpOptions): Promise<InstitutionManagerDto> => this.apiService.post<InstitutionManagerDto>(`/api/v1/institution/${id}/manager`, data, options);
    institutionControllerGetInstitutionManager = async (id: string, walletAddress: string): Promise<undefined> => this.apiService.get<undefined>(`/api/v1/institution/${id}/manager/${walletAddress}`);
    institutionControllerUpdateInstitutionManager = async (id: string, walletAddress: string, data: UpsertInstitutionManagerDto, options: HttpOptions): Promise<InstitutionManagerDto> => this.apiService.put<InstitutionManagerDto>(`/api/v1/institution/${id}/manager/${walletAddress}`, data, options);
}