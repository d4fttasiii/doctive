import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export interface Config {
    app: AppConfig;
    web3: Web3Config;
    keyVault?: KeyVaultConfig;
    ipfs: IPFSConfig;
    redis: RedisConfig;
    jwt?: JwtConfig;
    mongoDb: MongoDbConfig;
    network?: NetworkConfig;
    sqlServer: SqlServerConfig;
}

export interface AppConfig {
    host: string;
    port: number;
    apiKey?: string;
    cors?: CorsOptions;
}

export interface Web3Config {
    url: string;
}

export interface KeyVaultConfig {
    url: string;
}

export interface IPFSConfig {
    bucket: string;
    endpoint: string;
    port: number;
    useSsl: boolean;
    accessKey: string;
    secretKey: string;
}

export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
}

export interface JwtConfig {
    secretKey: string;
    refreshKey: string;
    accessTokenExpiration: string;
    refreshTokenExpiration: string;
}

export interface JwtCookieStorageConfig {

}

export interface MongoDbConfig {
    endpoint: string;
    user?: string;
    pass?: string;
    ssl: boolean;
}

export interface SqlServerConfig {
    ip: string;
    port: number;
    user?: string;
    pass?: string;
    ssl: boolean;
}

export interface NetworkConfig {
    storageApiUrl: string;
    storageApiKey: string;
}