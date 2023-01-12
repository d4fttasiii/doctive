import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KeyVaultConfig } from '../models/config';


@Injectable()
export class SecretService {

    private readonly secretClient: SecretClient;

    constructor(private configService: ConfigService) {
        const url = this.configService.get<KeyVaultConfig>('keyVault')?.url || '';
        this.secretClient = new SecretClient(url, new DefaultAzureCredential());
    }

    async getSecret(key: string): Promise<string> {
        // TODO: Accessing some kind of secret store where we have our faucet mnemonic
        // const secret = await this.secretClient.getSecret(key);
        // return secret.value;

        return await Promise.resolve('trouble sell razor volume aunt identify top brother cushion human slot pistol');
    }
}
