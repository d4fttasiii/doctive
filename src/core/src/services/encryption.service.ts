import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-ctr';

  encrypt(content: Buffer, key: string): Buffer {
    const iv = randomBytes(16);
    const keyHash = createHash('sha256')
      .update(key)
      .digest('base64')
      .substr(0, 32);
    const cipher = createCipheriv(this.algorithm, keyHash, iv);
    return Buffer.concat([iv, cipher.update(content), cipher.final()]);
  }

  decrypt(encrypted: Buffer, key: string): Buffer {
    const iv = encrypted.subarray(0, 16);
    encrypted = encrypted.subarray(16);
    const keyHash = createHash('sha256')
      .update(key)
      .digest('base64')
      .substr(0, 32);
    const decipher = createDecipheriv(this.algorithm, keyHash, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  encryptString(content: string, key: string): string {
    const encrypted = this.encrypt(Buffer.from(content, 'utf-8'), key);
    return encrypted.toString('hex');
  }

  decryptString(encrypted: string, key: string): string {
    const encryptedBytes = Buffer.from(encrypted, 'hex');
    const decryptedBytes = this.decrypt(encryptedBytes, key);
    return decryptedBytes.toString('utf-8');
  }
}