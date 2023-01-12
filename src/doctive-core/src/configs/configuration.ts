import { Config } from '../models/config';

export const DoctiveConfig = (): Config => ({
  app: {
    host: process.env.DOCTIVE_APP_HOST || 'localhost',
    port: process.env.DOCTIVE_APP_PORT ? parseInt(process.env.DOCTIVE_APP_PORT, 10) : 3000,
    apiKey: process.env.DOCTIVE_API_KEY || 'k333y',
    cors: {
      origin: process.env.DOCTIVE_APP_CORS_ORIGIN || 'http://localhost:4200',
      methods: process.env.DOCTIVE_APP_CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: process.env.DOCTIVE_APP_CORS_CREDENTIALS == 'true',
    }
  },
  web3: {
    url: process.env.DOCTIVE_WEB3_URL || 'http://localhost:8545',
  },
  keyVault: {
    url: 'https://{vaultName}.vault.azure.net',
  },
  sqlServer: {
    ip: process.env.DOCTIVE_SQLSERVER_URL || 'localhost',
    port: process.env.DOCTIVE_SQLSERVER_PORT ? parseInt(process.env.DOCTIVE_SQLSERVER_PORT, 10) : 1433,
    ssl: process.env.DOCTIVE_SQLSERVER_SSL == 'true',
    user: process.env.DOCTIVE_SQLSERVER_USER || 'sa',
    pass: process.env.DOCTIVE_SQLSERVER_PASSWORD || 'D0ct1v3_1337'
  },
  mongoDb: {
    endpoint: process.env.DOCTIVE_MONGODB_ENDPOINT || 'mongodb://localhost:27017',
    user: process.env.DOCTIVE_MONGODB_USER || 'mongo',
    pass: process.env.DOCTIVE_MONGODB_PASS || 'mongo',
    ssl: process.env.DOCTIVE_MONGODB_SSL == 'true',
  },
  ipfs: {
    bucket: process.env.DOCTIVE_S3_BUCKET || 'ipfs',
    endpoint: process.env.DOCTIVE_S3_ENDPOINT || 'localhost',
    port: process.env.DOCTIVE_S3_PORT ? parseInt(process.env.DOCTIVE_S3_PORT, 10) : 4566,
    useSsl: process.env.DOCTIVE_S3_SSL == 'true',
    accessKey: process.env.DOCTIVE_S3_ACCESSKEY || 'test',
    secretKey: process.env.DOCTIVE_S3_SECRETKEY || 'test',
  },
  redis: {
    host: process.env.DOCTIVE_REDIS_URL || 'localhost',
    port: process.env.DOCTIVE_REDIS_PORT ?
      parseInt(process.env.DOCTIVE_REDIS_PORT, 10) :
      6379,
    password: process.env.DOCTIVE_REDIS_PASSWORD,
  },
  jwt: {
    secretKey: process.env.DOCTIVE_JWT_SECRET_KEY || 'S3cr3t',
    refreshKey: process.env.DOCTIVE_JWT_REFRESH_KEY || 'S3cr3t_r3fr3sH',
    accessTokenExpiration: process.env.DOCTIVE_JWT_ACCESS_TOKEN_EXPIRATION || '5m',
    refreshTokenExpiration: process.env.DOCTIVE_JWT_ACCESS_TOKEN_EXPIRATION || '1d',
  },
  network: {
    storageApiUrl: process.env.DOCTIVE_STORAGE_API_URL || 'http://localhost:3002',
    storageApiKey: process.env.DOCTIVE_STORAGE_API_KEY || 'k333y',
  },
});