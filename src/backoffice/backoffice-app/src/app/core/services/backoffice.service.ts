
import { Injectable } from '@angular/core';

import { ApiService, HttpOptions } from './api.service';
import { LoginMessage, AuthResponse, LoginDto, UserListDto, UserDto, UpsertUserDto, InstitutionListDto, InstitutionDto, UpsertInstitutionDto, InstitutionSubscriptionDto, InstitutionManagerListDto, InstitutionManagerDto, UpsertInstitutionManagerDto } from '../generated-models';

@Injectable({
    providedIn: 'root'
})
export class BackofficeService {
    constructor(private apiService: ApiService) { }

    statusControllerGetStatus = async (options: HttpOptions = null): Promise<any> => this.apiService.get(`/api/v1/status`, options);
    userControllerGetLoginMessage = async (walletAddress: string, options: HttpOptions = null): Promise<LoginMessage> => this.apiService.get<LoginMessage>(`/api/v1/user/login/${walletAddress}`, options);
    userControllerLogin = async (data: LoginDto, options: HttpOptions = null): Promise<AuthResponse> => this.apiService.post<AuthResponse>(`/api/v1/user/login`, data, options);
    userControllerRefresh = async (options: HttpOptions = null): Promise<AuthResponse> => this.apiService.get<AuthResponse>(`/api/v1/user/refresh`, options);
    userControllerGetAllUser = async (take: string, skip: string, options: HttpOptions = null): Promise<UserListDto[]> => this.apiService.get<UserListDto[]>(`/api/v1/user/${take}/${skip}`, options);
    userControllerGetUser = async (walletAddress: string, options: HttpOptions = null): Promise<UserDto> => this.apiService.get<UserDto>(`/api/v1/user/${walletAddress}`, options);
    userControllerUpdateUser = async (walletAddress: string, data: UpsertUserDto, options: HttpOptions = null): Promise<UserDto> => this.apiService.put<UserDto>(`/api/v1/user/${walletAddress}`, data, options);
    userControllerCreateUser = async (data: UpsertUserDto, options: HttpOptions = null): Promise<UserDto> => this.apiService.post<UserDto>(`/api/v1/user`, data, options);
    institutionControllerGetInstitutions = async (take: string, skip: string, options: HttpOptions = null): Promise<InstitutionListDto[]> => this.apiService.get<InstitutionListDto[]>(`/api/v1/institution/${take}/${skip}`, options);
    institutionControllerGetInstitution = async (id: string, options: HttpOptions = null): Promise<InstitutionDto[]> => this.apiService.get<InstitutionDto[]>(`/api/v1/institution/${id}`, options);
    institutionControllerUpdateInstitution = async (id: string, data: UpsertInstitutionDto, options: HttpOptions = null): Promise<InstitutionDto> => this.apiService.put<InstitutionDto>(`/api/v1/institution/${id}`, data, options);
    institutionControllerCreateInstitution = async (data: UpsertInstitutionDto, options: HttpOptions = null): Promise<InstitutionDto> => this.apiService.post<InstitutionDto>(`/api/v1/institution`, data, options);
    institutionControllerUpsertInstitutionSubscription = async (id: string, data: UpsertInstitutionDto, options: HttpOptions = null): Promise<InstitutionSubscriptionDto> => this.apiService.post<InstitutionSubscriptionDto>(`/api/v1/institution/${id}/subscription`, data, options);
    institutionControllerGetInstitutionManagers = async (id: string, options: HttpOptions = null): Promise<InstitutionManagerListDto[]> => this.apiService.get<InstitutionManagerListDto[]>(`/api/v1/institution/${id}/manager`, options);
    institutionControllerCreateInstitutionManager = async (id: string, data: UpsertInstitutionManagerDto, options: HttpOptions = null): Promise<InstitutionManagerDto> => this.apiService.post<InstitutionManagerDto>(`/api/v1/institution/${id}/manager`, data, options);
    institutionControllerGetInstitutionManager = async (id: string, walletAddress: string, options: HttpOptions = null): Promise<InstitutionManagerListDto[]> => this.apiService.get<InstitutionManagerListDto[]>(`/api/v1/institution/${id}/manager/${walletAddress}`, options);
    institutionControllerUpdateInstitutionManager = async (id: string, walletAddress: string, data: UpsertInstitutionManagerDto, options: HttpOptions = null): Promise<InstitutionManagerDto> => this.apiService.put<InstitutionManagerDto>(`/api/v1/institution/${id}/manager/${walletAddress}`, data, options);
}